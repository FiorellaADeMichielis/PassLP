/**
 * Reglas de dominio y validación de patentes vehiculares (Argentina / Mercosur).
 *
 * Módulo de TypeScript puro sin dependencias de React, React Native o Expo.
 */

/**
 * Valida de forma estricta si una cadena cumple con el formato alfanumérico
 * permitido para patentes (longitud de 3 a 12 caracteres alfanuméricos ASCII).
 *
 * No normaliza la cadena recibida.
 */
export function validarPatente(valor: string): boolean {
  return /^[A-Za-z0-9]{3,12}$/.test(valor);
}

/**
 * Normaliza una entrada de patente convirtiéndola a mayúsculas,
 * descartando espacios, guiones, símbolos y caracteres no ASCII (incluida la 'Ñ' o tildes),
 * y recortando el resultado a un máximo de 12 caracteres.
 */
export function normalizarPatente(valor: string): string {
  if (!valor) return '';
  return valor
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 12);
}

