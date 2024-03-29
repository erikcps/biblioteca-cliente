import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { SampleComponent } from './sample.component';

const routes = [
	{
		path: 'example2',
		component: SampleComponent
	}
];

@NgModule({
	declarations: [
		SampleComponent
	],
	imports: [
		RouterModule.forChild(routes),

		TranslateModule,

		FuseSharedModule
	],
	exports: [
		SampleComponent
	]
})

export class SampleModule {
}
