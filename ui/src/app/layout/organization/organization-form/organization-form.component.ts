import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdLoadingService } from '@covalent/core/loading';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';
import { Organization, Service } from 'src/app/shared/domain';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';
import { OrderService } from 'src/app/shared/services/order.service';
import { OrganizationService } from 'src/app/shared/services/organization.service';
import { routerTransition } from 'src/app/router.animations';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { from } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { City } from 'src/app/signup/signup-partner/city';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-organization-form',
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.scss'],
  animations: [routerTransition()],
})
export class OrganizationFormComponent extends DefaultFormComponent<Organization, OrganizationService>
  implements OnInit {
  breadcrumbs = [
    { heading: 'organization', icon: 'fa-tasks', link: '/organizations' },
    { heading: 'organization-Details', icon: 'fa-tasks' },
  ];
  public totalfiles: Array<File> = [];
  lang: string;
  public totalFileName = [];
  city: City = {} as City;
  cities: City[] = new Array();
  toggleButton: boolean;
  roleAdmin: boolean;
  dropdownList: Service[] = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  arrStatus: string[] = ['Pending Validation', 'Active', 'Rejected'];
  org: Organization = {
    name: 'body',
    mobileNo: '01019195633',
    address: 'jdhfhfhfhfh',
    city: { id: 'القاهرة', arName: 'القاهرة', enName: 'Cairo' },
    services: [],
    website: '',
    id: 'jdjd',
    status: 'Pending Approval',
  };
  constructor(
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    service: OrganizationService,
    private http: HttpClient,
    route: ActivatedRoute,
    router: Router,
    private appStore: Store<fromStore.AppState>,
    private orderservice: OrderService
  ) {
    super(formBuilder, loadingService, dialogService, service, route, router);
    this.appStore.select(fromStore.getAuthUser).subscribe((res) => {
      console.log(res);
      if (res?.roles?.includes('ROLE_ADMIN')) {
        this.roleAdmin = true;
      }
    });
    this.http.get('assets/cities.json').subscribe((res: City[]) => {
      console.log(res);
      this.cities = res;
    });
    this.appStore.select(fromStore.getAuthServices).subscribe((res) => {
      console.log(res[0]);
      this.org.services[0] = res[0];
      this.org.services[1] = res[1];
      this.dropdownList = res;
    });
    this.dropdownSettings = {
      idField: 'id',
      textField: 'name',
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }
  onItemSelect(item: any) {}
  onItemDeSelect(item) {}

  onSelectAll(items: any) {
    this.form.get('services').setValue(items);
  }
  onDeSelectAll(items: any) {
    this.form.get('services').setValue(items);
  }

  ngOnInit(): void {
    this.createForm();
    this.form.patchValue(this.org);
    this.appStore.select(fromStore.getLang).subscribe((lang) => {
      this.lang = lang;
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      // currentPosition: ['', [Validators.required]],
      mobileNo: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      city: ['', [Validators.required]],
      status: [''],
      address: ['', [Validators.required]],
      website: ['', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      file: ['', []],
      services: [null],
    });
  }
  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.toggleButton = false;
    const formData: FormData = new FormData();
    for (let j = 0; j < this.totalfiles.length; j++) {
      formData.append('files[]', this.totalfiles[j] as File);
    }
    const itemBlob = new Blob([JSON.stringify(this.form.value)], {
      type: 'application/json',
    });
    formData.append('organization', itemBlob);
    this.service.http.post('url', formData).subscribe((res) => {});
  }

  Commercial(event) {
    this.handleFileInput(event);
    console.log(event.target.files[0].name);
  }
  taxCard(event) {
    this.handleFileInput(event);
    console.log(event.target.files[0].name);
  }
  ownerNationalIDFront(event) {
    this.handleFileInput(event);
    console.log(event.target.files[0].name);
  }
  ownerNationalIDBack(event) {
    this.handleFileInput(event);
    console.log(event.target.files[0].name);
  }

  handleFileInput(fileInput: any) {
    //  this.filename= fileInput.target.files[0].name;
    if (fileInput.target.files && fileInput.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {};

      this.totalfiles.unshift(fileInput.target.files[0]);
      this.totalFileName.unshift(fileInput.target.files[0].name);

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  onChangeStatus(event) {
    this.org.status = event;
    if (event === 'Pending Validation' || event === 'Rejected') {
      this.form.addControl('notes', new FormControl('', Validators.required));
    } else {
      this.form.removeControl('notes');
    }
  }

  onCreate(): void {
    throw new Error('Method not implemented.');
  }
  onUpdate(): void {
    throw new Error('Method not implemented.');
  }
  cancel(): void {
    throw new Error('Method not implemented.');
  }
}
