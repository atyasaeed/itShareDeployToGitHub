import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryComponent } from './gallery.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { StlModelViewerModule } from 'angular-stl-model-viewer';
import { TooltipModule } from 'ng2-tooltip-directive';
import { CovalentLoadingModule } from '@covalent/core/loading';
@NgModule({
  declarations: [GalleryComponent],
  imports: [
    CommonModule,
    GalleryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PageHeaderModule,
    TranslateModule,
    //MatButtonModule,
    //MatIconModule,
    NgbModule,
    StlModelViewerModule,
    TooltipModule,
    CovalentLoadingModule,
  ],
})
export class GalleryModule {}
