// src/utils/validator.js

/**
 * Validation utilities
 * Provides reusable validation functions for forms and data
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone number
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} Is strong password
 */
export const isValidPassword = (password) => {
  if (!password) return false;
  // At least 8 characters, containing uppercase, lowercase, and numbers
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate student batch format (YYYY-YYYY)
 * @param {string} batch - Batch to validate
 * @returns {boolean} Is valid batch format
 */
export const isValidBatch = (batch) => {
  if (!batch) return false;
  const batchRegex = /^\d{4}-\d{4}$/;
  return batchRegex.test(batch);
};

/**
 * Validate CGPA (0-10 scale)
 * @param {number|string} cgpa - CGPA to validate
 * @returns {boolean} Is valid CGPA
 */
export const isValidCGPA = (cgpa) => {
  if (cgpa === '' || cgpa === undefined || cgpa === null) return true; // Optional field
  const numericCGPA = parseFloat(cgpa);
  return !isNaN(numericCGPA) && numericCGPA >= 0 && numericCGPA <= 10;
};

/**
 * Check if value is not empty
 * @param {any} value - Value to check
 * @returns {boolean} Is not empty
 */
export const isRequired = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim() !== '';
  return true;
};

/**
 * Check if value meets minimum length
 * @param {string} value - Value to check
 * @param {number} minLength - Minimum length
 * @returns {boolean} Meets minimum length
 */
export const hasMinLength = (value, minLength) => {
  if (!value) return false;
  return value.length >= minLength;
};

/**
 * Check if value doesn't exceed maximum length
 * @param {string} value - Value to check
 * @param {number} maxLength - Maximum length
 * @returns {boolean} Doesn't exceed maximum length
 */
export const hasMaxLength = (value, maxLength) => {
  if (!value) return true;
  return value.length <= maxLength;
};

/**
 * Check if value is numeric
 * @param {any} value - Value to check
 * @returns {boolean} Is numeric
 */
export const isNumeric = (value) => {
  if (value === '' || value === undefined || value === null) return true; // Optional field
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid URL
 */
export const isValidURL = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Validate student ID format
 * @param {string} studentId - Student ID to validate
 * @returns {boolean} Is valid student ID format
 */
export const isValidStudentId = (studentId) => {
  if (!studentId) return false;
  // This is an example pattern - adjust to match your actual student ID format
  // Current pattern: Letters followed by numbers, at least 6 characters
  const studentIdRegex = /^[A-Za-z]+[0-9]+$/;
  return studentIdRegex.test(studentId) && studentId.length >= 6;
};

/**
 * Check if value is within a range
 * @param {number} value - Value to check
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} Is within range
 */
export const isInRange = (value, min, max) => {
  if (value === '' || value === undefined || value === null) return true; // Optional field
  const numValue = parseFloat(value);
  return !isNaN(numValue) && numValue >= min && numValue <= max;
};

/**
 * Validate schema against data
 * @param {Object} data - Data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} Validation result with isValid flag and errors object
 */
export const validateSchema = (data, schema) => {
  const errors = {};
  
  Object.keys(schema).forEach(field => {
    const value = data[field];
    const rules = schema[field];
    
    for (const rule of rules) {
      const { validator, params, message } = rule;
      
      // If validator requires params, call with value and params, otherwise just value
      const isValid = params !== undefined 
        ? validator(value, params) 
        : validator(value);
      
      if (!isValid) {
        errors[field] = message;
        break;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation schemas

/**
 * Profile form validation schema
 */
export const profileValidationSchema = {
  username: [
    { validator: isRequired, message: 'Full name is required' },
    { validator: hasMinLength, params: 2, message: 'Name must be at least 2 characters long' },
    { validator: hasMaxLength, params: 100, message: 'Name cannot exceed 100 characters' }
  ],
  phone: [
    { validator: isRequired, message: 'Phone number is required' },
    { validator: isValidPhone, message: 'Invalid phone number format' }
  ],
  department: [
    { validator: isRequired, message: 'Department is required' }
  ],
  preferred_role: [
    { validator: isRequired, message: 'Preferred role is required' }
  ],
  batch: [
    { validator: isRequired, message: 'Batch is required' },
    { validator: isValidBatch, message: 'Batch must be in format YYYY-YYYY' }
  ],
  student_id: [
    { validator: isRequired, message: 'Student ID is required' },
    { validator: hasMinLength, params: 5, message: 'Student ID must be at least 5 characters' }
  ],
  current_cgpa: [
    { validator: isValidCGPA, message: 'CGPA must be a number between 0 and 10' }
  ],
  skills: [
    { validator: isRequired, message: 'At least one skill is required' }
  ]
};

/**
 * Login form validation schema
 */
export const loginValidationSchema = {
  email: [
    { validator: isRequired, message: 'Email is required' },
    { validator: isValidEmail, message: 'Invalid email format' }
  ],
  password: [
    { validator: isRequired, message: 'Password is required' },
    { validator: hasMinLength, params: 8, message: 'Password must be at least 8 characters' }
  ]
};

/**
 * Request update permission validation schema
 */
export const updateRequestValidationSchema = {
  reason: [
    { validator: isRequired, message: 'Reason is required' },
    { validator: hasMinLength, params: 10, message: 'Reason must be at least 10 characters' },
    { validator: hasMaxLength, params: 500, message: 'Reason cannot exceed 500 characters' }
  ]
};

/**
 * Validator utility object with all validation functions and schemas
 */
export default {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidBatch,
  isValidCGPA,
  isRequired,
  hasMinLength,
  hasMaxLength,
  isNumeric,
  isValidURL,
  isValidStudentId,
  isInRange,
  validateSchema,
  profileValidationSchema,
  loginValidationSchema,
  updateRequestValidationSchema
};