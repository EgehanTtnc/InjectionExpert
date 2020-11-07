import { Component, OnInit, Input } from '@angular/core';

import { Patient } from "../all-patients/patient.model";

@Component({
  selector: 'app-all-patient-item',
  templateUrl: './all-patient-item.component.html',
  styleUrls: ['./all-patient-item.component.scss'],
})
export class AllPatientItemComponent implements OnInit {
  @Input() allPatient: Patient;

  constructor() { }

  ngOnInit() {}

  getDummyDate() {
    return new Date();
  }

}
