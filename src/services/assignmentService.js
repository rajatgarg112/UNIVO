import { seedStoreIfEmpty, getAll, saveItem, deleteItem } from '../utils/db';
import initialAssignments from '../data/assignments.json';

const STORE = 'assignments';

export async function getAssignments() {
  return await seedStoreIfEmpty(STORE, initialAssignments);
}

export async function addAssignment(assignment) {
  const newAssignment = {
    id: Date.now().toString(),
    status: 'pending',
    grade: null,
    marks: null,
    submittedDate: null,
    attachments: [],
    ...assignment
  };
  return await saveItem(STORE, newAssignment);
}

export async function updateAssignmentStatus(id, status, submittedDate = new Date().toISOString().split('T')[0]) {
  const all = await getAll(STORE);
  const target = all.find((item) => item.id === id);
  if (target) {
    target.status = status;
    if (status === 'submitted') {
      target.submittedDate = submittedDate;
    }
    return await saveItem(STORE, target);
  }
}

export async function removeAssignment(id) {
  return await deleteItem(STORE, id);
}
