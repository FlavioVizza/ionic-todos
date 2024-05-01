import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, AlertController, LoadingController, ModalController, IonItem, IonButton, IonLabel, IonInput, IonText } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Routes } from 'src/app/helper/routes';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { RegisterComponent } from '../register/register.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonText, IonButton, IonInput, IonItem, IonContent, IonHeader, IonTitle, IonLabel, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, TranslateModule ]
})

export class LoginPage {

  /**
   * Form group for login credentials.
   */
  credentials: FormGroup = this.fb.group({
    email:    ['',  [Validators.required, Validators.email]], // Form control for email with required and email validators
    password: ['',  [Validators.required, Validators.minLength(8)]], // Form control for password with required and min length validators
  });

  /**
   * Getter for email form control.
   */
  get email(): any {
    return this.credentials.get('email');
  }
  
  /**
   * Getter for password form control.
   */
  get password(): any {
    return this.credentials.get('password');
  }

  /**
   * Constructor for LoginPage component.
   * @param fb FormBuilder for creating form groups
   * @param authService AuthService for authentication
   * @param alertController AlertController for displaying alerts
   * @param loadingController LoadingController for displaying loading indicators
   * @param router Router for navigation
   * @param modalCtrl ModalController for displaying modals
   * @param languageService LanguageService for language translations
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private modalCtrl: ModalController,
    private languageService: LanguageService
  ) {}

  /**
   * Method for user login.
   */
  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const { email, password } = this.credentials.value;
      const loginData = await this.authService.login(email, password).toPromise();
      
      if (loginData) return this.onSignInSuccess();
      else return this.onSignInError();
    } catch (error) {
      return this.onSignInError();
    } finally {
      await loading.dismiss();
    }
  }

  /**
   * Callback function for successful sign-in.
   */
  private onSignInSuccess = () => {
    this.router.navigateByUrl(Routes.Root, { replaceUrl: true });
  }

  /**
   * Callback function for sign-in error.
   */
  private onSignInError = async () => {
    const alert = await this.alertController.create({
      header: this.languageService.translate("LOGIN.POPUP.ERROR_HEADER"),
      message: this.languageService.translate("LOGIN.POPUP.ERROR_MESSAGE"),
      buttons: [this.languageService.translate("OK")],
    });

    await alert.present();
  }

  /**
   * Method to navigate to the sign-up page.
   */
  async goToSignUp() {
    const modal = await this.modalCtrl.create({
      component: RegisterComponent
    });
    modal.present();
  }
}
