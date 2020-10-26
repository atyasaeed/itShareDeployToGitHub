import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-owner-landing-page',
  templateUrl: './owner-landing-page.component.html',
  styleUrls: ['./owner-landing-page.component.scss'],
})
export class OwnerLandingPageComponent implements OnInit {
  breadcrumbs = [{ heading: 'welcome' }];
  stepsArr: string[] = ['createAccount', 'uploadPapers', 'contactYou', 'congratulations'];
  activeStep: string;
  status: string;
  constructor(
    private router: Router,
    private service: UserService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.service.getAuthUserDetails().subscribe(
      (res) => {
        if (res.defaultOrg.status === 'PENDING') {
          this.status = 'PENDING';
          this.activeStep = 'uploadPapers';
        } else if (res.defaultOrg.status === 'WAITING_APPROVAL') {
          this.status = 'WAITING_APPROVAL';
          this.activeStep = 'contactYou';
        } else {
          this.router.navigate(['']);
        }
      },
      (err) => {
        this.toastr.error(this.translate.instant(err.message));
      }
    );
  }

  uploadPapers() {
    this.activeStep = 'uploadPapers';
  }
  contactYou() {
    this.activeStep = 'contactYou';
  }
}
