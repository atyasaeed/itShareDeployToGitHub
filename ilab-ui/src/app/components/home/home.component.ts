import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cards: any [];
  param = this._route.snapshot.paramMap.get('email');
  ngOnInit(): void {

  }

  constructor(private _http: HttpClient ,private _restservice:RestService , private _route: ActivatedRoute) { }





  /////////// Carousel//////////////////
  // tslint:disable-next-line: member-ordering
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  //////////////////////////////////////

}



