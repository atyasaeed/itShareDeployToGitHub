import { Component, OnInit } from '@angular/core';
import { DefaultListComponent } from 'src/app/shared/helpers/default.list.component';
import { mySpaceService } from './my-space.service';
import { assetFile } from 'src/app/shared/domain';
import { routerTransition } from 'src/app/router.animations';

@Component({
  selector: 'app-my-space',
  templateUrl: './my-space.component.html',
  styleUrls: ['./my-space.component.scss'],
  animations: [routerTransition()],
})
export class MySpaceComponent extends DefaultListComponent<assetFile, mySpaceService> implements OnInit {
  breadcrumbs = [{ heading: 'Spaces', icon: 'fa-tasks' }];
  private _searchTerm = '';
  constructor(service: mySpaceService) {
    super(service);
  }

  ngOnInit(): void {}

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    if (searchTerm) {
      this.service.searchTerm = `status:'*${searchTerm}*' OR id:'*${searchTerm}*'`;
    } else {
      this.service.searchTerm = '';
    }
  }
  get searchTerm() {
    return this._searchTerm;
  }
}
