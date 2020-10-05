import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TdLoadingService } from '@covalent/core/loading';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { OrgUser } from 'src/app/shared/domain/orgUser.model';
import { orgUserService } from 'src/app/shared/services/org-user.service';

@Component({
  selector: 'app-org-member-invitation',
  templateUrl: './org-member-invitation.component.html',
  styleUrls: ['./org-member-invitation.component.scss'],
})
export class OrgMemberInvitationComponent implements OnInit {
  constructor(
    private activeRoute: ActivatedRoute,
    private service: orgUserService,
    private router: Router,
    private loadingService: TdLoadingService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}
  entity: OrgUser;
  entityId: OrgUser;
  ngOnInit(): void {
    this.loadingService.register('loading');
    this.activeRoute.params.subscribe((params: Params) => {
      if (params['entityId']) {
        this.entityId = params['entityId'];
        this.service.getInvitationPlacedBy(params['entityId']).subscribe(
          (res) => {
            this.entity = res;
            this.loadingService.resolve('loading');
          },
          (err) => {
            this.loadingService.resolve('loading');
          }
        );
      }
    });
  }

  acceptInvitation() {
    this.loadingService.register('loading');
    this.service.memberAcceptInvitation(this.entityId).subscribe(
      (res) => {
        this.toastr.success(this.translate.instant('acceptInvitation'));
        this.loadingService.resolve('loading');
        this.router.navigateByUrl('/home');
      },
      (err) => {
        this.loadingService.resolve('loading');
        this.toastr.error(this.translate.instant('server.error'));
      }
    );
  }

  declineInvitation() {
    this.loadingService.register('loading');
    this.service.memberDeclineInvitation(this.entityId).subscribe(
      (res) => {
        this.toastr.success(this.translate.instant('declineInvitation'));
        this.loadingService.resolve('loading');
        this.router.navigateByUrl('/home');
      },
      (err) => {
        this.toastr.error(this.translate.instant('server.error'));
        this.loadingService.resolve('loading');
      }
    );
  }
}
