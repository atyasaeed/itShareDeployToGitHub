import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cards: any [];
  ngOnInit(): void {
  this._http.get('http://localhost:8080/api/services').subscribe(
      response =>this.cards=response as [],
      errore => {console.log(errore); }

    );
  }

  constructor(private _http: HttpClient) { }



  /////////// Carousel//////////////////
  // tslint:disable-next-line: member-ordering
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  //////////////////////////////////////

}



