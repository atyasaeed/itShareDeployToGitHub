import { Component, OnInit,Input } from '@angular/core';
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

  constructor(private restService:ServicesService) { }

  ngOnInit() {
    this.service.query<Service[]>().subscribe(services=>this.services=services)
    // this.services=[
    //   {id:1, name:'3D Printing', img:'assets/img06.jpg', description: 'Test test Test1'},
    //   {id:1, name:'3D Printing2', img:'assets/img06.jpg', description: 'Test test Test2'},
    //   {id:1, name:'3D Printing3', img:'assets/img06.jpg', description: 'Test test Test3'}

    // ];
    this.restService.getAll().subscribe((services:Array<Service>)=>{
      this.services=services;
    });

  }

}
