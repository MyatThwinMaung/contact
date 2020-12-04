import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';

const routes: Routes = [
	{ path: '', redirectTo: 'contact/list', pathMatch: 'full' },
	{ path: 'contact/list', component: ListComponent },
	{ path: 'contact/add', component: AddEditComponent },
	{ path: 'contact/edit/:contactId', component: AddEditComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ContactRoutingModule { }
