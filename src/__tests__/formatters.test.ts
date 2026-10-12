import { formatCurrency } from '../utils/formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formatea un número entero estándar con separadores de miles argentinos', () => {
      const result = formatCurrency(15000);
      expect(result).toMatch(/\$\s?15\.000/);
    });

    it('formatea el monto cero correctamente', () => {
      const result = formatCurrency(0);
      expect(result).toMatch(/\$\s?0/);
    });

    it('formatea cifras grandes con múltiples puntos de miles', () => {
      const result = formatCurrency(1250000);
      expect(result).toMatch(/\$\s?1\.250\.000/);
    });

    it('redondea centavos sin mostrar fracciones decimales', () => {
      const result = formatCurrency(4999.85);
      expect(result).toMatch(/\$\s?5\.000/);
    });
  });
});

