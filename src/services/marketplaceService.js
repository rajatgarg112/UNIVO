import { seedStoreIfEmpty, getAll, saveItem, deleteItem } from '../utils/db';
import initialItems from '../data/marketplace.json';

const STORE = 'marketplaceItems';

export async function getMarketplaceItems() {
  return await seedStoreIfEmpty(STORE, initialItems);
}

export async function addMarketplaceItem(item) {
  const newItem = {
    id: Date.now().toString(),
    postedDate: new Date().toISOString().split('T')[0],
    isAvailable: true,
    images: [],
    ...item
  };
  return await saveItem(STORE, newItem);
}

export async function removeMarketplaceItem(id) {
  return await deleteItem(STORE, id);
}
