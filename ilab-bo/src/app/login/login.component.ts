import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { routerTransition } from '../router.animations';
import { AlertService } from '../shared/helpers/alert.service';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()],
})
export class LoginComponent implements OnInit {
  message: string;
  returnUrl: string;
  username = '';
  password = '';

  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private alertService: AlertService) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  onLoggedin() {
    this.authenticationService.login(this.username, this.password).pipe(first()).subscribe(
      data => { this.router.navigateByUrl(this.returnUrl); },
      err => { this.message = err; this.alertService.error(err); }
    );
  }
}
