import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { forkJoin, map, Observable } from 'rxjs';

/**
 * Custom translation loader for ngx-translate.
 * Combines translations from common and module-specific sources.
 */
export class CustomLoader implements TranslateLoader {
  
	constructor(
    private http: HttpClient,  // HTTP client for fetching translation files
    private moduleTranslations: string  // Base URL for module-specific translations
  ) {
	}

  /**
   * Retrieves translations for the specified language.
   * @param lang The language code for which translations are requested.
   * @returns An observable emitting the translations.
   */
	getTranslation(lang: string): Observable<any> {
    
    // Fetch core translations from assets
    const commonTranslations$ = this.http.get(`./assets/i18n/core/${lang}.json`);
    
    // Fetch module-specific translations
    const moduleTranslations$ = this.http.get(`${this.moduleTranslations}${lang}.json`);

    // Combine core and module translations into a single observable
    return forkJoin(
      [commonTranslations$, moduleTranslations$]
    )
    .pipe(
      // Map and merge translations into a single object
      map((translations)=>{
        let res = {};
        translations.forEach((obj) => {
          Object.assign(res, obj);
        });
       return res;
      })
    )
  }
}
