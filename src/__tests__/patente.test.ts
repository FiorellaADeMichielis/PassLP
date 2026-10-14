import {
  normalizarPatente,
  validarPatente,
} from '../features/parking/domain/patente';

describe('Dominio de Patentes (Argentina / Mercosur)', () => {
  describe('validarPatente', () => {
    it('acepta formatos alfanuméricos válidos entre 3 y 12 caracteres', () => {
      expect(validarPatente('AB123CD')).toBe(true);
      expect(validarPatente('ABC123')).toBe(true);
      expect(validarPatente('123')).toBe(true);
      expect(validarPatente('A1B2C3D4E5F6')).toBe(true);
    });

    it('rechaza cadenas vacías, longitud menor a 3 caracteres o mayor a 12', () => {
      expect(validarPatente('')).toBe(false);
      expect(validarPatente('AB')).toBe(false);
      expect(validarPatente('A1B2C3D4E5F67')).toBe(false); // 13 caracteres
    });

    it('rechaza cadenas con símbolos, espacios o caracteres no ASCII como la Ñ', () => {
      expect(validarPatente('A!B')).toBe(false);
      expect(validarPatente('A B')).toBe(false);
      expect(validarPatente('ÑAB123')).toBe(false);
    });
  });

  describe('normalizarPatente', () => {
    it('convierte minúsculas a mayúsculas y remueve espacios y guiones', () => {
      expect(normalizarPatente('ab-123 cd')).toBe('AB123CD');
    });

    it('elimina símbolos especiales y caracteres no ASCII como la Ñ o tildes', () => {
      expect(normalizarPatente('ab!#_ñ-123.á')).toBe('AB123');
    });

    it('recorta la salida a un máximo estricto de 12 caracteres', () => {
      expect(normalizarPatente('a1b2c3d4e5f6g7h8')).toBe('A1B2C3D4E5F6');
    });

    it('retorna cadena vacía ante entrada vacía', () => {
      expect(normalizarPatente('')).toBe('');
    });
  });
});

