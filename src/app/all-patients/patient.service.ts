import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { Patient } from './patient.model';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

interface PatientData {
  tcId: string;
  name: string;
  surname: string;
  gender: string;
  dateOfBirth: Date;
  opDescription: string;
  opDate: Date;
  imageUrlPatient: string;
  imageUrlDiagram: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private _patients = new BehaviorSubject<Patient[]>([]);

  get patients() {
    return this._patients.asObservable();
  }

  getPatient(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<PatientData>(
          `https://hey-doc-368b1.firebaseio.com/patients/${id}.json?auth=${token}`
        );
      }),
      map((PatientData) => {
        return new Patient(
          id,
          PatientData.tcId,
          PatientData.name,
          PatientData.surname,
          PatientData.gender,
          new Date(PatientData.dateOfBirth),
          PatientData.opDescription,
          new Date(PatientData.opDate),
          PatientData.imageUrlPatient,
          PatientData.imageUrlDiagram,
          PatientData.userId,
        );
      })
    );
  }

  constructor(private authService: AuthService, private http: HttpClient) { }


  fetchPatients() {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<{ [key: string]: PatientData }>(
          `https://hey-doc-368b1.firebaseio.com/patients.json?auth=${token}`
        );
      }),
      map((resData) => {
        const patients = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            patients.push(
              new Patient(
                key,
                resData[key].tcId,
                resData[key].name,
                resData[key].surname,
                resData[key].gender,
                new Date(resData[key].dateOfBirth),
                resData[key].opDescription,
                new Date(resData[key].opDate),
                resData[key].imageUrlPatient,
                resData[key].imageUrlDiagram,
                resData[key].userId,
              )
            );
          }
        }
        return patients;
      }),
      tap((patients) => {
        this._patients.next(patients);
      })
    );
  }

  uploadImage(imagePat: File, imageDiag: File) {
    const uploadData = new FormData();
    uploadData.append('imagePat', imagePat);
    uploadData.append('imageDiag', imageDiag);
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.post<{ imageUrl: string; imagePath: string }>(
          'https://us-central1-hey-doc-368b1.cloudfunctions.net/storeImage',
          uploadData,
          { headers: { Authorization: 'Bearer' + token } }
        );
      })
    );
  }

  addPatient(
    tcId: string,
    name: string,
    surname: string,
    gender: string,
    dateOfBirth: Date,
    opDescription: string,
    opDate: Date,
    imageUrlPatient: string,
    imageUrlDiagram: string
  ) {
    let generatedId: string;
    let fetchedUserId: string;
    let newPatient: Patient;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        if (!fetchedUserId) {
          throw new Error('No user found');
        }
        newPatient = new Patient(
          Math.random().toString(),
          tcId,
          name,
          surname,
          gender,
          dateOfBirth,
          opDescription,
          opDate,
          imageUrlPatient,
          imageUrlDiagram,
          fetchedUserId,
        );
        return this.http.post<{ name: string }>(
          `https://hey-doc-368b1.firebaseio.com/patients.json?auth=${token}`,
          { ...newPatient, id: null }
        );
      }),
      switchMap((resData) => {
        generatedId = resData.name;
        return this.patients;
      }),
      take(1),
      tap((patients) => {
        newPatient.id = generatedId;
        this._patients.next(patients.concat(newPatient));
      })
    );
  }

  updatePatients(patientId: string, tcId: string, name: string, surname: string, gender: string, dateOfBirth: Date, opDescription: string, opDate: Date, imageUrlPatient: string, imageUrlDiagram: string) {
    let updatedPatients: Patient[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.patients;
      }),
      take(1),
      switchMap((patients) => {
        if (!patients || patients.length <= 0) {
          return this.fetchPatients();
        } else {
          return of(patients);
        }
      }),
      switchMap((patients) => {
        const updatedPatientsIndex = patients.findIndex((pl) => pl.id === patientId);
        const updatedPatients = [...patients];
        const oldPatient = updatedPatients[updatedPatientsIndex];
        updatedPatients[updatedPatientsIndex] = new Patient(
          oldPatient.id,
          tcId,
          name,
          surname,
          gender,
          dateOfBirth,
          opDescription,
          opDate,
          imageUrlPatient,
          imageUrlDiagram,
          oldPatient.userId,
        );
        return this.http.put(
          `https://hey-doc-368b1.firebaseio.com/patients/${patientId}.json?auth=${fetchedToken}`,
          { ...updatedPatients[updatedPatientsIndex], id: null }
        );
      }),
      tap(() => {
        this._patients.next(updatedPatients);
      })
    );
  }

  deletePatient(patientId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete(
          `https://hey-doc-368b1.firebaseio.com/patients/${patientId}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this.patients;
      }),
      take(1),
      tap((patients) => {
        this._patients.next(patients.filter((b) => b.id !== patientId));
      })
    );
  }


}
