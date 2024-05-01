import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/**
 * Checks if a string is a valid email address.
 * @param email The email address to validate.
 * @returns True if the email is valid, false otherwise.
 */
export function isEmail(email: string): boolean {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regEx.test(email);
}

/**
 * Checks if a string is empty.
 * @param string The string to check.
 * @returns True if the string is empty, false otherwise.
 */
export function isEmpty(string: string): boolean {
  return string.trim() === '';
}

/**
 * Validates sign-up data.
 * @param data The sign-up data to validate.
 * @returns An object containing errors and validity status.
 */
export function validateSignUpData(data: any): { errors: any, valid: boolean } {
  let errors: any = {};

  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty';
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address';
  }

  if (isEmpty(data.password)) errors.password = 'Must not be empty';
  if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match';
  if (isEmpty(data.username)) errors.username = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0
  };
}

/**
 * Validates login data.
 * @param data The login data to validate.
 * @returns An object containing errors and validity status.
 */
export function validateLoginData(data: any): { errors: any, valid: boolean } {
  let errors: any = {};

  if (isEmpty(data.email)) errors.email = 'Must not be empty';
  if (isEmpty(data.password)) errors.password = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0
  };
}

/**
 * Validator function to check if passwords match.
 * @param group The form control group containing password and confirmPassword controls.
 * @returns ValidationErrors object if passwords do not match, null otherwise.
 */
export const checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
  let pass = group.get('password')?.value;
  let confirmPass = group.get('confirmPassword')?.value;
  return pass === confirmPass ? null : { notSame: true };
};

/**
 * Generates a random ID.
 * @returns A randomly generated ID.
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Sorts an array of IDs.
 * @param uids The array of IDs to sort.
 * @returns The sorted array of IDs.
 */
export const sortUids = (uids: string[]): string[] => {
  return uids.sort((a,b) => a.localeCompare(b));
};
