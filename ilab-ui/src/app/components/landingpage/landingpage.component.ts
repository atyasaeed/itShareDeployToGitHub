import { Component, OnInit } from '@angular/core';
import { Service } from 'src/app/domain/service.model';
import { ServicesService } from 'src/app/services';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit {

  services: Service [];
  constructor(private service: ServicesService ) { }

  ngOnInit() {
    this.service.query<Service[]>().subscribe(services=>this.services=services)
  }

}
