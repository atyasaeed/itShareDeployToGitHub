import { ShoppingCartService } from './../../services/shoppingcart.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginData } from './login.model';
import { NgForm, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService, AlertService } from 'src/app/services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loading = false;
  returnUrl: string;
  // model: LoginData;
  //   model = {
  //   username: '',
  //   password: '',
  //   isLoggedin: false,
  // };
  loginUser: FormGroup;

  // tslint:disable-next-line: max-line-length
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private shoppingCartService: ShoppingCartService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.createForm();
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }
  createForm() {
    this.loginUser = this.formBuilder.group({
      UserName: ['', [Validators.required]],
      Password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.loading = true;
    if (this.loginUser.invalid) {
      this.validateAllFormFields(this.loginUser);
      this.loading = false;
    } else {
      this.authenticationService
        .login(this.loginUser.controls.UserName.value, this.loginUser.controls.Password.value)
        .pipe(first())
        .subscribe(
          data => {
            this.router.navigateByUrl(this.returnUrl);
            this.shoppingCartService.refresh().subscribe();
            this.alertService.success(
              'Welcome' + ' ' + Object.values(this.authenticationService.currentUserValue).toString()
            );
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
            // this.loading = false;
          }
        );
    }

    // if ( this.restservice.login(this.model.userName,this.model.password) ) {
    //   this.router.navigate(['/order']);
    //   this.model.isLoggedin = true;
    //   localStorage.setItem('token','body');
    // }
  }
  validateAllFormFields(formGroup: FormGroup) {
    //{1}
    Object.keys(formGroup.controls).forEach(field => {
      //{2}
      const control = formGroup.get(field); //{3}
      if (control instanceof FormControl) {
        //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        //{5}
        this.validateAllFormFields(control); //{6}
      }
    });
  }
}
