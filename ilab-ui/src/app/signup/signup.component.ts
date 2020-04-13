import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../router.animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Country, COUNTRIES } from './countries';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../shared/services';
import { UserService } from './user.service';
import { User } from '../shared/domain';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [routerTransition()],
})
export class SignupComponent implements OnInit {
  user: User;
  // department: Department;
  // degree: Degree;
  // empCase: EmployeeCase;
  countries: Country[] = COUNTRIES;
  registrationForm: FormGroup;
  loading = false;
  ext: string[] = [];
  fileToUpload: File = null;
  extFile: string[] = ['.pdf', '.docx'];
  filename: string;
  public totalfiles: Array<File> = [];
  public totalFileName = [];
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private alertservice: AlertService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]],
      username: ['', [Validators.required, Validators.minLength(5)]],
      arName: ['', [Validators.required, Validators.minLength(20)]], // Validators.pattern("^[\u0621-\u064A]+$")
      enName: ['', [Validators.required, Validators.minLength(20)]], // Validators.pattern("^[a-zA-Z ]*$")
      phoneNo: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      homePhoneNo: ['', [Validators.pattern('^[0-9]*$')]],
      nationality: ['Egypt', [Validators.required]],
      idNumber: ['', [Validators.required, Validators.pattern('^[0-9]{14}$')]],
      // idNumber: new FormControl(''),
      // agree: ['', [Validators.required]],
      gender: [true, [Validators.required]],
      birthdate: ['', [Validators.required]],
      university: ['', [Validators.required]],
      faculty: ['', [Validators.required]],
      department: ['', [Validators.required]],
      degree: ['', [Validators.required]],
      empCase: ['', [Validators.required]],
      file: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  checkLanguage() {
    const element = document.querySelector('body');
    if (element.classList.contains('rtl')) {
      return true;
    }
  }

  onChange(value) {
    if (value !== 'Egypt') {
      this.registrationForm.get('idNumber').setValidators(null);
    }
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.validateAllFormFields(this.registrationForm);
      return;
    }
    const formData: FormData = new FormData();
    for (let j = 0; j < this.totalfiles.length; j++) {
      formData.append('files[]', this.totalfiles[j] as File);
    }
    // this.degree.id = this.registrationForm.get('degree').value;
    // this.empCase.id = this.registrationForm.get('empCase').value;
    // this.department.id = this.registrationForm.get('department').value;
    // this.user = this.registrationForm.value;
    // this.user.degree = this.degree;
    // this.user.empCase = this.empCase;
    // this.user.department = this.department;
    // this.user.degree.id = this.registrationForm.get('degree').value;
    // this.user.department.id = this.registrationForm.get('department').value;
    // this.user.empCase.id = this.registrationForm.get('empCase').value;

    const $degree: any = {
      id: this.registrationForm.get('degree').value,
    };
    const $empCase: any = {
      id: this.registrationForm.get('degree').value,
    };
    const $department: any = {
      id: this.registrationForm.get('degree').value,
    };
    this.user = this.registrationForm.value;

    /////////////////////

    console.log(this.user);

    const itemBlob = new Blob([JSON.stringify(this.user)], {
      type: 'application/json',
    });
    formData.append('user', itemBlob);
    this.userService.register(formData).subscribe(
      (res) => {
        this.router.navigateByUrl('/login');
        this.alertservice.success('please check your email');
      },
      (err) => {}
    );
  }

  handleFileInput(fileInput: any) {
    //  this.filename= fileInput.target.files[0].name;
    if (fileInput.target.files && fileInput.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {};

      this.totalfiles.unshift(fileInput.target.files[0]);
      this.totalFileName.unshift(fileInput.target.files[0].name);

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    // {1}
    Object.keys(formGroup.controls).forEach((field) => {
      // {2}
      const control = formGroup.get(field); // {3}
      if (control instanceof FormControl) {
        // {4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        // {5}
        this.validateAllFormFields(control); // {6}
      }
    });
  }
}
