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
    const repeticiones = 51; // Bloque medio = 25 (índices 125..129)

    it('no requiere ajuste si el índice se encuentra dentro del bloque medio', () => {
      // Bloque medio: 125..129
      for (let i = 125; i <= 129; i++) {
        const res = calcularAjusteCircular(i * snap, snap, total, repeticiones);
        expect(res.necesitaAjuste).toBe(false);
        expect(res.targetOffset).toBe(i * snap);
        expect(res.indiceReal).toBe(i - 125);
      }
    });

    it('permite pasar del último al primer evento sin salto ni destello (bloque adyacente)', () => {
      // Índice 130 es el primer elemento del siguiente bloque (vuelta completada)
      // Debe mantener necesitaAjuste en false para que el scroll nativo fluya sin parpadeo
      const res = calcularAjusteCircular(130 * snap, snap, total, repeticiones);
      expect(res.necesitaAjuste).toBe(false);
      expect(res.targetOffset).toBe(130 * snap);
      expect(res.indiceReal).toBe(0);
    });

    it('permite retroceder antes del primer elemento sin salto ni destello (bloque anterior)', () => {
      // Índice 124 es el último elemento del bloque anterior
      const res = calcularAjusteCircular(124 * snap, snap, total, repeticiones);
      expect(res.necesitaAjuste).toBe(false);
      expect(res.targetOffset).toBe(124 * snap);
      expect(res.indiceReal).toBe(4);
    });

    it('reajusta suavemente al bloque medio solo si se alcanzan los extremos del buffer', () => {
      // Extremo inicio (bloque 0, índice 2)
      const resInicio = calcularAjusteCircular(2 * snap, snap, total, repeticiones);
      expect(resInicio.necesitaAjuste).toBe(true);
      expect(resInicio.targetOffset).toBe((25 * total + 2) * snap);
      expect(resInicio.indiceReal).toBe(2);

      // Extremo final (último bloque)
      const resFinal = calcularAjusteCircular((50 * total + 1) * snap, snap, total, repeticiones);
      expect(resFinal.necesitaAjuste).toBe(true);
      expect(resFinal.targetOffset).toBe((25 * total + 1) * snap);
      expect(resFinal.indiceReal).toBe(1);
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
