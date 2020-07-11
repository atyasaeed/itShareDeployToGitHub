import { Component, OnInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

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
export class ServiceFormComponent implements OnInit {
  form: FormGroup;
  @ViewChild('stepTwo') stepTwo: ElementRef;
  @ViewChild('stepOne') stepOne: ElementRef;
  @ViewChildren('optionalRef', { read: ElementRef }) optionalRef: QueryList<ElementRef<HTMLParagraphElement>>;
  optionalArr: string[] = ['Materials', 'Thickness', 'Types', 'Colors', 'Units', 'Processes'];
  multiProcesses: boolean = false;
  stepsArr: string[] = ['step 1', 'step 2'];
  activeStep = 'step 1';
  constructor(private route: ActivatedRoute) {}

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
    const control = new FormControl(null, Validators.required);
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
    if (type == 'Processes') {
      if (event.target.checked) {
        this.multiProcesses = true;
        this.form.addControl('multi', new FormControl('true', Validators.required));
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
}
