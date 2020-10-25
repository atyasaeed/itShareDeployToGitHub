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
  checkState: boolean = true;
  public totalFileName = [];
  city: City = {} as City;
  cities: City[] = new Array();
  toggleButton: boolean;
  roleAdmin: boolean;
  dropdownList: Service[] = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  arrStatus: string[] = ['PENDING', 'ACTIVE', 'REJECTED'];
  @Input() org: Organization = {} as Organization;
  user: User = {} as User;
  @Input() userInput: User = {} as User;
  CommerciaFile = false;
  taxCardFile = false;
  formData: FormData = new FormData();
  disabledForm: boolean = false;
  checkFileSize: boolean;
  form: FormGroup;
  constructor(
    private Service: OrganizationService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private appStore: Store<fromStore.AppState>,
    private toastr: ToastrService,
    private translate: TranslateService,
    private loadingService: TdLoadingService,

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
    this.org = changes.org.currentValue;

    if (this.org) {
      this.form?.patchValue(this.org);
      if (this.org.comReg) {
        this.CommerciaFile = true;
      }
      if (this.org.taxId) {
        this.taxCardFile = true;
      }

      if (!(this.org.status == 'PENDING' || this.org.status == 'REJECTED')) {
        this.form?.removeControl('statusReason');
      } else if (this.org.status == 'PENDING' && !this.roleAdmin) {
        this.form?.removeControl('statusReason');
      }
    }
  }
  ngOnInit(): void {
    this.createForm();
    if (this.org) {
      this.form?.patchValue(this.org);
      if (!this.form?.get('statusReason').value) {
        this.form?.get('statusReason')?.clearValidators();
        this.checkState = false;
      }
    }
    if (!this.roleAdmin) {
      this.form.get('services').setValidators(Validators.required);
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
    this.loadingService.register('loadingOrg');
    this.toggleButton = false;
    const itemBlob = new Blob([JSON.stringify(this.form.value)], {
      type: 'application/json',
    });
    this.formData.append('org', itemBlob);
    if (this.roleAdmin) {
      this.Service.updateAdminOrg(this.form.value, this.form.get('id').value).subscribe(
        (res: Organization) => {
          this.org = res;
          this.form.patchValue(res);
          this.disabledForm = false;
          this.toastr.success(this.translate.instant('success'));
          this.loadingService.resolve('loadingOrg');
        },
        (err) => {
          this.toastr.error(this.translate.instant(err.message));
          this.loadingService.resolve('loadingOrg');
        }
      );
    } else {
      this.Service.updateOrg(this.formData, this.form.get('id').value).subscribe(
        (res: Organization) => {
          this.org = res;
          this.form.patchValue(res);
          this.disabledForm = false;
          this.toastr.success(this.translate.instant('success'));
          this.loadingService.resolve('loadingOrg');
        },
        (err) => {
          this.toastr.error(this.translate.instant(err.message));
          this.loadingService.resolve('loadingOrg');
        }
      );
    }
  }

  Commercial(event) {
    console.log(event.target.files[0].size);
    if (event.target.files[0].size > 200000) {
      return;
    }
    this.loadingService.register('loadingOrg');
    this.CommerciaFile = true;
    this.formData.append('file1', event.target.files[0] as File);
    const itemBlob = new Blob([JSON.stringify(this.form.value)], {
      type: 'application/json',
    });
    this.formData.append('org', itemBlob);
    this.Service.updateOrg(this.formData, this.form.get('id').value).subscribe(
      (res: Organization) => {
        this.org = res;
        this.form.patchValue(res);
        this.loadingService.resolve('loadingOrg');
      },
      (err) => {
        this.toastr.error(this.translate.instant(err.message));
        this.loadingService.resolve('loadingOrg');
      }
    );
  }
  editCommercial() {
    this.CommerciaFile = false;
    this.formData.delete('file1');
  }
  taxCard(event) {
    if (event.target.files[0].size > 200000) {
      return;
    }
    this.taxCardFile = true;
    this.loadingService.register('loadingOrg');
    this.formData.append('file2', event.target.files[0] as File);
    const itemBlob = new Blob([JSON.stringify(this.form.value)], {
      type: 'application/json',
    });
    this.formData.append('org', itemBlob);
    this.Service.updateOrg(this.formData, this.form.get('id').value).subscribe(
      (res: Organization) => {
        this.org = res;
        this.form.patchValue(res);
        this.loadingService.resolve('loadingOrg');
      },
      (err) => {
        this.toastr.error(this.translate.instant(err.message));
        this.loadingService.resolve('loadingOrg');
      }
    );
  }
  editTaxCard() {
    this.taxCardFile = false;
    this.formData.delete('file2');
  }

  onChangeStatus(event) {
    this.org.status = event;
    if (event === 'PENDING' || event === 'REJECTED') {
      this.form.addControl('statusReason', new FormControl('', Validators.required));
      this.checkState = true;
    } else {
      this.form.removeControl('statusReason');
      this.checkState = false;
    }
  }

  getFileUrlTax(id): string {
    if (this.roleAdmin) {
      return this.appConfig.FILE_URL_ADMIN + id;
    } else {
      return this.appConfig.FILE_URL + id;
    }
  }
  getFileUrlCommercia(id): string {
    if (this.roleAdmin) {
      return this.appConfig.FILE_URL_ADMIN + id;
    } else {
      return this.appConfig.FILE_URL + id;
    }
  }

  requestApproval() {
    this.loadingService.register('loadingOrg');
    this.Service.requestApproval(this.org).subscribe(
      (res) => {
        this.org.status = 'WAITING_APPROVAL';
        this.loadingService.resolve('loadingOrg');
      },
      (err) => {
        this.toastr.error(this.translate.instant(err.message));
        this.loadingService.resolve('loadingOrg');
      }
    );
  }
}
