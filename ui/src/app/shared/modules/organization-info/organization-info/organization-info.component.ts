import { ChangeDetectorRef, Component, Inject, Input, OnInit, SimpleChanges, ɵPlayState } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdLoadingService } from '@covalent/core/loading';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';
import { Service, User } from 'src/app/shared/domain';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';
import { OrderService } from 'src/app/shared/services/order.service';
import { OrganizationService } from 'src/app/shared/services/organization.service';
import { routerTransition } from 'src/app/router.animations';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BehaviorSubject, from } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { City } from 'src/app/signup/signup-partner/city';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/shared/services/user.service';
import { APP_CONFIG, IAppConfig } from 'src/app/shared/app.config';
import { Organization } from 'src/app/shared/domain/organization.model';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-organization-info',
  templateUrl: './organization-info.component.html',
  styleUrls: ['./organization-info.component.scss'],
  animations: [routerTransition()],
})
export class OrganizationInfoComponent implements OnInit {
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
  arrStatus: string[] = ['PENDING', 'ACTIVE', 'REJECTED'];
  org: Organization = {} as Organization;
  user: User = {} as User;
  @Input() userInput: User = {} as User;
  CommerciaFile = false;
  taxCardFile = false;
  ownerNationalIDFrontFile = false;
  ownerNationalIDFBackFile = false;
  formData: FormData = new FormData();
  disabledForm: boolean = false;
  form: FormGroup;
  constructor(
    private Service: OrganizationService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private appStore: Store<fromStore.AppState>,
    private toastr: ToastrService,
    private translate: TranslateService,

    @Inject(APP_CONFIG) public appConfig: IAppConfig
  ) {
    this.appStore.select(fromStore.getAuthUser).subscribe((res) => {
      this.route.params.pipe(map((params: Params) => params.entityId)).subscribe((entityId) => {
        if (res?.roles?.includes('ROLE_ADMIN') && entityId) {
          this.roleAdmin = true;
        }
      });
    });
    this.http.get('assets/cities.json').subscribe((res: City[]) => {
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
  ngOnChanges(changes: SimpleChanges) {
    this.user = changes.userInput.currentValue;
    this.org = this.user.defaultOrg;

    if (this.org) {
      this.form?.patchValue(this.org);
      if (this.org.comReg) {
        this.CommerciaFile = true;
      }
      if (this.org.taxId) {
        this.taxCardFile = true;
      }
      if (this.org.frontNatId) {
        this.ownerNationalIDFrontFile = true;
      }
      if (this.org.backNatId) {
        this.ownerNationalIDFBackFile = true;
      }
      if (!(this.org.status == 'PENDING' || this.org.status == 'REJECTED')) {
        this.form?.removeControl('statusReason');
      } else {
        this.form?.get('statusReason').setValue('Pending');
        this.form?.get('statusReason')?.clearValidators();
      }
    }
  }
  ngOnInit(): void {
    this.createForm();
    if (this.org) {
      this.form?.patchValue(this.org);
      if (!this.form?.get('statusReason').value) {
        this.form?.get('statusReason').setValue('Pending');
      }
    }

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
      statusReason: ['', [Validators.required]],
      address: ['', [Validators.required]],
      website: ['', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      // file: ['', []],
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
    this.formData.append('org', itemBlob);
    if (this.roleAdmin) {
      this.Service.updateAdminOrg(this.form.value, this.form.get('id').value).subscribe((res: Organization) => {
        this.org = res;
        this.form.patchValue(res);
        this.disabledForm = false;
        this.toastr.success(this.translate.instant('success'));
      });
    } else {
      this.Service.updateOrg(this.formData, this.form.get('id').value).subscribe((res: Organization) => {
        this.org = res;
        this.form.patchValue(res);
        this.disabledForm = false;
        this.toastr.success(this.translate.instant('success'));
      });
    }
  }

  Commercial(event) {
    this.CommerciaFile = true;
    this.formData.append('file1', event.target.files[0] as File);
    const itemBlob = new Blob([JSON.stringify(this.form.value)], {
      type: 'application/json',
    });
    this.formData.append('org', itemBlob);
    this.Service.updateOrg(this.formData, this.form.get('id').value).subscribe((res: Organization) => {
      this.org = res;
      this.form.patchValue(res);
    });
  }
  editCommercial() {
    this.CommerciaFile = false;
    this.formData.delete('file1');
  }
  taxCard(event) {
    this.taxCardFile = true;

    this.formData.append('file2', event.target.files[0] as File);
    const itemBlob = new Blob([JSON.stringify(this.form.value)], {
      type: 'application/json',
    });
    this.formData.append('org', itemBlob);
    this.Service.updateOrg(this.formData, this.form.get('id').value).subscribe((res: Organization) => {
      this.org = res;
      this.form.patchValue(res);
    });
  }
  editTaxCard() {
    this.taxCardFile = false;
    this.formData.delete('file2');
  }
  ownerNationalIDFront(event) {
    this.ownerNationalIDFrontFile = true;
    this.formData.append('file3', event.target.files[0] as File);
    const itemBlob = new Blob([JSON.stringify(this.form.value)], {
      type: 'application/json',
    });
    this.formData.append('org', itemBlob);
    this.Service.updateOrg(this.formData, this.form.get('id').value).subscribe((res: Organization) => {
      this.org = res;
      this.form.patchValue(res);
    });
  }
  editOwnerNationalIDFront() {
    this.ownerNationalIDFrontFile = false;
    this.formData.delete('file3');
  }
  ownerNationalIDBack(event) {
    this.ownerNationalIDFBackFile = true;
    this.formData.append('file4', event.target.files[0] as File);
    const itemBlob = new Blob([JSON.stringify(this.form.value)], {
      type: 'application/json',
    });
    this.formData.append('org', itemBlob);
    this.Service.updateOrg(this.formData, this.form.get('id').value).subscribe((res: Organization) => {
      this.org = res;
      this.form.patchValue(res);
    });
  }
  editOwnerNationalIDBack() {
    this.ownerNationalIDFBackFile = false;
    this.formData.delete('file4');
  }

  onChangeStatus(event) {
    this.org.status = event;
    if (event == 'PENDING' || event == 'REJECTED') {
      this.form.addControl('statusReason', new FormControl('', Validators.required));
    } else {
      this.form.removeControl('statusReason');
    }
  }

  getFileUrlBack(id): string {
    return this.appConfig.FILE_URL + id;
  }
  getFileUrlFront(id): string {
    return this.appConfig.FILE_URL + id;
  }
  getFileUrlTax(id): string {
    return this.appConfig.FILE_URL + id;
  }
  getFileUrlCommercia(id): string {
    return this.appConfig.FILE_URL + id;
  }
}
