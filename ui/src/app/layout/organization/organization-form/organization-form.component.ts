import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdLoadingService } from '@covalent/core/loading';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';
import { Organization, Service, User } from 'src/app/shared/domain';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';
import { OrderService } from 'src/app/shared/services/order.service';
import { OrganizationService } from 'src/app/shared/services/organization.service';
import { routerTransition } from 'src/app/router.animations';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { from } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { City } from 'src/app/signup/signup-partner/city';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/shared/services/user.service';

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
  arrStatus: string[] = ['PENDING_VALIDATION', 'ACTIVE', 'REJECTED'];
  org: Organization = {} as Organization;
  user: User = {} as User;
  CommerciaFile = false;
  taxCardFile = false;
  ownerNationalIDFrontFile = false;
  ownerNationalIDFBackFile = false;
  formData: FormData = new FormData();

  constructor(
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    service: OrganizationService,
    private userService: UserService,
    private http: HttpClient,
    route: ActivatedRoute,
    router: Router,
    private appStore: Store<fromStore.AppState>,
    private orderservice: OrderService,
    private cdr: ChangeDetectorRef
  ) {
    super(formBuilder, loadingService, dialogService, service, route, router);
    this.appStore.select(fromStore.getAuthUser).subscribe((res) => {
      console.log(res);
      if (res?.roles?.includes('ROLE_ADMIN')) {
        this.roleAdmin = true;
      }
    });
    console.log(this.CommerciaFile);
    this.http.get('assets/cities.json').subscribe((res: City[]) => {
      console.log(res);
      this.cities = res;
    });

    this.appStore.select(fromStore.getAuthServices).subscribe((res) => {
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
    this.userService.get('').subscribe((res) => {
      this.user = res;
      this.org = res.defaultOrg;
      this.form.patchValue(res.defaultOrg);
    });

    this.appStore.select(fromStore.getLang).subscribe((lang) => {
      this.lang = lang;
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      id: [''],
      created: [''],
      type: [''],
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

    const itemBlob = new Blob([JSON.stringify(this.form.value)], {
      type: 'application/json',
    });
    this.formData.append('organization', itemBlob);
    this.service.updateOrg(this.formData, this.form.get('id').value).subscribe((res) => {});
  }

  Commercial(event) {
    this.CommerciaFile = true;
    this.formData.append('file1', event.target.files[0] as File);
  }
  editCommercial() {
    this.CommerciaFile = false;
    this.formData.delete('file1');
  }
  taxCard(event) {
    this.taxCardFile = true;

    this.formData.append('file2', event.target.files[0] as File);
  }
  editTaxCard() {
    this.taxCardFile = false;
    this.formData.delete('file2');
  }
  ownerNationalIDFront(event) {
    this.ownerNationalIDFrontFile = true;
    this.formData.append('file3', event.target.files[0] as File);
  }
  editOwnerNationalIDFront() {
    this.ownerNationalIDFrontFile = false;
    this.formData.delete('file3');
  }
  ownerNationalIDBack(event) {
    this.ownerNationalIDFBackFile = true;
    this.formData.append('file4', event.target.files[0] as File);
  }
  editOwnerNationalIDBack() {
    this.ownerNationalIDFBackFile = false;
    this.formData.delete('file4');
  }

  onChangeStatus(event) {
    this.org.status = event;
    if (event === 'PENDINGVALIDATION' || event === 'REJECTED') {
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
