import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import 'rxjs/add/operator/map';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Navigation } from 'app/navigation/navigation';
import { locale as navigationEnglish } from 'app/navigation/i18n/en';
import { locale as navigationTurkish } from 'app/navigation/i18n/tr';

import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { LocalStorageService } from 'ngx-webstorage';
import 'rxjs/add/operator/map';
import { DataSharedService } from './services/data-shared.service';

@Component({
	selector: 'app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	fuseConfig: any;
	modulesAvailables: any;

	// Private
	private _unsubscribeAll: Subject<any>;

	/**
	 * Constructor
	 *
	 * @param {DOCUMENT} document
	 * @param {FuseConfigService} _fuseConfigService
	 * @param {FuseNavigationService} _fuseNavigationService
	 * @param {FuseSidebarService} _fuseSidebarService
	 * @param {FuseSplashScreenService} _fuseSplashScreenService
	 * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
	 * @param {Platform} _platform
	 * @param {TranslateService} _translateService
	 */
	constructor(
		@Inject(DOCUMENT) private document: any,
		private _fuseConfigService: FuseConfigService,
		private _fuseNavigationService: FuseNavigationService,
		private _fuseSidebarService: FuseSidebarService,
		private _fuseSplashScreenService: FuseSplashScreenService,
		private _fuseTranslationLoaderService: FuseTranslationLoaderService,
		private _translateService: TranslateService,
		private _platform: Platform,
		private apollo: Apollo,
		private storage: LocalStorageService,
		private dataSharedService: DataSharedService
	) {
		// Get default navigation
		const navigation = new Navigation();

		// Register the navigation to the service
		this._fuseNavigationService.register('main', navigation.getNavigation());

		// All modules Availables
		this._fuseNavigationService.setModules(navigation.getNavigation());

		// Set the main navigation as our current navigation
		this._fuseNavigationService.setCurrentNavigation('main');

		// Add languages
		this._translateService.addLangs(['en', 'tr']);

		// Set the default language
		this._translateService.setDefaultLang('en');

		// Set the navigation translations
		this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, navigationTurkish);

		// Use a language
		this._translateService.use('en');

		// Add is-mobile class to the body if the platform is mobile
		if (this._platform.ANDROID || this._platform.IOS) {
			this.document.body.classList.add('is-mobile');
		}

		// Set the private defaults
		this._unsubscribeAll = new Subject();

		this.settingModulesForCurrentUser();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		// Subscribe to config changes
		this._fuseConfigService.config
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((config) => {
				this.fuseConfig = config;

				if (this.fuseConfig.layout.width === 'boxed') {
					this.document.body.classList.add('boxed');
				}
				else {
					this.document.body.classList.remove('boxed');
				}
			});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next();
		this._unsubscribeAll.complete();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Toggle sidebar open
	 *
	 * @param key
	 */
	toggleSidebarOpen(key): void {
		this._fuseSidebarService.getSidebar(key).toggleOpen();
	}


	private settingModulesForCurrentUser() {
		const userId = this.storage.retrieve('uui');
		if(userId) {
			const queryLogin = gql`
			{
				userById(userId: ${userId}) {
					modules {
						name
					}
					profile {
						name
						lastName
						email
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
			.valueChanges.map((result: any) => result.data.userById)
			.subscribe(data => {
				this.dataSharedService.changeMessage(data);
				const nameModules = data.modules.map(module => {
					return module.name;
				})
				const availableModules = this._fuseNavigationService.getModules();
				availableModules.map(moduleAvailable => {
					if(!nameModules.includes(moduleAvailable)) {
						this._fuseNavigationService.removeNavigationItem(moduleAvailable);
					}
				})
			});
		}
	}
}
