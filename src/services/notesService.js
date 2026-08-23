import initialNotes from '../data/notes.json';

const STORAGE_KEY = 'uv_notes_data';

export function getNotes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotes));
    return initialNotes;
  }
  return JSON.parse(saved);
}

export function addNote(note) {
  const current = getNotes();
  const newNote = {
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    downloadCount: 0,
    ...note
  };
  const updated = [newNote, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function incrementDownloadCount(id) {
  const current = getNotes();
  const updated = current.map((n) => {
    if (n.id === id) {
      return { ...n, downloadCount: (n.downloadCount || 0) + 1 };
    }
    return n;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
