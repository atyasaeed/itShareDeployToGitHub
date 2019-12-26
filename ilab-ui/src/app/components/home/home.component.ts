import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { NgForm } from '@angular/forms';
import { Card } from '../card/card.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cards: any [];
  card = {
    name:'',
    description :''
  }

  ngOnInit(): void {
 this.getservices()
  }

  constructor(private _http: HttpClient ,private _restservice:RestService , private _route: ActivatedRoute) { }

  getservices(){
 this._restservice.getservices().subscribe(res=>{this.cards = res as []})
}

addservices(cardForm){
this._restservice.addservices(cardForm).subscribe(res=>{console.log(res); this.cards.push(res)})

}


  /////////// Carousel//////////////////
  // tslint:disable-next-line: member-ordering
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  //////////////////////////////////////

}



