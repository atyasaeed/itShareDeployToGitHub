import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
// import { CourseService } from '../courses/course.service';
import { Observable } from 'rxjs';
// import { SortableHeaderDirective } from 'src/app/shared/directives/sortable.directive';
import { HomeService } from './home.service';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { Service } from 'src/app/shared/domain';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [routerTransition()],
})
export class HomeComponent extends DefaultListComponent<Service, HomeService> implements OnInit {
  _searchTerm = '';
  public sliders: Array<any> = [];
  entities$: Observable<Service[]>;
  total$: Observable<number>;
  // @ViewChildren(SortableHeaderDirective) headers: QueryList<SortableHeaderDirective>;

  constructor(public service: HomeService, private http: HttpClient) {
    super(service);
    this.http.get('https://gedoabdo.s3.us-east-2.amazonaws.com/slides.json').subscribe((res) => {
      this.sliders = res as any;
    });
  }

  ngOnInit(): void {
    this.entities$ = this.service.model$;
    this.total$ = this.service.total$;
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    if (searchTerm) {
      this.service.searchTerm = `service.enName:'*${searchTerm}*'`;
      // this.service.searchTerm = `program.enName:'*${searchTerm}*' OR address:'*${searchTerm}*'`;
    } else {
      this.service.searchTerm = '';
    }
  }
  get searchTerm() {
    return this._searchTerm;
  }
}
