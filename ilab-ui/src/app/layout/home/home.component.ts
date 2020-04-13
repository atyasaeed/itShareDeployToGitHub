import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
// import { CourseService } from '../courses/course.service';
import { Observable } from 'rxjs';
// import { SortableHeaderDirective } from 'src/app/shared/directives/sortable.directive';
import { HomeService } from './home.service';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { Service } from 'src/app/shared/domain';

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
  constructor(public service: HomeService) {
    super(service);
    this.sliders.push(
      {
        imagePath: 'assets/images/slider1.jpg',
        label: 'First slide label',
        text: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      },
      {
        imagePath: 'assets/images/slider2.jpg',
        label: 'Second slide label',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      {
        imagePath: 'assets/images/slider3.jpg',
        label: 'Third slide label',
        text: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.',
      }
    );
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
