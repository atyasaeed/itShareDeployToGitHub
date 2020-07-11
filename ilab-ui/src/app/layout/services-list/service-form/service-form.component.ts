import { Component, OnInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss'],
})
export class ServiceFormComponent implements OnInit {
  form: FormGroup;
  @ViewChild('stepTwo') stepTwo: ElementRef;
  @ViewChild('stepOne') stepOne: ElementRef;
  @ViewChildren('optionalRef', { read: ElementRef }) optionalRef: QueryList<ElementRef<HTMLParagraphElement>>;
  optionalArr: string[] = ['materials', 'thickness', 'types', 'colors', 'units', 'processes'];
  multiProcesses: boolean = false;
  stepsArr: string[] = ['step 1', 'step 2'];
  activeStep = 'step 1';
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null),
      description: new FormControl(null),
      image: new FormControl(null),
      supportedExtensions: new FormArray([new FormControl(null)]),
    });
    // if (this.route.snapshot.params['entityId']) {
    //   console.log('edit');
    // }
  }

  ngAfterViewInit() {
    this.stepTwo.nativeElement.style.display = 'none';
  }

  addControlArray(type: string) {
    const control = new FormControl(null);
    (<FormArray>this.form.get(type)).push(control);
  }

  deleteControlArray(type: string, index) {
    (<FormArray>this.form.get(type)).removeAt(index);
  }

  uploadImage(event) {
    console.log(event.target.files[0]);
  }

  submit() {
    console.log(this.form.value);
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
    if (type == 'processes') {
      if (event.target.checked) {
        this.multiProcesses = true;
        this.form.addControl('multi', new FormControl('true'));
      } else {
        this.multiProcesses = false;
        this.form.removeControl('multi');
      }
    }
    if (event.target.checked) {
      this.form.addControl(type, new FormArray([new FormControl()]));
    } else {
      this.form.removeControl(type);
    }
  }
}
