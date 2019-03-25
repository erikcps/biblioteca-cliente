import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { User } from 'app/models/user';
import { Profile } from 'app/models/profile';
import { InputValidatorService } from 'app/services/input-validator.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
    selector   : 'register',
    templateUrl: './register.component.html',
    styleUrls  : ['./register.component.scss'],
    animations : fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy
{
    public roles: any;
    public modules: any;
    public branchOffices: any;
    public selectedRole: any;
    public selectedBranchOffice: any;

    public form: FormGroup;
    public formErrors: any;

    public user: User;
    public profile: Profile;

    // Horizontal Stepper
    public horizontalStepperStep1: FormGroup;
    public horizontalStepperStep2: FormGroup;
    public horizontalStepperStep3: FormGroup;
    public horizontalStepperStep1Errors: any;
    public horizontalStepperStep2Errors: any;
    public horizontalStepperStep3Errors: any;

    // Vertical Stepper
    public verticalStepperStep1: FormGroup;
    public verticalStepperStep2: FormGroup;
    public verticalStepperStep3: FormGroup;
    public verticalStepperStep1Errors: any;
    public verticalStepperStep2Errors: any;
    public verticalStepperStep3Errors: any;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _fuseConfigService: FuseConfigService,
        public inputValidator: InputValidatorService,
        private apollo: Apollo,
        private _router: Router,
        private _matSnackBar: MatSnackBar
    ) {
        this.roles = [];
        this.modules = [];
        this.branchOffices = [];
        this.user = new User();
        this.profile = new Profile();

        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        this.getRoles();
        this.getModules();
        this.getBranchOffices();

        // Reactive form errors
        this.formErrors = {
            company   : {},
            firstName : {},
            lastName  : {},
            address   : {},
            address2  : {},
            city      : {},
            state     : {},
            postalCode: {},
            country   : {}
        };

        // Horizontal Stepper form error
        this.horizontalStepperStep1Errors = {
            firstName: {},
            lastName : {}
        };

        this.horizontalStepperStep2Errors = {
            address: {}
        };

        this.horizontalStepperStep3Errors = {
            city      : {},
            state     : {},
            postalCode: {}
        };

        // Vertical Stepper form error
        this.verticalStepperStep1Errors = {
            firstName: {},
            lastName : {}
        };

        this.verticalStepperStep2Errors = {
            address: {}
        };

        this.verticalStepperStep3Errors = {
            city      : {},
            state     : {},
            postalCode: {}
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    private getBranchOffices() {
        const queryAllBranchOffices = gql`
        {
            branchOffices {
                id
                name
                city
                code    
            }
        }
      `;
  
      this.apollo
        .watchQuery({
          query: queryAllBranchOffices,
          fetchPolicy: "network-only"
        })
        .valueChanges.map((result: any) => result.data.branchOffices)
        .subscribe(data => {
          this.branchOffices = data;
        });
    }

    private getRoles() {
        const queryAllRoles = gql`
        {
          roles {
            id
            code
            name
            description
          }
        }
      `;
  
      this.apollo
        .watchQuery({
          query: queryAllRoles,
          fetchPolicy: "network-only"
        })
        .valueChanges.map((result: any) => result.data.roles)
        .subscribe(data => {
          this.roles = data;
        });
    }

    private getModules() {
        const queryAllModules = gql`
        {
          modules {
            id
            code
            name
            description
            checked
          }
        }
      `;
  
      this.apollo
        .watchQuery({
          query: queryAllModules,
          fetchPolicy: "network-only"
        })
        .valueChanges.map((result: any) => result.data.modules)
        .subscribe(data => {
          this.modules = data;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    //
    /**
     * On init
     */
    ngOnInit(): void
    {
        // Reactive Form
        this.form = this._formBuilder.group(
            {
                name     : ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
                lastname : ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
                username : ['', Validators.compose([ Validators.required,Validators.minLength(3), Validators.maxLength(30) ])],
                ci       : ['', Validators.compose([Validators.required, Validators.minLength(7),Validators.maxLength(12)])],
                addres   : ['', Validators.required],
                country  : ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
                cellphone: ['', Validators.compose([Validators.minLength(7), Validators.maxLength(12)])],
                phone    : ['', Validators.compose([Validators.minLength(6), Validators.maxLength(12)])],
                city     : ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
                password : ['',Validators.required],
                confirmPassword : [''],
                mail    : ['', Validators.compose([Validators.required, Validators.email])],
            },
            {
                validator: this.inputValidator.matchPassword,
            }
        );

        this.form.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onFormValuesChanged();
            });

        // Horizontal Stepper form steps
        this.horizontalStepperStep1 = this._formBuilder.group({
            firstName: ['', Validators.required],
            lastName : ['', Validators.required]
        });

        this.horizontalStepperStep2 = this._formBuilder.group({
            address: ['', Validators.required]
        });

        this.horizontalStepperStep3 = this._formBuilder.group({
            city      : ['', Validators.required],
            state     : ['', Validators.required],
            postalCode: ['', [Validators.required, Validators.maxLength(5)]]
        });

        this.horizontalStepperStep1.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onFormValuesChanged();
            });

        this.horizontalStepperStep2.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onFormValuesChanged();
            });

        this.horizontalStepperStep3.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onFormValuesChanged();
            });

        // Vertical Stepper form stepper
        this.verticalStepperStep1 = this._formBuilder.group({
            firstName: ['', Validators.required],
            lastName : ['', Validators.required]
        });

        this.verticalStepperStep2 = this._formBuilder.group({
            address: ['', Validators.required]
        });

        this.verticalStepperStep3 = this._formBuilder.group({
            city      : ['', Validators.required],
            state     : ['', Validators.required],
            postalCode: ['', [Validators.required, Validators.maxLength(5)]]
        });

        this.verticalStepperStep1.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onFormValuesChanged();
            });

        this.verticalStepperStep2.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onFormValuesChanged();
            });

        this.verticalStepperStep3.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onFormValuesChanged();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On form values changed
     */
    /**
     * valida camppos formulario 
     */
    

    onFormValuesChanged(): void
    {
        for ( const field in this.formErrors )
        {
            if ( !this.formErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.formErrors[field] = {};

            // Get the control
            const control = this.form.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.formErrors[field] = control.errors;
            }
        }
    }

    getSelectedModules() { // right now: ['1','3']
        return this.modules
          .filter(opt => opt.checked)
          .map(opt => opt.id)
    }

    updateCheckedModules(module, event) {
        module.checked = event.checked;
    }

    /**
     * Finish the horizontal stepper
     */
    finishHorizontalStepper(): void
    {
        this.user.profile = this.profile;
        this.user.rolId = this.selectedRole;
        this.user.branchOfficeId = this.selectedBranchOffice;
        this.user.modulesIds = this.getSelectedModules();

        const queryInsert = gql`
            mutation  {
                createUser(
                username: "${this.user.username}"
                password: "${this.user.password}"
                roleId: ${this.user.rolId}
                branchOfficeId: ${this.user.branchOfficeId}
                modulesId: [${this.user.modulesIds}]
                profile: {
                    name: "${this.profile.name}"
                    lastName: "${this.profile.lastName}"
                    address: "${this.profile.address}"
                    ci: "${this.profile.ci}"
                    city: "${this.profile.city}"
                    country: "${this.profile.country}"
                    telephone: "${this.profile.telephone}"
                    cellphone: "${this.profile.cellphone}"
                    email: "${this.profile.email}"
                }) {
                    id
                    username
                    profile {
                        id
                        name
                        lastName
                    }
                }
            }
      `;

        this.apollo.mutate({ mutation: queryInsert })
        .subscribe(
          ({ data }) => {
            // Show the success message
            this._matSnackBar.open('Usuario Guaradado', 'OK', {
                verticalPosition: 'top',
                duration        : 3000
            });
            this._router.navigate(['/auth/sign-in']);
          },
          error => {
            console.log("there was an error sending the query", error);
          }
        );
        
    }

    /**
     * Finish the vertical stepper
     */
    finishVerticalStepper(): void
    {
        alert('You have finished the vertical stepper!');
    }
};
