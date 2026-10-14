import { eventsService } from '../services/eventsService';

describe('eventsService', () => {
  describe('getEvents con búsqueda y categorías', () => {
    it('retorna todos los eventos cuando no se pasa búsqueda ni categoría', async () => {
      const allEvents = await eventsService.getEvents();
      expect(allEvents.length).toBeGreaterThan(0);
    });

    it('retorna todos los eventos cuando la categoría es "Todas"', async () => {
      const allEvents = await eventsService.getEvents('Todas');
      expect(allEvents.length).toBeGreaterThan(0);
    });

    it('filtra correctamente por categoría específica', async () => {
      const fiestaEvents = await eventsService.getEvents('Fiestas');
      expect(fiestaEvents.length).toBeGreaterThan(0);
      expect(fiestaEvents.every((e) => e.category === 'Fiestas')).toBe(true);
    });

    it('filtra por término de búsqueda en el título insensible a mayúsculas', async () => {
      const results = await eventsService.getEvents(undefined, 'armyfest');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((e) => e.title.toLowerCase().includes('armyfest'))).toBe(true);
    });

    it('filtra por término de búsqueda que coincide con la ciudad o recinto', async () => {
      const results = await eventsService.getEvents(undefined, 'la plata');
      expect(results.length).toBeGreaterThan(0);
      expect(
        results.every(
          (e) =>
            e.venue.city.toLowerCase().includes('la plata') ||
            e.venue.name.toLowerCase().includes('la plata') ||
            e.title.toLowerCase().includes('la plata')
        )
      ).toBe(true);
    });

    it('retorna array vacío si el término de búsqueda no coincide con ningún evento', async () => {
      const results = await eventsService.getEvents(undefined, 'termino_inexistente_xyz_123');
      expect(results).toEqual([]);
    });

    it('retorna la lista completa si el texto de búsqueda es una cadena vacía o solo espacios', async () => {
      const all = await eventsService.getEvents();
      const emptySearch = await eventsService.getEvents(undefined, '   ');
      expect(emptySearch.length).toBe(all.length);
    });
  });

  describe('getFeaturedEvents', () => {
    it('retorna únicamente eventos con isFeatured true', async () => {
      const featured = await eventsService.getFeaturedEvents();
      expect(featured.length).toBeGreaterThan(0);
      expect(featured.every((e) => e.isFeatured)).toBe(true);
    });
  });
});
