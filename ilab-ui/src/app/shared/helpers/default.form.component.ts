import { Observable } from 'rxjs';
import { ViewChildren, QueryList, OnInit, Inject } from '@angular/core';
import { SortableHeaderDirective, SortEvent } from '../directives/sortable.directive';
import { RestService } from '../services';
import { Entity } from '../domain';
import { tap, first, share, map } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { ActivatedRoute, Router, Params } from '@angular/router';

export abstract class DefaultFormComponent<T extends Entity, K extends RestService<T>> implements OnInit {
  entity: T;
  form: FormGroup;

  key = 'loading';
  constructor(
    protected formBuilder: FormBuilder,
    protected loadingService: TdLoadingService,
    protected dialogService: TdDialogService,
    protected service: K,
    protected route: ActivatedRoute,
    protected router: Router
  ) {}
  f() {
    return this.form;
  }
  hasError(controlName: string) {
    return this.form.get(controlName).touched && this.form.get(controlName).invalid;
  }
  ngOnInit(): void {
    this.loadingService.register(this.key);
    this.route.params.pipe(map((params: Params) => params.entityId)).subscribe((entityId) => {
      if (entityId) {
        this.onUpdate();
        this.service.get(entityId).subscribe((entity) => {
          this.form.patchValue(entity);
          this.entity = entity;
          this.loadingService.resolve(this.key);
        });
      } else {
        this.onCreate();
        this.entity = {} as T;
        this.loadingService.resolve(this.key);
      }
    });
  }
  delete() {
    this.dialogService
      .openConfirm({
        message: 'Are you sure you want to delete this Entity?',
        title: 'Confirm',
        acceptButton: 'Delete',
      })
      .afterClosed()
      .subscribe((accept: boolean) => {
        if (accept) {
          this.loadingService.register(this.key);
          this.service.delete(this.entity.id).subscribe((response) => {
            this.loadingService.resolve(this.key);
            this.entity.id = null;
            this.onDelete();
            this.cancel();
          });
        }
      });
  }
  save() {
    Object.assign(this.entity, this.form.value);
    if (this.entity.id) {
      this.service.update(this.entity).subscribe((response) => {
        this.onSave();
        this.cancel();
      });
    } else {
      this.service.create(this.entity).subscribe((response) => {
        this.cancel();
        this.onSave();
      });
    }
  }
  abstract onCreate(): void;
  abstract onUpdate(): void;
  abstract cancel(): void;
  onSave() {}
  onDelete() {}
}
