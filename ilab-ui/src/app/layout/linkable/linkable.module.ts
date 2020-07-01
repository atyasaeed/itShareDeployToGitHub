import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkableComponent } from './linkable.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LinkableComponent],
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    FormsModule,
    SharedModule,
    PageHeaderModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    //FormsModule,
    ReactiveFormsModule,
    CovalentLoadingModule,
    //CovalentDialogsModule,
    MatIconModule,
    //MatButtonModule,
    //MatSelectModule,
  ],
  exports: [LinkableComponent],
})
export class LinkableModule {}
