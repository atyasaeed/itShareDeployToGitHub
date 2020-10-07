import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router, private service: UserService) {}

  ngOnInit(): void {
    this.service.getAuthUserDetails().subscribe((res) => {
      console.log(res);

      if (res.defaultOrg.status === 'PENDING') {
        this.isPending = true;
      } else if (res.defaultOrg.status === 'WAITING_APPROVAL') {
        this.isPending = true;
        this.isWaitingAproval = true;
      } else {
        this.router.navigate(['']);
      }
    });
    console.log(this.isWaitingAproval);
  }
}