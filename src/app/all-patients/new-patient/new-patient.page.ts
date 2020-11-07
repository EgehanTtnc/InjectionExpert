import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoadingController, AlertController } from "@ionic/angular";

import { PatientService } from "../patient.service";
import { switchMap } from "rxjs/operators";

function base64toBlob(base64Data, contentType) {
  contentType = contentType || "";
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: "app-new-patient",
  templateUrl: "./new-patient.page.html",
  styleUrls: ["./new-patient.page.scss"],
})
export class NewPatientPage implements OnInit {
  form: FormGroup;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      tcId: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      name: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      surname: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      gender: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      dateOfBirth: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      opDescription: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      opDate: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      // imageUrlPatient: new FormControl(null),
      // imageUrlDiagram: new FormControl(null),
    });
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'New Patient',
      message: 'New Patient Saved'
    });
    await alert.present();
    setTimeout(() => {
      alert.dismiss();
    },1500)
  }

  onImagePickedPat(imageData: string | File) {
    let imageFile;
    if (typeof imageData === "string") {
      try {
        imageFile = base64toBlob(
          imageData.replace("data:image/jpeg;base64,", ""),
          "image/jpeg"
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ imageUrlPatient: imageFile });
  }

  onImagePickedDiag(imageData: string | File) {
    let imageFile;
    if (typeof imageData === "string") {
      try {
        imageFile = base64toBlob(
          imageData.replace("data:image/jpeg;base64,", ""),
          "image/jpeg"
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ imageUrlDiagram: imageFile });
  }

  onCreatePatient() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: "Creating patient...",
        spinner: "lines"
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.patientService
          .addPatient(
            this.form.value.tcId,
            this.form.value.name,
            this.form.value.surname,
            this.form.value.gender,
            new Date(this.form.value.dateOfBirth),
            this.form.value.opDescription,
            new Date(this.form.value.opDate)
          )
          // .uploadImage(this.form.get('image').value && this.form.get('imageUrlDiagram').value)
          // .pipe(
          //   switchMap(uploadRes => {
          //     return this.patientService.addPatient(
          //       this.form.value.tcId,
          //       this.form.value.name,
          //       this.form.value.surname,
          //       this.form.value.gender,
          //       new Date(this.form.value.dateOfBirth),
          //       this.form.value.opDescription,
          //       new Date(this.form.value.opDate),
          //       // uploadRes.imageUrl,
          //       // uploadRes.imageUrl
          //     );
          //   })
          // )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(["/all-patients"]);
            this.presentAlert();
          });
      });
  }
}
