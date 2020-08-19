import { Component, OnInit, Input, Inject } from '@angular/core';
import { Service } from 'src/app/shared/domain';

import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss'],
})
export class ServiceCardComponent implements OnInit {
  @Input() entity: Service;

  constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig) {}

  ngOnInit(): void {}
}
