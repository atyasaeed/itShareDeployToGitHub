import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ngbdmodalmachine',
  templateUrl: './ngbdmodalmachine.component.html',
  styleUrls: ['./ngbdmodalmachine.component.scss']
})
export class NgbdmodalmachineComponent implements OnInit {

  @Input() name;

  date: Date;



  constructor(public activeModal: NgbActiveModal) { }


  ngOnInit() {

  }

}
