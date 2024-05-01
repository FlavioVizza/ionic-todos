import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppStateService } from './app-state.service';
import { StorageKeys, StorageService } from './storage.service';

/**
 * Service responsible for managing language settings and translation.
 */
@Injectable({providedIn: "any"})
export class LanguageService {

  constructor(
    private readonly translateService: TranslateService,
    private readonly storageService: StorageService,
    private readonly appStateService: AppStateService
  ) { 
    this.initService()
  }

  /**
   * Initializes the language service by setting the default language and subscribing to language change events.
   */
  private initService(){
    const selectedLang = this.retrieveAppLanguage()
    const usedLang = selectedLang ? selectedLang : environment.defaultLanguage
    this.translateService.use(usedLang)

    this.appStateService.onChangeLanguage$
    .pipe( filter(lang => lang != null) )
    .subscribe( lang => {
      this.setLanguage(lang!);
    })
  }

  /**
   * Sets the application language.
   * @param lang Language code representing the new language.
   */
  private setLanguage(lang: string){
    if(!this.translateService) return
    this.translateService.use(lang)
    this.storageService.save(StorageKeys.SELECTED_LANG, lang)
  }

  /**
   * Changes the application language.
   * @param lang Language code representing the new language.
   */
  changeLanguage(lang: string){
    this.appStateService.changeLanguage(lang)
  }

  /**
   * Retrieves the current application language.
   * @returns Current application language code.
   */
  getLanguage(){
    return this.translateService.currentLang
  }

  /**
   * Retrieves the list of available languages.
   * @returns Array of language codes representing available languages.
   */
  getLanguages(){
    return environment.languages;
  }

  /**
   * Retrieves the saved application language from storage.
   * @returns Saved application language code.
   */
  retrieveAppLanguage() {
    return this.storageService.retrieve(StorageKeys.SELECTED_LANG) 
  }

  /**
   * Saves the application language to storage.
   * @param value Language code to be saved.
   */
  setAppLanguage(value: string){
    this.storageService.save(StorageKeys.SELECTED_LANG, value)
  }

  /**
   * Translates a given key into the current application language.
   * @param value Key to be translated.
   * @param interpolateParams Optional parameters for string interpolation.
   * @returns Translated string.
   */
  translate(value: string, interpolateParams?: Object){
    return this.translateService.instant(value, interpolateParams);
  }
 
}
