import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  private themeService: ThemeService = inject(ThemeService);

  /**
  * Lifecycle hook that is called after Angular has initialized all data-bound properties of the component.
  * Initializes the application by setting up the theme.
  */
  ngOnInit(): void {
    this.initializeApp();
  }
  
  /**
   * Initializes the application by setting up the theme.
   * Determines the system theme and sets the app theme accordingly.
   */
  async initializeApp() {
    // System theme
    const systemTheme = await this.themeService.isSystemDefaultDark() ? 'dark' : 'light';
    console.log(`System default theme is ${systemTheme}`);

    // App Settings Theme
    const appTheme = this.themeService.retrieveAppTheme();
    console.log(`App theme is dark? ${appTheme}`);
    if (appTheme === 'true') this.themeService.setDark(true);
  }
}
