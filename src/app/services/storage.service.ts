import { Injectable } from '@angular/core';

/**
 * Enum defining keys for accessing stored data in the application.
 */
export enum StorageKeys{
  DARK_THEME = "settings.darktheme",
  SELECTED_LANG = "settings.selectedlang",
  ACCESS_TOKEN = "auth.token.access",
  REFRESH_TOKEN = "auth.token.refresh",
}

/**
 * Service for interacting with browser storage.
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  /**
   * Saves data to browser storage with the specified key.
   * @param key Key to identify the stored data.
   * @param value Data to be stored.
   */
  save(key: string, value: any){
    return localStorage.setItem(key, value)
  }

  /**
   * Retrieves data from browser storage based on the specified key.
   * @param key Key identifying the stored data.
   * @returns Data stored with the specified key.
   */
  retrieve(key: string){
    return localStorage.getItem(key)
  }

  /**
   * Deletes data from browser storage associated with the specified key.
   * @param key Key identifying the data to be deleted.
   */
  delete(key: string){
    return localStorage.removeItem(key)
  }

}