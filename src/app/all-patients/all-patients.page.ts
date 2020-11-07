import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from "./patient.service";
import { Patient } from "./patient.model";
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-patients',
  templateUrl: './all-patients.page.html',
  styleUrls: ['./all-patients.page.scss'],
})
export class AllPatientsPage implements OnInit {
  allPatients: Patient[];
  isLoading = false;
  private patientsSub: Subscription;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
    this.patientsSub = this.patientService.patients.subscribe((patients) => {
      this.allPatients = patients;
    })
  }

  ionViewWillEnter() {
    this.loadingCtrl.create({message:"Patients Loading...", spinner: "lines", backdropDismiss: true}).then(loadingEl => {
      this.isLoading = true;
      loadingEl.present()
      this.patientService.fetchPatients().subscribe(() => {
        this.isLoading = false;
        loadingEl.dismiss();
      });
    })
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    // this.router.navigate(['/', 'places', 'offers', 'edit', offerId]);
    console.log('Editting Item', offerId);
  }

  ngOnDestroy() {
    if (this.patientsSub) {
      this.patientsSub.unsubscribe();
    }
  }

}
