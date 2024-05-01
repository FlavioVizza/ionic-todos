import { Injectable } from '@angular/core';
import { StorageKeys, StorageService } from './storage.service';

/**
 * Service for managing application theme settings.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    private readonly storageService: StorageService
  ) { }

  /**
   * Checks if the system default theme is dark.
   * @returns Boolean indicating if the system default theme is dark.
   */
  isSystemDefaultDark() {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
    const isDark = systemTheme?.matches
    return isDark
  }

  /**
   * Retrieves the application theme from storage.
   * @returns Theme value retrieved from storage.
   */
  retrieveAppTheme() {
   return this.storageService.retrieve(StorageKeys.DARK_THEME) 
  }

  /**
   * Checks if dark mode is currently enabled.
   * @returns Boolean indicating if dark mode is enabled.
   */
  isDarkEnabled() {
    return document.body.className.includes('dark')
  }  

  /**
   * Sets the application theme to dark or light mode.
   * @param value Boolean value indicating whether to set dark mode (true) or light mode (false).
   */
  setDark(value: boolean){
    document.body.classList.toggle('dark', value);
    this.storageService.save(StorageKeys.DARK_THEME, value)
  }

}