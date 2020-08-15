import { Component, OnInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Service, Processes } from 'src/app/shared/domain';
//import { formatDate } from '@angular/common';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';
// import { ServicesListService } from '../services-list.service';
import { ServiceService } from 'src/app/shared/services/service.service';

import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import * as fromStore from 'src/app/store';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss'],
  animations: [
    trigger('inputIn', [
      state(
        'in',
        style({
          opacity: 1,
          transform: 'translateX(0)',
        })
      ),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)',
        }),
        animate(300),
      ]),
      transition('* => void', [
        animate(
          300,
          style({
            transform: 'translateX(100px)',
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class ServiceFormComponent extends DefaultFormComponent<Service, ServiceService> {
  breadcrumbs = [
    { heading: 'services', icon: 'fa-tasks', link: '/services-list' },
    { heading: 'serviceDetails', icon: 'fa-tasks' },
  ];
  form: FormGroup;
  @ViewChild('stepTwo') stepTwo: ElementRef;
  @ViewChild('stepOne') stepOne: ElementRef;
  @ViewChild('submitBtn') submitBtn: ElementRef;
  @ViewChildren('optionalRef', { read: ElementRef }) optionalRef: QueryList<ElementRef<HTMLParagraphElement>>;
  optionalArr: string[] = ['Materials', 'Thickness', 'Types', 'Colors', 'Units', 'Processes'];
  multiProcesses: boolean = false;
  stepsArr: string[] = ['step 1', 'step 2'];
  activeStep = 'step 1';
  true: boolean = true;
  false: boolean = false;
  file: File;
  //editModeMulti: boolean = false;
  constructor(
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    route: ActivatedRoute,
    router: Router,
    service: ServiceService,
    private appStore: Store<fromStore.AppState>
  ) {
    super(formBuilder, loadingService, dialogService, service, route, router);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      image: new FormControl(null, Validators.required),
      supportedExtensions: new FormArray([new FormControl(null, Validators.required)]),
    });
    if (this.route.snapshot.params['entityId']) {
      this.service.get(this.route.snapshot.params['entityId']).subscribe((res) => {
        //console.log(res);
        this.form.controls.image.clearValidators();
        this.form.controls.name.setValue(res.name);
        this.form.controls.description.setValue(res.description);
        res.supportedExtensions.forEach((e, index) => {
          if (index == 0) {
            const control = (<FormArray>this.form.get('supportedExtensions')).at(index);
            let updatedValue = e.split('.');
            control.setValue(updatedValue[updatedValue.length - 1]);
          } else {
            let updatedValue = e.split('.');
            const control = new FormControl(updatedValue[updatedValue.length - 1], Validators.required);
            (<FormArray>this.form.get('supportedExtensions')).push(control);
          }
        });
      });
    }
  }

  ngAfterViewInit() {
    this.stepTwo.nativeElement.style.display = 'none';
    if (this.route.snapshot.params['entityId']) {
      this.service.get(this.route.snapshot.params['entityId']).subscribe((res) => {
        this.optionalRef.forEach((e) => {
          for (const key in res) {
            if (key == e.nativeElement.getAttribute('id').toLowerCase()) {
              //console.log(key + ' = ' + res[key]);
              e.nativeElement['checked'] = true;
              this.form.addControl(key, new FormArray([]));
              if (key == 'processes') {
                this.form.addControl('multi', new FormControl(res.processes.multi, Validators.required));
                this.multiProcesses = true;
                res.processes.values.forEach((x) => {
                  const control = new FormControl(x, Validators.required);
                  (<FormArray>this.form.get(key)).push(control);
                });
              } else {
                res[key].forEach((element) => {
                  const control = new FormControl(element, Validators.required);
                  (<FormArray>this.form.get(key)).push(control);
                });
              }
            }
          }
        });
      });
    }
  }

  addControlArray(type: string) {
    if ((<FormArray>this.form.get(type)).status != 'INVALID') {
      const control = new FormControl(null, Validators.required);
      (<FormArray>this.form.get(type)).push(control);
    }
  }

  deleteControlArray(type: string, index) {
    (<FormArray>this.form.get(type)).removeAt(index);
  }

  uploadImage(event) {
    this.file = event.target.files[0];
  }

  save() {
    if (this.form.valid) {
      this.loadingService.register('loading');
      this.submitBtn.nativeElement.disabled = true;
      let formData = new FormData();
      let service = {} as Service;
      let processes = {} as Processes;
      for (const key in this.form.value) {
        if (key == 'multi') {
          processes.multi = this.form.value[key];
          service.processes = processes;
        } else if (key == 'image') {
          if (this.form.value[key] != null) {
            formData.append('file', this.file);
          }
        } else if (key == 'processes') {
          processes.values = this.form.value[key];
          service.processes = processes;
        } else if (key == 'supportedExtensions') {
          let arr: string[] = this.form.value[key];
          service.supportedExtensions = [];
          arr.forEach((e) => {
            service.supportedExtensions.push('*.' + e);
          });
        } else {
          service[key] = this.form.value[key];
        }
      }
      if (this.route.snapshot.params['entityId']) {
        service.id = this.route.snapshot.params['entityId'];
      }
      const blob = new Blob([JSON.stringify(service)], {
        type: 'application/json',
      });
      formData.append('service', blob);
      if (this.route.snapshot.params['entityId']) {
        this.service.update(formData).subscribe((res) => {
          this.appStore.dispatch(new fromStore.LoadInitState());
          this.loadingService.resolve('loading');
          this.router.navigate(['/services-list']);
        });
      } else {
        this.service.create(formData).subscribe((res) => {
          this.appStore.dispatch(new fromStore.LoadInitState());
          this.loadingService.resolve('loading');
          this.router.navigate(['/services-list']);
        });
      }
    } else {
      this.form.get('materials')?.markAsTouched();
      this.form.get('thickness')?.markAsTouched();
      this.form.get('types')?.markAsTouched();
      this.form.get('units')?.markAsTouched();
      this.form.get('colors')?.markAsTouched();
      this.form.get('processes')?.markAsTouched();
      return;
    }
  }

  next() {
    if (
      !this.form.get('name').valid ||
      !this.form.get('image').valid ||
      !this.form.get('description').valid ||
      !this.form.get('supportedExtensions').valid
    ) {
      this.form.get('name').markAsTouched();
      this.form.get('image').markAsTouched();
      this.form.get('description').markAsTouched();
      this.form.get('supportedExtensions').markAsTouched();
    } else {
      this.stepOne.nativeElement.style.display = 'none';
      this.stepTwo.nativeElement.style.display = 'block';
      this.activeStep = 'step 2';
    }
  }

  back() {
    this.stepTwo.nativeElement.style.display = 'none';
    this.stepOne.nativeElement.style.display = 'block';
    this.activeStep = 'step 1';
  }

  addAttribute(event, type: string) {
    if (type == 'Processes') {
      if (event.target.checked) {
        this.multiProcesses = true;
        this.form.addControl('multi', new FormControl(true, Validators.required));
      } else {
        this.multiProcesses = false;
        this.form.removeControl('multi');
      }
    }
    if (event.target.checked) {
      this.form.addControl(type.toLowerCase(), new FormArray([new FormControl(null, Validators.required)]));
    } else {
      this.form.removeControl(type.toLowerCase());
    }
  }

  onCreate(): void {}
  onUpdate(): void {}
  cancel(): void {}
}
