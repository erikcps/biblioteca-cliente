import { Component, OnDestroy, OnInit,ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { SelectionModel } from '@angular/cdk/collections';
import { CreateClientComponent } from 'app/main/shared-components/create-client/create-client.component';
import { CreateGuaranteeComponent } from 'app/main/shared-components/create-guarantee/create-guarantee.component';
import { Loan } from 'app/models/loan';
import { Client } from 'app/models/client';
import { LocalStorageService } from 'ngx-webstorage';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-create-guarantee-client',
  templateUrl: './create-guarantee-client.component.html',
  styleUrls: ['./create-guarantee-client.component.scss'],
  animations: [
    fuseAnimations,
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class CreateGuaranteeClientComponent implements OnInit {

  // CLIENTS
  dialogRef: any;
  clients: any;
  
  columnsToDisplay = ['id', 'code', 'name', 'lastName', 'ci', 'createdAt', 'active'];
  expandedElement: any;
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // END CLIENTS

  // GUARANTEES
  dialogRefGuarantee: any;
  guarantees: any;

  columnsToDisplayGuarantee = ['select', 'id', 'code', 'brand', 'model', 'createdAt', 'guaranteeStatus'];
  expandedElementGuarantee: any;
  dataSourceGuarantee: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginatorGuarantee: MatPaginator;
  @ViewChild(MatSort) sortGuarantee: MatSort;
  // END GUARANTEES

  form: FormGroup;
  formErrors: any;

  selection = new SelectionModel<any>(true, []);
  loan = new Loan();
  currentDate: Date;
  selectedClient: Client;

  // Horizontal Stepper
  horizontalStepperStep1: FormGroup;
  horizontalStepperStep2: FormGroup;
  horizontalStepperStep1Errors: any;
  horizontalStepperStep2Errors: any;

  // Vertical Stepper
  verticalStepperStep1: FormGroup;
  verticalStepperStep2: FormGroup;
  verticalStepperStep1Errors: any;
  verticalStepperStep2Errors: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {FormBuilder} _formBuilder
   */
  constructor(private _formBuilder: FormBuilder,
              private apollo: Apollo,
              private _matDialog: MatDialog,
              public matDialogRef: MatDialogRef<CreateGuaranteeClientComponent>,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              private storage: LocalStorageService) {
    matDialogRef.disableClose = true;
    this.getClients();
    this.getGuarantees();
    this.currentDate = new Date();

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

    // Vertical Stepper form error
    this.verticalStepperStep1Errors = {
        firstName: {},
        lastName : {}
    };

    this.verticalStepperStep2Errors = {
        address: {}
    };

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  { 
    this.selectedClient = new Client();
    // Reactive Form
    this.form = this._formBuilder.group({
        company   : [
            {
                value   : 'Google',
                disabled: true
            }, Validators.required
        ],
        firstName : ['', Validators.required],
        lastName  : ['', Validators.required],
        address   : ['', Validators.required],
        address2  : ['', Validators.required],
        city      : ['', Validators.required],
        state     : ['', Validators.required],
        postalCode: ['', [Validators.required, Validators.maxLength(5)]],
        country   : ['', Validators.required]
    });

    this.form.valueChanges
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
            this.onFormValuesChanged();
        });

    // Horizontal Stepper form steps
    this.horizontalStepperStep1 = this._formBuilder.group({
        // firstName: ['', Validators.required],
        // lastName : ['', Validators.required]
    });

    this.horizontalStepperStep2 = this._formBuilder.group({
        // address: ['', Validators.required]
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

    // Vertical Stepper form stepper
    this.verticalStepperStep1 = this._formBuilder.group({
        firstName: ['', Validators.required],
        lastName : ['', Validators.required]
    });

    this.verticalStepperStep2 = this._formBuilder.group({
        address: ['', Validators.required]
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
  onFormValuesChanged(): void
  {
    for ( const field in this.formErrors ) {
      if ( !this.formErrors.hasOwnProperty(field) ) {
          continue;
      }

      // Clear previous errors
      this.formErrors[field] = {};

      // Get the control
      const control = this.form.get(field);

      if ( control && control.dirty && !control.valid ) {
          this.formErrors[field] = control.errors;
      }
    }
  }

  /**
   * Finish the horizontal stepper
   */
  finishHorizontalStepper(): void
  {
      alert('You have finished the horizontal stepper!');
  }

  /**
   * Finish the vertical stepper
   */
  finishVerticalStepper(): void
  {
      alert('You have finished the vertical stepper!');
  }

  private getClients() {
    const queryAllClients = gql`
      {
        clients {
          id
          code
          typeClient
          nameToInvoice
          sinNit
          createdAt
          active
          profile {
            id
            name
            lastName
            ci
            address
            telephone
            cellphone
            country
            city
            address
            email
            createdAt
            active      
          }
          guarantees {
            id
            code
            brand
            model
            description
            baseValue
            typeGuarantee
            guaranteeStatus
            active
            createdAt
            branchOffice {
              name
              city
              address
            }
          }
        }
      }
    `;
  
    this.apollo
      .watchQuery({
        query: queryAllClients,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.clients)
      .subscribe(data => {
        //Clientes
        this.clients = data;
        this.dataSource = new MatTableDataSource(this.clients);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  private getGuarantees() {
    const queryGuarantees = gql`
      {
        guarantees {
          id
          code
          brand
          model
          description
          baseValue
          typeGuarantee
          guaranteeStatus
          active
          createdAt
          branchOffice {
            name
            city
            address
          }
        }
      }
    `;
  
    this.apollo
      .watchQuery({
        query: queryGuarantees,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.guarantees)
      .subscribe(data => {
        this.guarantees = data;
        this.dataSourceGuarantee = new MatTableDataSource(this.guarantees);
        this.dataSourceGuarantee.paginator = this.paginatorGuarantee;
        this.dataSourceGuarantee.sort = this.sortGuarantee;
      });
  }


  openDialogClient(): void {
    this.dialogRef = this._matDialog.open(CreateClientComponent, {
      data      : {
          action: 'new',
      }
    });

    this.dialogRef.afterClosed()
        .subscribe(response => {
          if(response && response.createClient) {
            this.dataSource.data.push(response.createClient);
            this.dataSource.data = this.dataSource.data.slice();
          }
        });
  }

  openDialogGuarantee(): void {
    this.dialogRefGuarantee = this._matDialog.open(CreateGuaranteeComponent, {
      data      : {
          clientId: this.selectedClient.id,
          action: 'new',
      }
    });

    this.dialogRefGuarantee.afterClosed()
        .subscribe(response => {
          if(response && response.createGuarantee) {
            this.dataSourceGuarantee.data.push(response.createGuarantee);
            this.dataSourceGuarantee.data = this.dataSourceGuarantee.data.slice();
          }
        });
  }

  closeDialog() {
    this.getGuarantees();
    this.matDialogRef.close();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  chooseClient(client) {
    this.selectedClient = client;

    this.dataSourceGuarantee = new MatTableDataSource(client.guarantees);
    this.dataSourceGuarantee.paginator = this.paginatorGuarantee;
    this.dataSourceGuarantee.sort = this.sortGuarantee;
  }

  goToSummary(){
  }

  saveLoan() {
   
  }

  getLoans() {
  }
}
