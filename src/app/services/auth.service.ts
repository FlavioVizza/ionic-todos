import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiEndpoint } from '../helper/api-endpoint';
import { StorageKeys, StorageService } from './storage.service';
import { Token, TokenObtainPair } from '../models/token';
import { GenericResponse } from '../models/generic-response';

/**
 * Service responsible for managing user authentication.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService
  ) { }

  /**
   * Retrieves the access token from storage.
   * @returns Access token if found, otherwise an empty string.
   */
  getAccessToken(): string {
    return this.storageService.retrieve(StorageKeys.ACCESS_TOKEN) || "";
  }

  /**
   * Sets the access token in storage.
   * @param token Access token to be stored.
   */
  setAccessToken(token: string): void {
    this.storageService.save(StorageKeys.ACCESS_TOKEN, token)
  }

  /**
   * Retrieves the refresh token from storage.
   * @returns Refresh token if found, otherwise an empty string.
   */
  getRefreshToken(): string {
    return this.storageService.retrieve(StorageKeys.REFRESH_TOKEN) || "";
  }

  /**
   * Sets the refresh token in storage.
   * @param token Refresh token to be stored.
   */
  setRefreshToken(token: string): void {
    this.storageService.save(StorageKeys.REFRESH_TOKEN, token)
  }

  /**
   * Requests a refresh of the access token.
   * @returns An Observable emitting the refreshed access token.
   */
  refreshAccessToken(): Observable<Token> {
    const { url } = ApiEndpoint.TOKEN.REFRESH
    const params = {
      refreshToken: this.getRefreshToken(),
      accessToken: this.getAccessToken()
    }
    return this.httpClient.post<Token>(url, params).pipe(tap( this.handleTokenResponse ));
  }

  /**
   * Initiates the login process.
   * @param email User's email.
   * @param password User's password.
   * @returns An Observable emitting the login result with the access token.
   */
  login(email: string, password: string): Observable<Token>{
    const { url } = ApiEndpoint.LOGIN.CREATE
    const params: TokenObtainPair = { email, password }
    return this.httpClient.post<Token>(url, params).pipe(tap( this.handleTokenResponse ));
  }

  /**
   * Registers a new user.
   * @param username Username.
   * @param email User's email.
   * @param password User's password.
   * @param last_name User's last name.
   * @returns An Observable emitting the registered user data.
   */
  register(email: string, password: string, username: string): Observable<GenericResponse>{
    const { url } = ApiEndpoint.REGISTER.CREATE
    const params = { email, password, username }
    return this.httpClient.post<GenericResponse>(url, params);
  }

  /**
   * Handles the response containing access and refresh tokens.
   * @param response Response object containing access and refresh tokens.
   */
  private handleTokenResponse = (response : Token) => {
      this.storageService.save(StorageKeys.ACCESS_TOKEN, response.accessToken)
      this.storageService.save(StorageKeys.REFRESH_TOKEN, response.refreshToken)
  }

  /**
   * Logs out the user by deleting access and refresh tokens from storage.
   */
  logout(){
    this.storageService.delete(StorageKeys.ACCESS_TOKEN)
    this.storageService.delete(StorageKeys.REFRESH_TOKEN)
  }

}
