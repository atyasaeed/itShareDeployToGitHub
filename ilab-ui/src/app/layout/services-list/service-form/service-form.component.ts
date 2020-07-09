import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss'],
})
export class ServiceFormComponent implements OnInit {
  form: FormGroup;
  @ViewChild('stepTwo') stepTwo: ElementRef;
  @ViewChild('stepOne') stepOne: ElementRef;
  constructor() {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null),
      description: new FormControl(null),
      image: new FormControl(null),
      supportedExtensions: new FormArray([new FormControl()]),
    });
  }

  ngAfterViewInit() {
    this.stepTwo.nativeElement.style.display = 'none';
  }

  addControlArray(type: string) {
    const control = new FormControl(null);
    (<FormArray>this.form.get(type)).push(control);
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
  }

  addAttribute(event, type: string) {
    console.log(event.target.checked);
    if (event.target.checked) {
      this.form.addControl(type, new FormArray([new FormControl()]));
    } else {
      this.form.removeControl(type);
    }
  }
}
