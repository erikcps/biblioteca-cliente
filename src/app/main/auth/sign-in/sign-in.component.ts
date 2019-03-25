import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

import { Router } from '@angular/router';

import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

import { LocalStorageService } from 'ngx-webstorage';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { Navigation } from 'app/navigation/navigation';
import { MatSnackBar } from '@angular/material';
import { DataSharedService } from 'app/services/data-shared.service';


@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss'],
	animations: fuseAnimations
})
export class SignInComponent implements OnInit {

	loginForm: FormGroup;
	username: string;
	password: string;
	navigation: any;

  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FormBuilder} _formBuilder
   */
	constructor(
		private _fuseConfigService: FuseConfigService,
		private _formBuilder: FormBuilder,
		private apollo: Apollo,
		private router: Router,
		private storage: LocalStorageService,
		private _fuseNavigationService: FuseNavigationService,
		private _matSnackBar: MatSnackBar,
		private dataSharedService: DataSharedService
	) {
		// Configure the layout
		this._fuseConfigService.config = {
			layout: {
				navbar: {
					hidden: true
				},
				toolbar: {
					hidden: true
				},
				footer: {
					hidden: true
				},
				sidepanel: {
					hidden: true
				}
			}
		};

		this.username = '';
		this.password = '';
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
	ngOnInit(): void {
		this.loginForm = this._formBuilder.group({
			username: ['', [Validators.required]],
			password: ['', Validators.required]
		});
	}

	login() {
		const queryLogin = gql`
		{
			doLogin(password: "${this.password}", username: "${this.username}") {
				username
				active
				id
				profile {
					id
					name
					lastName
					email
				}
				modules {
					id
					name
				}
				branchOffice {
					id
					name
					city
					address
				}
			}
		}    
	`;

	this.apollo
		.watchQuery({
			query: queryLogin,
			fetchPolicy: "network-only"
		})
		.valueChanges.map((result: any) => result.data.doLogin)
		.subscribe(data => {
			if (data && data.id && data.active) {
				const navigation = new Navigation();
				this.storage.store('uui', data.id);
				this.storage.store('suc', data.branchOffice.id);
				this.dataSharedService.changeMessage(data);

				const nameModules = data.modules.map(module => {
					return module.name;
				})
				this._fuseNavigationService.unregister('main');
				this._fuseNavigationService.register('main', navigation.getNavigation());
				const modulesAvailables = this._fuseNavigationService.getModules();
				modulesAvailables.map(moduleAvailable => {
					if (!nameModules.includes(moduleAvailable)) {
						this._fuseNavigationService.removeNavigationItem(moduleAvailable);
					}
				})
				this.router.navigate(["/loans/list"]);
				
				this._matSnackBar.open(`Bienvenido ${data.profile.name} ${data.profile.lastName}`, 'OK', {
					verticalPosition: 'top',
					duration        : 3000
				});

			} else {
				this._matSnackBar.open('Nombre de Usuario o Password son Incorrectos!', 'OK', {
					verticalPosition: 'top',
					duration        : 3000
				});
			}
		});
	}
}
