import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TdDialogService } from '@covalent/core/dialogs';
import { TdLoadingService } from '@covalent/core/loading';
import { Store } from '@ngrx/store';
import { User } from '../../domain';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import * as fromStore from 'src/app/store';
import { routerTransition } from 'src/app/router.animations';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  animations: [routerTransition()],
  providers: [UserService],
})
export class UserInfoComponent implements OnInit {
  @Input() user: User = {} as User;
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private service: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private appStore: Store<fromStore.AppState>,
    private orderservice: OrderService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: [{ value: '' }, [Validators.required]],
      lastName: [{ value: '' }, [Validators.required]],
      mobileNo: [{ value: '' }, [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      email: [{ value: '' }, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]],
      username: [{ value: '' }, [Validators.required]],
    });
    if (this.user) {
      this.form?.patchValue(this.user);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    this.user = changes.user.currentValue;
    if (this.user) {
      this.form?.patchValue(this.user);
    }
  }
  f() {
    return this.form;
  }
  hasError(controlName: string) {
    return this.form.get(controlName).touched && this.form.get(controlName).invalid;
  }
  save() {
    this.loadingService.register('loadingUser');
    Object.assign(this.user, this.form.value);
    if (this.user.roles.includes('ROLE_ADMIN')) {
      if (this.user.id) {
        this.service.adminUpdateUser(this.user).subscribe(
          (response) => {
            this.loadingService.resolve('loadingUser');
          },
          (err) => {
            // this.loadingService.resolve('loadingUser');
            this.loadingService.resolve('loadingUser');
          }
        );
      } else {
        this.service.create(this.user).subscribe(
          (response) => {
            this.loadingService.resolve('loadingUser');
          },
          (err) => {
            this.loadingService.resolve('loadingUser');
          }
        );
      }
    } else {
      this.service.update(this.user).subscribe(
        (res) => {
          this.loadingService.resolve('loadingUser');
        },
        (err) => {
          this.loadingService.resolve('loadingUser');
        }
      );
    }
  }

  status(entity) {
    this.service.userState(entity.id);
    // entity.enabled = !entity.enabled;
  }
  cancel(): void {
    this.router.navigateByUrl('users');
  }
}
