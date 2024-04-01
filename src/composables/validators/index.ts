import { ValidationRuleWithParams } from '@vuelidate/core';
import {
  decimal,
  email,
  helpers,
  minLength,
  numeric,
  required,
  url,
} from '@vuelidate/validators';

/**
 * This code snippet exports several functions that provide validation rules for different types of input fields.
 * Each function returns a ValidationRuleWithParams object, which can be used with the Vuelidate library.
 *
 * - useEmail(): Returns a validation rule for email fields.
 * - useRequired(): Returns a validation rule for required fields.
 * - useMinLength(lengthNumber): Returns a validation rule for fields with a minimum length.
 * - useName(): Returns a validation rule for name fields.
 * - usePhoneNumber(): Returns a validation rule for phone number fields.
 * - useNumeric(): Returns a validation rule for numeric fields.
 * - useDecimal(): Returns a validation rule for decimal fields.
 * - useUrl(): Returns a validation rule for URL fields.
 *
 * Each validation rule is created using the helpers.withMessage() function, which allows custom error messages to be displayed.
 * The validation rules are implemented using the validators provided by the @vuelidate/validators package.
 *
 * Example usage:
 *
 * import { useEmail, useRequired } from './validationRules';
 *
 * const validations = {
 *   email: { useEmail },
 *   password: { useRequired, useMinLength: useMinLength(8) },
 * };
 *
 * export default {
 *   data() {
 *     return {
 *       email: '',
 *       password: '',
 *     };
 *   },
 *   validations,
 * };
 */

const useEmail = (): ValidationRuleWithParams => {
  return helpers.withMessage('Email tidak valid', email);
};

const useRequired = (): ValidationRuleWithParams => {
  return helpers.withMessage('Harus di isi', required);
};

const useMinLength = (lengthNumber: number): ValidationRuleWithParams => {
  return helpers.withMessage(
    `Password harus lebih dari ${lengthNumber} karakter`,
    minLength(lengthNumber)
  );
};

const useName = (): ValidationRuleWithParams => {
  return helpers.withMessage('Nama harus lebih dari 1 karakter', minLength(2));
};

const usePhoneNumber = (): ValidationRuleWithParams => {
  const validNumber = helpers.regex(/^(?:\+62|0)[0-9]{8,15}$/);
  return helpers.withMessage('Nomor handphone tidak valid', validNumber);
};
const useNumeric = (): ValidationRuleWithParams => {
  return helpers.withMessage('Form harus angka', numeric);
};
const useDecimal = (): ValidationRuleWithParams => {
  return helpers.withMessage('Form harus angka desimal', decimal);
};

const useUrl = (): ValidationRuleWithParams => {
  return helpers.withMessage('Link tidak valid', url);
};

export {
  useEmail,
  useRequired,
  useMinLength,
  useName,
  usePhoneNumber,
  useNumeric,
  useDecimal,
  useUrl,
};
