/**
 * Utilidades puras para el cálculo de navegación e índices del carrusel circular infinito.
 */

export const REPETICIONES_CARRUSEL_DEFAULT = 7;

/**
 * Genera una lista virtual circular multiplicando los elementos originales
 * para permitir un desplazamiento continuo sin bordes ni rebobinadas.
 */
export function obtenerListaCircular<T>(
  elementos: T[],
  repeticiones = REPETICIONES_CARRUSEL_DEFAULT,
): (T & { virtualId: string; realIndex: number })[] {
  if (elementos.length <= 1) {
    return elementos.map((item, idx) => ({
      ...item,
      virtualId: `single-${idx}`,
      realIndex: idx,
    }));
  }

  const resultado: (T & { virtualId: string; realIndex: number })[] = [];
  for (let r = 0; r < repeticiones; r++) {
    for (let i = 0; i < elementos.length; i++) {
      resultado.push({
        ...elementos[i],
        virtualId: `loop-${r}-${i}`,
        realIndex: i,
      });
    }
  }
  return resultado;
}

/**
 * Calcula el índice inicial en el bloque medio de la lista circular.
 */
export function calcularIndiceMedio(
  totalElementos: number,
  repeticiones = REPETICIONES_CARRUSEL_DEFAULT,
): number {
  if (totalElementos <= 1) return 0;
  return Math.floor(repeticiones / 2) * totalElementos;
}

/**
 * Calcula si la posición de scroll actual requiere un recentrado silencioso
 * hacia el bloque medio equivalente, garantizando loop infinito bidireccional.
 */
export function calcularAjusteCircular(
  posicionX: number,
  snapInterval: number,
  totalElementos: number,
  repeticiones = REPETICIONES_CARRUSEL_DEFAULT,
): {
  necesitaAjuste: boolean;
  targetOffset: number;
  indiceReal: number;
} {
  if (totalElementos <= 1 || snapInterval <= 0) {
    return { necesitaAjuste: false, targetOffset: 0, indiceReal: 0 };
  }

  const indiceActual = Math.round(posicionX / snapInterval);
  const indiceReal = ((indiceActual % totalElementos) + totalElementos) % totalElementos;
  const indiceMedioBase = Math.floor(repeticiones / 2) * totalElementos;
  const targetIndice = indiceMedioBase + indiceReal;
  const targetOffset = targetIndice * snapInterval;
  const necesitaAjuste = indiceActual !== targetIndice;

  return {
    necesitaAjuste,
    targetOffset,
    indiceReal,
  };
}

/**
 * Calcula el siguiente índice para la navegación del carrusel.
 */
export function calcularSiguienteIndice(
  indiceActual: number,
  totalElementos: number,
): number {
  if (totalElementos <= 1) return 0;
  if (indiceActual >= totalElementos - 1) return 0;
  return indiceActual + 1;
}
