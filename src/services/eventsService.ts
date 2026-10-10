import { EVENT_CATEGORIES, MOCK_EVENTS } from '../data/mockEvents';
import { EventCategory, EventItem } from '../types';

const SIMULATED_DELAY_MS = 100;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const eventsService = {
  async getEvents(category?: EventCategory, searchQuery?: string): Promise<EventItem[]> {
    await wait(SIMULATED_DELAY_MS);
    let results = [...MOCK_EVENTS];

    if (category && category !== 'Todas') {
      results = results.filter((event) => event.category === category);
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      const query = searchQuery.trim().toLowerCase();
      results = results.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.venue.name.toLowerCase().includes(query) ||
          event.venue.city.toLowerCase().includes(query) ||
          event.category.toLowerCase().includes(query)
      );
    }

    return results;
  },

  async getFeaturedEvents(): Promise<EventItem[]> {
    await wait(SIMULATED_DELAY_MS);
    return MOCK_EVENTS.filter((event) => event.isFeatured);
  },

  async getEventById(id: string): Promise<EventItem | undefined> {
    await wait(SIMULATED_DELAY_MS);
    return MOCK_EVENTS.find((event) => event.id === id);
  },

  async getCategories(): Promise<EventCategory[]> {
    await wait(SIMULATED_DELAY_MS);
    return EVENT_CATEGORIES;
  },
};
