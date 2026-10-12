/**
 * Normaliza la fuente de imagen para expo-image en Web y plataformas nativas (iOS/Android).
 *
 * En plataformas nativas, require(...) devuelve un número (asset ID).
 * En Web (Metro Web), require(...) devuelve un objeto { uri: string, ... }.
 * Las URLs remotas son strings (ej. 'https://...').
 *
 * Esta función asegura que las URLs remotas se pasen como { uri: string } y
 * que los assets locales requeridos se pasen directamente sin doble anidación.
 */
export function resolveFlyerSource(source: unknown) {
  if (typeof source === 'string') {
    return { uri: source };
  }
  return source as number;
}

