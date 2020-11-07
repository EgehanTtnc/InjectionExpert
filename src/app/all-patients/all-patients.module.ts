import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllPatientsPageRoutingModule } from './all-patients-routing.module';

import { AllPatientsPage } from './all-patients.page';
import { AllPatientItemComponent } from '../all-patient-item/all-patient-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllPatientsPageRoutingModule
  ],
  declarations: [AllPatientsPage, AllPatientItemComponent]
})
export class AllPatientsPageModule {}
