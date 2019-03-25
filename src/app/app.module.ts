import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FormsModule } from '@angular/forms';

import {    MatButtonModule, 
            MatFormFieldModule, 
            MatInputModule, 
            MatIconModule, 
            MatSelectModule,
            MatPaginatorModule,
            MatProgressSpinnerModule,
            MatSortModule,
            MatTableModule,
            MatToolbarModule,
            MatStepperModule,
            MatCheckboxModule,
            MatDividerModule,
            MatDatepickerModule,
} from '@angular/material';
import { MatDialogModule} from '@angular/material/dialog';

import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';

// Apollo
import { GraphQLModule } from "./graphql.module";
import { InputValidatorService } from './services/input-validator.service';
import { CreateClientComponent } from './main/shared-components/create-client/create-client.component';
import { CreateGuaranteeComponent } from './main/shared-components/create-guarantee/create-guarantee.component';

import {Ng2Webstorage} from 'ngx-webstorage';
import { DataSharedService } from './services/data-shared.service';
import { CreateGuaranteeClientComponent } from './main/guarantee/create-guarantee-client/create-guarantee-client.component';
import { PayInterestLoanComponent } from './main/loan/pay-interest-loan/pay-interest-loan.component';


// SPANISH DATE
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';

// importar locales
import localePy from '@angular/common/locales/es-PY';
import { DialogConfirmationComponent } from './main/shared-components/dialog-confirmation/dialog-confirmation.component';
import { TrackingGuaranteeComponent } from './main/shared-components/tracking-guarantee/tracking-guarantee.component';
import { PayLoanComponent } from './main/loan/pay-loan/pay-loan.component';
import { DismissLoanComponent } from './main/loan/dismiss-loan/dismiss-loan.component';

// registrar los locales con el nombre que quieras utilizar a la hora de proveer
registerLocaleData(localePy, 'es');

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/auth/sign-in',
        pathMatch: 'full',
    },
    {
        path        : 'auth',
        loadChildren: './main/auth/auth.module#AuthModule'
    },
    {
        path        : 'branch-offices',
        loadChildren: './main/branch-office/branch-office.module#BranchOfficeModule'
    },
    {
        path        : 'clients',
        loadChildren: './main/client/client.module#ClientModule'
    },
    {
        path        : 'guarantees',
        loadChildren: './main/guarantee/guarantee.module#GuaranteeModule'
    },
    {
        path        : 'loans',
        loadChildren: './main/loan/loan.module#LoanModule'
    },
    {
        path        : 'settings',
        loadChildren: './main/settings/settings.module#SettingsModule'
    }
];

@NgModule({
    declarations: [
        AppComponent,
        CreateClientComponent,
        CreateGuaranteeComponent,
        CreateGuaranteeClientComponent,
        PayInterestLoanComponent,
        DialogConfirmationComponent,
        TrackingGuaranteeComponent,
        PayLoanComponent,
        DismissLoanComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        FormsModule,
        MatPaginatorModule, 
        MatProgressSpinnerModule, 
        MatSortModule, 
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatToolbarModule,
        MatSelectModule,
        MatStepperModule,
        MatCheckboxModule,
        MatDividerModule,
        MatDatepickerModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        SampleModule,

        //APOLLO
        GraphQLModule,

        //STORAGE
        Ng2Webstorage
    ],
    providers: [
        { 
            provide: LOCALE_ID, 
            useValue: 'es' 
        },
        InputValidatorService,
        DataSharedService
    ],
    bootstrap   : [
        AppComponent
    ],
    entryComponents: [
        CreateClientComponent,
        CreateGuaranteeComponent,
        CreateGuaranteeClientComponent,
        PayInterestLoanComponent,
        DialogConfirmationComponent,
        TrackingGuaranteeComponent,
        PayLoanComponent,
        DismissLoanComponent
    ]
})
export class AppModule
{
}
