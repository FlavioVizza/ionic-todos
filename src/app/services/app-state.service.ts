import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service managing the application state.
 */
@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  constructor() { }

  //#region 'todosListChanged'

  /**
   * Flag indicating whether the list of todos has changed.
   */
  private todosListChanged = false;

  /**
   * Sets the flag indicating the change in the list of todos.
   * @param changed Boolean value indicating the change.
   */
  setTodosListChanged(changed: boolean) {
    this.todosListChanged = changed;
  }

  /**
   * Retrieves the flag indicating whether the list of todos has changed.
   * @returns Boolean value indicating the change.
   */
  getTodosListChanged() {
    return this.todosListChanged;
  }

  //#endregion 'todosListChanged'

  /**
   * BehaviorSubject for managing language changes.
   */
  private _language$ : BehaviorSubject<string|null> = new BehaviorSubject<string|null>(null)
  
  /**
   * Observable for subscribing to language change events.
   */
  public onChangeLanguage$ = this._language$.asObservable()

  /**
   * Changes the application language.
   * @param lang Language code representing the new language.
   */
  changeLanguage(lang: string){
    this._language$.next(lang)
  }
  
}
