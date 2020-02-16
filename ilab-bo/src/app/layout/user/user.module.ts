import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdSortableHeader } from './sortable.directive';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
  declarations: [UserComponent, NgbdSortableHeader],
  imports: [CommonModule, UserRoutingModule, NgbModule, FormsModule, ReactiveFormsModule],
})
export class UserModule {}
