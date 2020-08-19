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
    this.initStep();
  }

  ngOnChanges() {
    this.initStep();
  }
  initStep() {
    let v = 100 / (this.stepsArr.length - 1);
    this.activeStepIndex = this.stepsArr.indexOf(this.activeStep);
    this.barValue = this.activeStepIndex * v;
  }
}
