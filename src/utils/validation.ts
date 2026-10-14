/**
 * Lista oficial de las 24 provincias y distritos de la República Argentina.
 */
export const ARGENTINE_PROVINCES: readonly string[] = [
  'Buenos Aires',
  'Ciudad Autónoma de Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
];

/**
 * Limpia caracteres numéricos y especiales para nombres y apellidos,
 * permitiendo únicamente letras (incluyendo acentos/eñes) y espacios.
 */
export function cleanName(text: string): string {
  return text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
}

/**
 * Formatea un número de DNI argentino con separadores de miles de 7 u 8 dígitos
 * (ej: 8.123.456 o 12.345.678).
 */
export function formatDNI(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length < 7) return digits;
  if (digits.length === 7) {
    return `${digits.slice(0, 1)}.${digits.slice(1, 4)}.${digits.slice(4)}`;
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
}

/**
 * Normaliza un DNI con formato de 7 u 8 dígitos con sus puntos de miles correspondientes
 * (utilizado al perder foco o validar).
 */
export function normalizeDNI(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length === 7) {
    return `${digits.slice(0, 1)}.${digits.slice(1, 4)}.${digits.slice(4)}`;
  }
  if (digits.length === 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  }
  return digits;
}

/**
 * Valida si un DNI argentino tiene entre 7 y 8 dígitos numéricos.
 */
export function isValidDNI(dni: string): boolean {
  const digits = dni.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 8;
}

/**
 * Formatea un número de teléfono argentino con espacios y guiones legibles (ej: 11 2345-6789).
 */
export function formatPhone(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  if (digits.length <= 10) return `${digits.slice(0, 2)} ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 6)}-${digits.slice(6, 10)} ${digits.slice(10)}`;
}

/**
 * Valida si una cadena de texto posee formato válido de correo electrónico.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}
