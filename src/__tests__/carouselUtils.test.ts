import {
  calcularAjusteCircular,
  calcularIndiceMedio,
  calcularSiguienteIndice,
  obtenerListaCircular,
  REPETICIONES_CARRUSEL_DEFAULT,
} from '../utils/carouselUtils';

describe('carouselUtils', () => {
  describe('obtenerListaCircular', () => {
    it('retorna la lista original mapeada si contiene 0 o 1 elemento', () => {
      expect(obtenerListaCircular([])).toEqual([]);
      const single = [{ id: '1', title: 'Evento 1' }];
      const result = obtenerListaCircular(single);
      expect(result).toHaveLength(1);
      expect(result[0].virtualId).toBe('single-0');
      expect(result[0].realIndex).toBe(0);
    });

    it('utiliza REPETICIONES_CARRUSEL_DEFAULT por defecto', () => {
      const items = [{ id: 'a' }, { id: 'b' }];
      const result = obtenerListaCircular(items);
      expect(result).toHaveLength(items.length * REPETICIONES_CARRUSEL_DEFAULT);
    });

    it('multiplica los elementos por el factor de repeticiones con IDs virtuales únicos', () => {
      const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
      const result = obtenerListaCircular(items, 3);
      expect(result).toHaveLength(9);
      expect(result[0].virtualId).toBe('loop-0-0');
      expect(result[0].realIndex).toBe(0);
      expect(result[3].virtualId).toBe('loop-1-0');
      expect(result[3].realIndex).toBe(0);
      expect(result[8].virtualId).toBe('loop-2-2');
      expect(result[8].realIndex).toBe(2);
    });
  });

  describe('calcularIndiceMedio', () => {
    it('retorna 0 para listas vacías o con 1 elemento', () => {
      expect(calcularIndiceMedio(0)).toBe(0);
      expect(calcularIndiceMedio(1)).toBe(0);
    });

    it('calcula el offset base del bloque medio para repeticiones impares', () => {
      // 5 elementos con 7 repeticiones: bloque medio inicia en 3 * 5 = 15
      expect(calcularIndiceMedio(5, 7)).toBe(15);
      // 3 elementos con 5 repeticiones: bloque medio inicia en 2 * 3 = 6
      expect(calcularIndiceMedio(3, 5)).toBe(6);
    });
  });

  describe('calcularAjusteCircular', () => {
    const snap = 200;
    const total = 5;
    const repeticiones = 7;

    it('no requiere ajuste si el índice se encuentra dentro del bloque medio', () => {
      // Bloque medio: 15..19
      for (let i = 15; i <= 19; i++) {
        const res = calcularAjusteCircular(i * snap, snap, total, repeticiones);
        expect(res.necesitaAjuste).toBe(false);
        expect(res.targetOffset).toBe(i * snap);
        expect(res.indiceReal).toBe(i - 15);
      }
    });

    it('calcula ajuste silencioso al bloque medio si se supera el último elemento del bloque', () => {
      // Índice 20 (primer elemento del siguiente bloque) debe mapear a índice 15
      const res = calcularAjusteCircular(20 * snap, snap, total, repeticiones);
      expect(res.necesitaAjuste).toBe(true);
      expect(res.targetOffset).toBe(15 * snap);
      expect(res.indiceReal).toBe(0);
    });

    it('calcula ajuste silencioso al bloque medio si se retrocede antes del primer elemento del bloque', () => {
      // Índice 14 (último elemento del bloque anterior) debe mapear a índice 19
      const res = calcularAjusteCircular(14 * snap, snap, total, repeticiones);
      expect(res.necesitaAjuste).toBe(true);
      expect(res.targetOffset).toBe(19 * snap);
      expect(res.indiceReal).toBe(4);
    });

    it('maneja listas de 0 o 1 elemento sin ajustar', () => {
      const res0 = calcularAjusteCircular(0, snap, 0);
      expect(res0.necesitaAjuste).toBe(false);
      const res1 = calcularAjusteCircular(100, snap, 1);
      expect(res1.necesitaAjuste).toBe(false);
    });
  });

  describe('calcularSiguienteIndice', () => {
    it('avanza al siguiente índice cuando no es el último elemento', () => {
      expect(calcularSiguienteIndice(0, 5)).toBe(1);
      expect(calcularSiguienteIndice(1, 5)).toBe(2);
      expect(calcularSiguienteIndice(3, 5)).toBe(4);
    });

    it('vuelve al primer elemento (índice 0) al superar o alcanzar el último elemento', () => {
      expect(calcularSiguienteIndice(4, 5)).toBe(0);
      expect(calcularSiguienteIndice(5, 5)).toBe(0);
    });

    it('retorna 0 de forma segura sin error ante listas de 0 o 1 elemento', () => {
      expect(calcularSiguienteIndice(0, 0)).toBe(0);
      expect(calcularSiguienteIndice(0, 1)).toBe(0);
      expect(calcularSiguienteIndice(1, 1)).toBe(0);
    });
  });
});
