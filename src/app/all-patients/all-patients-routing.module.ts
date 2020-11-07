import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllPatientsPage } from './all-patients.page';

const routes: Routes = [
  {
    path: '',
    component: AllPatientsPage
  },
  {
    path: 'new-patient',
    loadChildren: () => import('./new-patient/new-patient.module').then( m => m.NewPatientPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllPatientsPageRoutingModule {}
