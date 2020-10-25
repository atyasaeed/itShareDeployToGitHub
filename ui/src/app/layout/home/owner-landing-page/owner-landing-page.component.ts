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
  breadcrumbs = [{ heading: 'organization', icon: 'fa-tasks' }];
  isPending = false;
  isWaitingAproval = false;

  constructor(
    private router: Router,
    private service: UserService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.service.getAuthUserDetails().subscribe(
      (res) => {
        console.log(res);

        if (res.defaultOrg.status === 'PENDING') {
          this.isPending = true;
        } else if (res.defaultOrg.status === 'WAITING_APPROVAL') {
          this.isPending = true;
          this.isWaitingAproval = true;
        } else {
          this.router.navigate(['']);
        }
      },
      (err) => {
        this.toastr.error(this.translate.instant(err.message));
      }
    );
    console.log(this.isWaitingAproval);
  }
}
