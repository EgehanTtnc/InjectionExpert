import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from "./patient.service";
import { Patient } from "./patient.model";
import { IonItemSliding, IonRouterOutlet, LoadingController } from '@ionic/angular';
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
    private routerOutlet: IonRouterOutlet,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
    this.patientsSub = this.patientService.patients.subscribe((patients) => {
      this.allPatients = patients;
    })
  }

  ionViewWillEnter() {
    this.routerOutlet.swipeGesture = false;
    this.loadingCtrl.create({message:"Patients Loading...", spinner: "lines", backdropDismiss: true}).then(loadingEl => {
      this.isLoading = true;
      loadingEl.present()
      this.patientService.fetchPatients().subscribe(() => {
        this.isLoading = false;
        loadingEl.dismiss();
      });
    })
  }

  onEdit(patientId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    // this.router.navigate(['/', 'places', 'patients', 'edit', patientId]);
    console.log('Editting Item', patientId);
  }

  onDeletePatient(patientId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.loadingCtrl.create({
      message: 'Deleting patient...'
    }).then(loadingEl => {
      loadingEl.present();
      this.patientService.deletePatient(patientId).subscribe(() => {
        loadingEl.dismiss();
      });
    })
  }

  ngOnDestroy() {
    if (this.patientsSub) {
      this.patientsSub.unsubscribe();
    }
  }

}
