import { Component, OnInit,Input } from '@angular/core';
import { Service } from 'src/app/domain';

// let service : Service = {id:1, name:'3D Printing', img:'assets/img06.jpg', description: 'Test test Test' };

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.css']
})
export class ServiceCardComponent implements OnInit {

  @Input() service : Service;
  // @Input() services : Service[];

  constructor() { }

  ngOnInit() {
  }

}
