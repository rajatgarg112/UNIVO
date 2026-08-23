import { seedStoreIfEmpty, getAll, saveItem, deleteItem } from '../utils/db';
import initialLostFound from '../data/lostFound.json';

const STORE = 'lostFoundItems';

export async function getLostFoundItems() {
  return await seedStoreIfEmpty(STORE, initialLostFound);
}

export async function addLostFoundItem(item) {
  const newItem = {
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    status: 'Unclaimed',
    ...item
  };
  return await saveItem(STORE, newItem);
}

export async function toggleItemStatus(id) {
  const all = await getAll(STORE);
  const target = all.find((item) => item.id === id);
  if (target) {
    target.status = target.status === 'Unclaimed' ? 'Claimed' : 'Unclaimed';
    return await saveItem(STORE, target);
  }
}

export async function removeLostFoundItem(id) {
  return await deleteItem(STORE, id);
}
