import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { mySpaceService } from './my-space.service';
import { assetFile, Service } from 'src/app/shared/domain';
import { routerTransition } from 'src/app/router.animations';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-my-space',
  templateUrl: './my-space.component.html',
  styleUrls: ['./my-space.component.scss'],
  animations: [routerTransition()],
})
export class MySpaceComponent extends DefaultListComponent<assetFile, mySpaceService> implements OnInit {
  breadcrumbs = [{ heading: 'Spaces', icon: 'fa-tasks' }];
  private _searchTerm = '';
  Authservices: Service[];
  filterService: Service[] = new Array();
  modalRef: BsModalRef;
  constructor(
    service: mySpaceService,
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    private appStore: Store<fromStore.AppState>,
    private modalService: BsModalService
  ) {
    super(service);
    this.appStore.select(fromStore.getAuthServices).subscribe((res) => {
      console.log(res);
      this.Authservices = res;
    });
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    if (searchTerm) {
      this.service.searchTerm = `name:'*${searchTerm}*'`;
    } else {
      this.service.searchTerm = '';
    }
  }
  get searchTerm() {
    return this._searchTerm;
  }

  getImageUrl(id): string {
    return this.appConfig.FILE_URL + id;
  }
  getFileUrl(id): string {
    return this.appConfig.FILE_URL + id;
  }
  getServices(entity: assetFile) {
    // console.log(entity);
    // console.log(entity.name.split('.').pop());
    // let filterService: Service[] = new Array();
    this.filterService = [];

    let ext = entity.name.split('.').pop();
    for (let index = 0; index < this.Authservices.length; index++) {
      for (let i = 0; i < this.Authservices[index].supportedExtensions.length; i++) {
        // console.log(this.Authservices[index].supportedExtensions[i].split('.').pop());
        if (this.Authservices[index].supportedExtensions[i].split('.').pop() == ext) {
          // console.log(this.Authservices[index]);
          this.filterService.push(this.Authservices[index]);
        }
      }
    }
    console.log(this.filterService);
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    console.log(this.filterService);
  }
}
