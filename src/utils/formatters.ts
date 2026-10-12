/**
 * Formateador de moneda institucional para Argentina (ARS).
 *
 * Reutiliza una única instancia de Intl.NumberFormat para evitar
 * el costo de inicialización recurrente en cada ciclo de renderizado.
 * Adapta el formato a "$ 10.000" según la referencia visual de PassLP.
 */
const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount).replace('ARS', '$').trim();
}
