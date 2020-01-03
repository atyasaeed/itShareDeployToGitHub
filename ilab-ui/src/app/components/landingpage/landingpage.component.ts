import { Component, OnInit,Input } from '@angular/core';
import { Service } from 'src/app/domain';
import { ServicesService } from 'src/app/services';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit {

  // @Input() services : Service[];
  services:Array<Service>;

  constructor(private restService:ServicesService) { }

  ngOnInit() {
    //services should be populated from the backend
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
