import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ChatComponent } from './components/chat/chat.component';
import { StatModule } from 'src/app/shared/modules/stat/stat.module';

@NgModule({
  declarations: [DashboardComponent, TimelineComponent, NotificationComponent, ChatComponent],
  imports: [CommonModule, NgbCarouselModule, NgbAlertModule, DashboardRoutingModule, StatModule],
})
export class DashboardModule {}
