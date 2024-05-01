import { NgFor } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonItem, IonToggle, IonLabel, IonIcon, IonToolbar, IonTitle, IonContent, AlertController, IonModal, IonList, IonButtons, IonButton } from '@ionic/angular/standalone';
import { OverlayEventDetail } from '@ionic/core/components';
import { TranslateModule } from '@ngx-translate/core';
import { Routes } from 'src/app/helper/routes';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { ThemeService } from 'src/app/services/theme.service';
import { chevronForwardSharp, exit } from 'ionicons/icons';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  standalone: true,
  imports: [IonHeader, IonItem, IonToggle, IonToolbar, IonTitle,  IonLabel, IonIcon, IonContent, IonModal, IonList, IonButtons, IonButton, TranslateModule, NgFor]
})

export class SettingsPage {

  /** Represents the current state of the toggle switch. */
  toggle = 'off';

  /** Array of supported languages for the application. */
  languages: string[] = [];

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly alertController: AlertController,
    private readonly themeService: ThemeService,
    private readonly languageService: LanguageService
  ) {
    addIcons({ chevronForwardSharp, exit });
  }

  /**
   * Executes after content initialization.
   * Sets the toggle based on the current theme mode.
   */
  ngAfterContentInit(): void {
    this.toggle = this.themeService.isDarkEnabled() ? 'on' : 'off';
  }

  /**
   * Executes on component initialization.
   * Retrieves supported languages and creates a list of strings for translation.
   */
  ngOnInit() {
    const supportedLanguages = this.languageService.getLanguages();
    this.languages = supportedLanguages.map(lang => `LANGUAGES.${lang.toUpperCase()}`);
  }

  /**
   * Handles the change event of the toggle switch for dark mode.
   * @param event The change event object.
   */
  onToggleChange(event: any) {
    this.themeService.setDark(event?.detail?.checked);
  }

  /**
   * Handles the logout button click event.
   * Displays a confirmation dialog before logging out the user.
   */
  async onLogoutClick() {
    const header = this.languageService.translate("LOGOUT.POPUP.HEADER");
    const message = this.languageService.translate("LOGOUT.POPUP.MESSAGE");
    const ok = this.languageService.translate("OK");
    const cancel = this.languageService.translate("CANCEL");

    const okHandler = async () => { 
      await this.authService.logout();
      this.router.navigateByUrl(Routes.Login, { replaceUrl: true});
    };

    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        { text: cancel },
        { text: ok, handler: okHandler },
      ]
    });
    
    await alert.present();
  }

  //#region 'Change Language Modal'
  @ViewChild(IonModal) modal!: IonModal;

  /**
   * Dismisses the modal.
   * @param selectedItem The selected item to return.
   */
  cancel(selectedItem?: string) {
    this.modal.dismiss(selectedItem, 'cancel');
  }

  /**
   * Executes before the modal dismisses.
   * @param event The dismiss event object.
   */
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
  }

  /**
   * Handles the click event of a language item.
   * Converts translation key to language string and changes the app language.
   * @param lang The selected language translation key.
   */
  onLanguageClick(lang: string) {
    lang = lang.split('.')[1].toLowerCase();
    this.languageService.changeLanguage(lang);
    this.cancel(lang);
  }
  //#endregion 'Change Language Modal'
}

