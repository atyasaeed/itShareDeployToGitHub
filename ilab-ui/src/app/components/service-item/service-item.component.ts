import { Service } from './../../domain/service.model';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { APP_CONFIG, IAppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-service-item',
  templateUrl: './service-item.component.html',
  styleUrls: ['./service-item.component.css']
})
export class ServiceItemComponent implements OnInit {

 @Input() service: Service;

 constructor(@Inject(APP_CONFIG) private appConfig:IAppConfig) { }

  ngOnInit() {
  }
  getImageUrl():string{
    return this.appConfig.ASSETS_URL+this.service.id;
  }
}
