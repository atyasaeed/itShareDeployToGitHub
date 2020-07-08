import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss'],
})
export class StepsComponent implements OnInit {
  constructor() {}
  activeStepIndex: number;
  barValue: number;
  @Input() stepsArr: string[];
  @Input() activeStep: string;

  ngOnInit(): void {}

  ngAfterViewInit() {
    //console.log(this.order.status);
    let v = 100 / (this.stepsArr.length - 1);
    //console.log(v);
    this.activeStepIndex = this.stepsArr.indexOf(this.activeStep);
    if (this.activeStep == 'QUOTE_ACCEPTED' || this.activeStep == 'QUOTE_REJECTED') {
      this.activeStepIndex = this.stepsArr.indexOf('QUOTED');
    }

    this.barValue = this.activeStepIndex * v;
  }
}
