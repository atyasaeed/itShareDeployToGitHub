import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';

import { AssetFile, Service } from 'src/app/shared/domain';
import { routerTransition } from 'src/app/router.animations';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { TdLoadingService } from '@covalent/core/loading';
import { MySpaceService } from 'src/app/shared/services/my-space.service';
import { getLang } from 'src/app/store';

@Component({
  selector: 'app-my-space',
  templateUrl: './my-space.component.html',
  styleUrls: ['./my-space.component.scss'],
  animations: [routerTransition()],
})
export class MySpaceComponent extends DefaultListComponent<AssetFile, MySpaceService> implements OnInit {
  breadcrumbs = [{ heading: 'spaces', icon: 'fa-tasks' }];
  private _searchTerm = '';
  Authservices: Service[];
  filterService: Service[] = new Array();
  modalRef: BsModalRef;
  lang: string;
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false,
    class: 'my-modal',
  };
  constructor(
    service: MySpaceService,
    @Inject(APP_CONFIG) public appConfig: IAppConfig,
    private appStore: Store<fromStore.AppState>,
    private modalService: BsModalService,
    private router: Router,
    loadingService: TdLoadingService
  ) {
    super(service, loadingService);
    this.appStore.select(fromStore.getAuthServices).subscribe((res) => {
      this.Authservices = res;
    });
    this.appStore.select(getLang).subscribe((res) => {
      this.lang = res;
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
  getServices(entity: AssetFile) {
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
  openModal(template) {
    this.modalRef = this.modalService.show(template, this.config);
    console.log(this.filterService);
  }

  chooseService($event, entity) {
    this.router.navigate(['shopping-cart/CartItem', { id: $event.target.value }], {
      state: entity,
    });
  }
}
