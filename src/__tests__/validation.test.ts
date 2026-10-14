import {
  ARGENTINE_PROVINCES,
  cleanName,
  formatDNI,
  formatPhone,
  isValidDNI,
  isValidEmail,
  normalizeDNI,
} from '../utils/validation';

describe('validation utils', () => {
  describe('cleanName', () => {
    it('permite nombres regulares y espacios', () => {
      expect(cleanName('Juan Perez')).toBe('Juan Perez');
    });

    it('conserva acentos y caracteres de la lengua española (ñ, á, é, í, ó, ú)', () => {
      expect(cleanName('María José Núñez Álzaga')).toBe('María José Núñez Álzaga');
    });

    it('elimina dígitos numéricos y símbolos especiales', () => {
      expect(cleanName('Lucas123! @Pérez#')).toBe('Lucas Pérez');
    });

    it('retorna cadena vacía si solo contiene números o símbolos', () => {
      expect(cleanName('12345$%#')).toBe('');
    });
  });

  describe('formatDNI', () => {
    it('retorna dígitos directos para 1 a 6 caracteres', () => {
      expect(formatDNI('1')).toBe('1');
      expect(formatDNI('12')).toBe('12');
      expect(formatDNI('123')).toBe('123');
      expect(formatDNI('12345')).toBe('12345');
      expect(formatDNI('123456')).toBe('123456');
    });

    it('formatea automáticamente DNI de 7 dígitos como X.XXX.XXX', () => {
      expect(formatDNI('8123456')).toBe('8.123.456');
      expect(formatDNI('8.123.456')).toBe('8.123.456');
    });

    it('formatea automáticamente DNI de 8 dígitos como XX.XXX.XXX', () => {
      expect(formatDNI('12345678')).toBe('12.345.678');
      expect(formatDNI('12.345.678')).toBe('12.345.678');
      expect(formatDNI('40123456')).toBe('40.123.456');
    });

    it('descarta caracteres no numéricos y limita a 8 dígitos máximos', () => {
      expect(formatDNI('40.123.456 extra')).toBe('40.123.456');
      expect(formatDNI('999999999999')).toBe('99.999.999');
    });
  });

  describe('normalizeDNI', () => {
    it('normaliza correctamente DNIs de 7 dígitos a formato X.XXX.XXX', () => {
      expect(normalizeDNI('8123456')).toBe('8.123.456');
      expect(normalizeDNI('8.123.456')).toBe('8.123.456');
    });

    it('normaliza correctamente DNIs de 8 dígitos a formato XX.XXX.XXX', () => {
      expect(normalizeDNI('12345678')).toBe('12.345.678');
      expect(normalizeDNI('12.345.678')).toBe('12.345.678');
    });

    it('devuelve dígitos simples si tiene menos de 7 caracteres', () => {
      expect(normalizeDNI('12345')).toBe('12345');
    });
  });

  describe('isValidDNI', () => {
    it('acepta DNIs argentinos válidos de 7 y 8 dígitos', () => {
      expect(isValidDNI('8123456')).toBe(true);
      expect(isValidDNI('8.123.456')).toBe(true);
      expect(isValidDNI('12345678')).toBe(true);
      expect(isValidDNI('12.345.678')).toBe(true);
      expect(isValidDNI('40.123.456')).toBe(true);
    });

    it('rechaza DNIs con menos de 7 o más de 8 dígitos', () => {
      expect(isValidDNI('')).toBe(false);
      expect(isValidDNI('123456')).toBe(false); // 6 dígitos
      expect(isValidDNI('12.345.6')).toBe(false);
      expect(isValidDNI('123456789')).toBe(false); // 9 dígitos
      expect(isValidDNI('abcdefgh')).toBe(false);
    });
  });

  describe('formatPhone', () => {
    it('formatea un número telefónico móvil con código de área y guión', () => {
      expect(formatPhone('1123456789')).toBe('11 2345-6789');
    });

    it('formatea números progresivamente según la cantidad de dígitos ingresados', () => {
      expect(formatPhone('11')).toBe('11');
      expect(formatPhone('11234')).toBe('11 234');
      expect(formatPhone('112345')).toBe('11 2345');
      expect(formatPhone('11234567')).toBe('11 2345-67');
      expect(formatPhone('112345678901')).toBe('11 2345-6789 01');
    });

    it('limpia letras y caracteres no numéricos', () => {
      expect(formatPhone('tel: 11-2345-6789')).toBe('11 2345-6789');
    });
  });

  describe('isValidEmail', () => {
    it('valida correos electrónicos con estructura estándar y subdominios', () => {
      expect(isValidEmail('usuario@example.com')).toBe(true);
      expect(isValidEmail('contacto.cliente@empresa.com.ar')).toBe(true);
      expect(isValidEmail('nombre+alias@correo.org')).toBe(true);
    });

    it('trimea espacios en blanco antes de validar', () => {
      expect(isValidEmail('  usuario@mail.com  ')).toBe(true);
    });

    it('rechaza correos electrónicos malformados', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('usuario')).toBe(false);
      expect(isValidEmail('usuario@')).toBe(false);
      expect(isValidEmail('@dominio.com')).toBe(false);
      expect(isValidEmail('usuario@dominio')).toBe(false);
      expect(isValidEmail('usuario espacio@dominio.com')).toBe(false);
    });
  });

  describe('ARGENTINE_PROVINCES', () => {
    it('contiene las 24 jurisdicciones de Argentina', () => {
      expect(ARGENTINE_PROVINCES).toHaveLength(24);
    });

    it('incluye las principales provincias y CABA', () => {
      expect(ARGENTINE_PROVINCES).toContain('Buenos Aires');
      expect(ARGENTINE_PROVINCES).toContain('Ciudad Autónoma de Buenos Aires');
      expect(ARGENTINE_PROVINCES).toContain('Córdoba');
      expect(ARGENTINE_PROVINCES).toContain('Santa Fe');
      expect(ARGENTINE_PROVINCES).toContain('Mendoza');
    });
  });
});

