import { environment } from "src/environments/environment";

/**
 * Defines API endpoints with their URLs and authentication requirements.
 */
export class ApiEndpoint {

  /**
   * Endpoints related to user authentication.
   */
  static LOGIN = {
    /**
     * Endpoint for creating a new login session.
     */
    CREATE: { url: `${environment.apiUrl}/auth/login/`, postLogin: false }
  }

  /**
   * Endpoints related to user registration.
   */
  static REGISTER = {
    /**
     * Endpoint for creating a new user account.
     */
    CREATE: { url: `${environment.apiUrl}/auth/register/`, postLogin: false }
  }

  /**
   * Endpoints related to todo items.
   */
  static TODOS = {
    /**
     * Endpoint for listing todo items.
     */
    LIST:   { url: `${environment.apiUrl}/todos/`, postLogin: true },
    /**
     * Endpoint for creating a new todo item.
     */
    CREATE: { url: `${environment.apiUrl}/todos/`, postLogin: true },
    /**
     * Endpoint for reading a specific todo item.
     */
    READ:   { url: `${environment.apiUrl}/todos/`, postLogin: true },
    /**
     * Endpoint for updating a specific todo item.
     */
    UPDATE: { url: `${environment.apiUrl}/todos/`, postLogin: true },
    /**
     * Endpoint for deleting a specific todo item.
     */
    DELETE: { url: `${environment.apiUrl}/todos/`, postLogin: true }
  }

  /**
   * Endpoints related to token management.
   */
  static TOKEN = {
    /**
     * Endpoint for refreshing an access token.
     */
    REFRESH:  { url: `${environment.apiUrl}/auth/refresh/`, postLogin: false },
  }

  /**
   * Checks if the given URL requires authentication after login.
   * @param url The URL to check.
   * @returns True if the URL requires authentication after login, false otherwise.
   */
  static isPostLogin(url: string): boolean {
    for (const categoryKey of Object.keys(ApiEndpoint)) {
      const category = (ApiEndpoint as any)[categoryKey];

      for (const endpointKey of Object.keys(category)) {
        const endpoint = category[endpointKey];
        if (endpoint && endpoint.url && endpoint.url === url) {
          return endpoint.postLogin;
        }
      }
    }
    return true; // Default to requiring authentication after login if URL not found
  }
}
