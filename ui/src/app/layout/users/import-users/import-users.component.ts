import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TdLoadingService } from '@covalent/core/loading';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from 'src/app/router.animations';
import { AlertService } from 'src/app/shared/services';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-import-users',
  templateUrl: './import-users.component.html',
  styleUrls: ['./import-users.component.scss'],
  animations: [routerTransition()],
})
export class ImportUsersComponent implements OnInit {
  breadcrumbs = [
    { heading: 'Users', icon: 'fa-tasks', link: '/users' },
    { heading: 'importUsers', icon: 'fa-tasks' },
  ];
  loading: boolean;
  formData: FormData = new FormData();
  entity: any[] = new Array();
  checkvalue: boolean;
  constructor(
    private router: Router,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private toastr: ToastrService,
    private loadingService: TdLoadingService,
    private service: UserService
  ) {}

  ngOnInit(): void {}
  uploadFile(event) {
    this.loadingService.register('loadingUsers');
    this.formData?.append('file', event.target.files[0] as File);
    this.service.importUsers(this.formData).subscribe(
      (res) => {
        this.entity = Object.keys(res).map((key) => [key, res[key]]);
        this.loadingService.resolve('loadingUsers');
        this.formData.delete('file');
      },
      (err) => {
        this.toastr.error(this.translate.instant(err.message));
        this.loadingService.resolve('loadingUsers');
        this.formData.delete('file');
      }
    );
  }
}
