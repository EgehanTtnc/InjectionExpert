import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {}

  async presentToast() {
    const toast = await this.toastCtrl.create({
      header: 'Toast Header',
      message: 'Your settings have been saved.',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then((loadingEl) => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if(this.isLogin) {
          authObs = this.authService.login(email, password);
        }else {
          authObs = this.authService.signup(email, password);
        }
        authObs.subscribe(
          (resData) => {
            console.log(resData);
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/all-patients');
          },
          (errRes) => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = 'Could not registered, please try again.';
            if (code === 'EMAIL_EXISTS') {
              message = 'Email is already exist.';
              this.showAlert(message);
            } else if ( code === 'EMAIL_NOT_FOUND') {
              message = 'E-Mail not found, please sign up first.';
              this.showAlert(message);
            } else if ( code === 'INVALID_PASSWORD') {
              message = 'Wrong password. please try again.';
              this.showAlert(message);
            }
          }
        );
      });
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
    this.presentToast()
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
    form.reset();
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Please try again.',
        message: message,
        buttons: ['Okey'],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

}
