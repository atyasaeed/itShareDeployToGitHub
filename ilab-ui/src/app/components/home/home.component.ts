import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cards: any [];
  param = this._route.snapshot.paramMap.get('email');
  ngOnInit(): void {

    this.getServices();

  }

  constructor(private _http: HttpClient , private _route: ActivatedRoute) { }


  getServices() {
    this._http.get('http://localhost:8080/api/services').subscribe(
      response => this.cards = response as [],
      errore => {console.log(errore); });
  }

  isLogIn(): boolean {
    if (localStorage.getItem('token') != null) {

      return true;
    } else {
      return false;
    }
  }


  /////////// Carousel//////////////////
  // tslint:disable-next-line: member-ordering
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  //////////////////////////////////////

}



