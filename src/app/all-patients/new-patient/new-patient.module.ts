import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewPatientPageRoutingModule } from './new-patient-routing.module';

import { NewPatientPage } from './new-patient.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    NewPatientPageRoutingModule,
    SharedModule
  ],
  declarations: [NewPatientPage]
})
export class NewPatientPageModule {}
