import { seedStoreIfEmpty, getAll, saveItem } from '../utils/db';
import initialEvents from '../data/events.json';

const STORE = 'events';

export async function getEvents() {
  return await seedStoreIfEmpty(STORE, initialEvents);
}

export async function toggleEventRegistration(id) {
  const all = await getAll(STORE);
  const target = all.find((ev) => ev.id === id);
  if (target) {
    target.isRegistered = !target.isRegistered;
    if (target.isRegistered) {
      target.currentParticipants += 1;
    } else {
      target.currentParticipants = Math.max(0, target.currentParticipants - 1);
    }
    return await saveItem(STORE, target);
  }
}
