import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserFormComponent } from './user-form/user-form.component';
import { ImportUsersComponent } from './import-users/import-users.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
   { path: 'import-users', component: ImportUsersComponent },
  { path: 'create', component: UserFormComponent },
  { path: ':entityId', component: UserFormComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
