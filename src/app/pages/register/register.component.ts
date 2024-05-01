import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, AlertController, LoadingController, ModalController, IonItem, IonButton, IonLabel, IonInput, IonButtons, IonFooter } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { checkPasswords } from 'src/app/helper/functions';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [IonButtons, IonFooter, IonButton, IonInput, IonItem, IonContent, IonHeader, IonTitle, IonLabel, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, TranslateModule ]
})
export class RegisterComponent {

  // Define FormGroup for user registration credentials
  credentials: FormGroup = this.fb.group({
    email:      ['',  [Validators.required, Validators.email]], // Email field with validation
    username:  ['', [Validators.required, Validators.minLength(2)]], // Firstname field with validation
    password:   ['', [Validators.required, Validators.minLength(8)]], // Password field with validation
    confirmPassword: ['', [Validators.required, Validators.minLength(8) ]], // Confirm password field with validation
  }, { 
    validators: checkPasswords // Custom validator to check if passwords match
  });

  // getter for email form control
  get email(): any {
    return this.credentials.get('email');
  }
  
  // getter for username form control
  get username(): any {
    return this.credentials.get('username');
  }

  // getter for password form control
  get password(): any {
    return this.credentials.get('password');
  }

  // getter for confirm password form control
  get confirmPassword(): any {
    return this.credentials.get('confirmPassword');
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private languageService: LanguageService
  ) {}
  
  /**
   * Method to handle user sign-up
   * @returns 
   */
  async signUp() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      // Extract user credentials from form and Call AuthService to register user
      const { email, password, username } = this.credentials.value;
      const user = await this.authService.register(email, password, username).toPromise();
      console.log(user)
    } 
    catch (error) { 
      return this.onSignInError();
    } 
    finally { 
      await loading.dismiss();
    }

    return this.onSignInSuccess();
  }

  /**
   * Method to handle successful sign-up
   */
  private onSignInSuccess = async () => {
    
    // Define handler function for alert
    const okHandler = () => {
      this.modalCtrl.dismiss(null);
    }
    
    const alert = await this.alertController.create({
      header:   this.languageService.translate("REGISTER.POPUP.SUCCESS_HEADER"),
      message:  this.languageService.translate("REGISTER.POPUP.SUCCESS_MESSAGE"),
      buttons: [{ text: this.languageService.translate("OK"), handler: okHandler }],

    });

    await alert.present();
  }

  /**
   * Method to handle sign-up error
   */
  private onSignInError = async () => {
    const alert = await this.alertController.create({
      header:  this.languageService.translate("REGISTER.POPUP.ERROR_HEADER"),
      message: this.languageService.translate("REGISTER.POPUP.ERROR_MESSAGE"),
      buttons: [ this.languageService.translate("OK") ],
    });

    await alert.present();
  }

  /**
   * Method to dismiss modal 
   */
  dismiss() {
    this.modalCtrl.dismiss(null);
  }
}
