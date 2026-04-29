/**
 * Validadores de seguridad para formularios
 * Utilizados en toda la aplicación para garantizar datos seguros
 */

export const validators = {
  /**
   * Valida que un nombre tenga al menos 2 caracteres
   */
  isValidName: (name: string): boolean => {
    return name.trim().length >= 2;
  },

  /**
   * Valida formato de email
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  /**
   * Valida que una contraseña cumpla con requisitos de seguridad
   * Mínimo 8 caracteres, debe incluir mayúsculas y números
   */
  isValidPassword: (password: string): boolean => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    );
  },

  /**
   * Valida formato de teléfono internacional
   */
  isValidPhone: (phone: string): boolean => {
    if (!phone.trim()) return true; // Opcional
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.trim());
  },

  /**
   * Valida longitud máxima de texto
   */
  isValidLength: (text: string, maxLength: number): boolean => {
    return text.length <= maxLength;
  },

  /**
   * Sanitiza entrada de texto removiendo espacios extras
   */
  sanitizeText: (text: string): string => {
    return text.trim();
  },

  /**
   * Valida que dos contraseñas coincidan
   */
  passwordsMatch: (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
  },
};

/**
 * Mensajes de error estandarizados
 */
export const errorMessages = {
  invalidName: "El nombre debe tener al menos 2 caracteres.",
  invalidEmail: "Por favor, ingresa un email válido.",
  invalidPassword: "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas y números.",
  invalidPhone: "El teléfono tiene un formato inválido.",
  passwordMismatch: "Las contraseñas no coinciden.",
  messageTooLong: "El mensaje no puede exceder 2000 caracteres.",
  invalidCompany: "El nombre de la empresa debe tener al menos 2 caracteres.",
};
