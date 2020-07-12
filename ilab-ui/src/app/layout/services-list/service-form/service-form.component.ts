import { Component, OnInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Service, Processes } from 'src/app/shared/domain';
import { formatDate } from '@angular/common';
import { DefaultFormComponent } from 'src/app/shared/helpers/default.form.component';
import { ServicesListService } from '../services-list.service';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';

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
export class ServiceFormComponent extends DefaultFormComponent<Service, ServicesListService> {
  breadcrumbs = [
    { heading: 'Services', icon: 'fa-tasks', link: '/services-list' },
    { heading: 'Service-Details', icon: 'fa-tasks' },
  ];
  form: FormGroup;
  @ViewChild('stepTwo') stepTwo: ElementRef;
  @ViewChild('stepOne') stepOne: ElementRef;
  @ViewChildren('optionalRef', { read: ElementRef }) optionalRef: QueryList<ElementRef<HTMLParagraphElement>>;
  optionalArr: string[] = ['Materials', 'Thickness', 'Types', 'Colors', 'Units', 'Processes'];
  multiProcesses: boolean = false;
  stepsArr: string[] = ['step 1', 'step 2'];
  activeStep = 'step 1';
  true: boolean = true;
  false: boolean = false;
  file: File;
  constructor(
    formBuilder: FormBuilder,
    loadingService: TdLoadingService,
    dialogService: TdDialogService,
    route: ActivatedRoute,
    router: Router,
    service: ServicesListService
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
    // if (this.route.snapshot.params['entityId']) {
    //   console.log('edit');
    // }
  }

  ngAfterViewInit() {
    this.stepTwo.nativeElement.style.display = 'none';
  }

  addControlArray(type: string) {
    if ((<FormArray>this.form.get(type)).status != 'INVALID') {
      const control = new FormControl(null, Validators.required);
      (<FormArray>this.form.get(type)).push(control);
    }
    //console.log();
  }

  deleteControlArray(type: string, index) {
    (<FormArray>this.form.get(type)).removeAt(index);
  }

  uploadImage(event) {
    this.file = event.target.files[0];
    console.log(this.file);
  }

  submit() {
    let formData = new FormData();
    let service = {} as Service;
    let processes = {} as Processes;
    for (const key in this.form.value) {
      if (key == 'multi') {
        processes.multi = this.form.value[key];
        service.processes = processes;
      } else if (key == 'image') {
        formData.append('file', this.file);
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
    console.log(service);
  }

  next() {
    this.stepOne.nativeElement.style.display = 'none';
    this.stepTwo.nativeElement.style.display = 'block';
    this.activeStep = 'step 2';
  }

  back() {
    this.stepTwo.nativeElement.style.display = 'none';
    this.stepOne.nativeElement.style.display = 'block';
    this.activeStep = 'step 1';
  }

  addAttribute(event, type: string) {
    //console.log(type);
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
