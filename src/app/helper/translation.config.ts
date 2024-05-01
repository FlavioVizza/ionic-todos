import { Injector } from '@angular/core';
import { LOCATION_INITIALIZED } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

/**
 * Factory function to initialize the application.
 * Sets up translation service and loads default language translations.
 * @param translate TranslateService instance for managing translations.
 * @param injector Injector instance for dependency injection.
 * @returns A function to be executed during application initialization.
 */
export function ApplicationInitializerFactory(translate: TranslateService, injector: Injector) {
  return async () => {
    // Ensure that location initialization is completed
    await injector.get(LOCATION_INITIALIZED, Promise.resolve(null));

    const defaultLang = environment.defaultLanguage;
    // Add available languages to translation service
    translate.addLangs(environment.languages);
    // Set the default language
    translate.setDefaultLang(defaultLang);
    
    try {
      // Load translations for the default language
      await lastValueFrom(translate.use(defaultLang));
    } catch (err) {

    }

  };
}
