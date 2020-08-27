import { Component, OnInit, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { routerTransition } from '../router.animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
//import { Country, COUNTRIES } from './countries';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../shared/services';
import { User } from '../shared/domain';
import { TranslateService } from '@ngx-translate/core';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
import { UserService } from '../shared/services/user.service';
import { CustomCaptchaService } from '../shared/services/captcha.service';
import { ToastrService } from 'ngx-toastr';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { CanComponentDeactivate } from '../shared/guard/can-deactivate-guard.service';
import { Subject } from 'rxjs';

// import {
//   RECAPTCHA_LANGUAGE,
//   RECAPTCHA_SETTINGS,
//   RecaptchaSettings,
//   ReCaptchaV3Service,
//   OnExecuteData,
// } from 'ng-recaptcha';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [routerTransition()],
})
export class SignupComponent implements OnInit, CanComponentDeactivate {
  user: User;
  registrationForm: FormGroup;
  loading = false;
  emptyCaptcha = true;
  canDeactivateValue: Subject<boolean> = new Subject<boolean>();
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private alertservice: AlertService,
    private appStore: Store<fromStore.AppState>,
    private translate: TranslateService,
    private captchaService: CustomCaptchaService,
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private loadingService: TdLoadingService,
    private _dialogService: TdDialogService,
    private _viewContainerRef: ViewContainerRef
  ) {}
  partner: boolean = true;

  ngOnInit(): void {
    // this.route.snapshot.queryParams;
    // console.log(this.router.getCurrentNavigation().extras.state);
    if (this.route.snapshot.queryParams['partner']) {
      this.partner = true;
    } else {
      this.partner = false;
    }
    this.route.params.subscribe((params: Params) => {
      console.log(params);
    });
    this.createForm();
  }

  ngAfterViewInit() {
    //this.changeRecaptchaLanguage();

    this.captchaService.captchaInit(this.emptyCaptcha);
    this.cdref.detectChanges();
  }

  createForm() {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(80), Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.maxLength(80), Validators.minLength(2)]],
      mobileNo: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]],
      // username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  checkLanguage() {
    const element = document.querySelector('body');
    if (element.classList.contains('rtl')) {
      return true;
    }
  }

  onChange(value) {
    if (value !== 'Egypt') {
      this.registrationForm.get('idNumber').setValidators(null);
    }
  }

  onSubmit() {
    this.loading = true;
    this.loadingService.register('loading');
    if (!this.registrationForm.valid) {
      // this.validateAllFormFields(this.registrationForm);
      this.registrationForm.markAllAsTouched();
      this.loading = false;
      this.loadingService.resolve('loading');
      return;
    }

    this.user = this.registrationForm.value;
    if (this.route.snapshot.queryParams['partner']) {
      this.user.roles = new Array();
      this.user.roles.push('ROLE_PARTNER');
    }
    console.log(this.user);

    this.userService.register(this.user).subscribe(
      (res) => {
        // this.router.navigateByUrl('signup/activation');
        this.registrationForm.markAsPristine();
        this.router.navigate(['signup/activation'], {
          state: res,
        });
        this.loadingService.resolve('loading');

        this.alertservice.success(this.translate.instant('registeration.success.verify'));

        // this.alertservice.success('please check your email');
      },
      (err) => {
        this.loadingService.resolve('loading');

        this.loading = false;
        if (err.error.details[0] == 'duplicateEmail') {
          // this.toastr.error('You have been registered,Please log in');
          this.toastr.error(this.translate.instant('duplicated.email'));
          // this.router.navigate(['login']);
        } else if (err.error.details[0] == 'duplicateArName') {
          // this.alertservice.error('Sorry, Arabic Name Is Duplicated,Enter other Arabic Name');
          this.toastr.error(this.translate.instant('duplicated.arName'));
        } else if (err.error.details[0] == 'duplicateEnName') {
          // this.alertservice.error('Sorry, English Name Is Duplicated,Enter other English Name');
          this.toastr.error(this.translate.instant('duplicated.enName'));
        } else {
          this.toastr.error(this.translate.instant('tryAgain'));
        }
        // if (err.error.details[0] == 'duplicateUsername') {
        //   // this.alertservice.error('Sorry, Username Name Is Duplicated');
        //   this.alertservice.error(this.translate.instant('duplicated.userName'));
        // }
      }
    );
  }
  canDeactivate() {
    if (this.registrationForm.dirty) {
      this._dialogService
        .openConfirm({
          message: this.translate.instant('deactivateModalMessage'),
          disableClose: true || false,
          viewContainerRef: this._viewContainerRef,
          title: this.translate.instant('areYouSure'),
          cancelButton: this.translate.instant('no'),
          acceptButton: this.translate.instant('yes'),
          width: '320px',
          panelClass: 'deactivate-modalbox',
        })
        .afterClosed()
        .subscribe((accept: boolean) => {
          if (accept) {
            this.canDeactivateValue.next(true);
          } else {
            this.canDeactivateValue.next(false);
          }
        });

      return this.canDeactivateValue;
    }

    return true;
  }
}
