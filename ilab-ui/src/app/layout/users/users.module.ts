import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
@NgModule({
  declarations: [UsersComponent],
  imports: [CommonModule, UsersRoutingModule, NgbModule, FormsModule, SharedModule, ReactiveFormsModule],
})
export class UsersModule {}
