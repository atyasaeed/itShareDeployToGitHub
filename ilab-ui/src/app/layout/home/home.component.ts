import { Component, OnInit, ViewChildren, QueryList, Inject } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
// import { CourseService } from '../courses/course.service';
import { Observable } from 'rxjs';
// import { SortableHeaderDirective } from 'src/app/shared/directives/sortable.directive';
// import { HomeService } from './home.service';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { Service } from 'src/app/shared/domain';
import { HttpClient } from '@angular/common/http';
import { TdLoadingService } from '@covalent/core/loading';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [routerTransition()],
})
export class HomeComponent implements OnInit {
  // _searchTerm = '';
  public sliders: Array<any> = [];
  // entities$: Observable<Service[]>;
  // total$: Observable<number>;
  // @ViewChildren(SortableHeaderDirective) headers: QueryList<SortableHeaderDirective>;

  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    loadingService: TdLoadingService
  ) {
    // super(service, loadingService);
    this.http.get(this.appConfig.SLIDER_URL).subscribe((res) => {
      this.sliders = res as any;
    });
  }

  ngOnInit(): void {
    // this.entities$ = this.service.model$;
    // this.total$ = this.service.total$;
  }

  // set searchTerm(searchTerm: string) {
  //   this._searchTerm = searchTerm;
  //   if (searchTerm) {
  //     this.service.searchTerm = `service.enName:'*${searchTerm}*'`;
  //     // this.service.searchTerm = `program.enName:'*${searchTerm}*' OR address:'*${searchTerm}*'`;
  //   } else {
  //     this.service.searchTerm = '';
  //   }
  // }
  // get searchTerm() {
  //   return this._searchTerm;
  // }
}
