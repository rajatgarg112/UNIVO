/**
 * libraryService.js – Frontend-only library data service for UniversityVerse
 * Manages books, borrowed books, and availability using localStorage.
 */

import { getItem, setItem } from '../utils/storageUtils';

// ─── Mock Book Data ───────────────────────────────────────────────────────────

const MOCK_BOOKS = [
  { id: 'BK001', title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest, Stein', category: 'Computer Science', isbn: '978-0262033848', publisher: 'MIT Press', year: 2009, edition: '3rd', available: 3, total: 5, popularity: 98, coverColor: '#6366f1', description: 'The classic textbook on algorithms, covering a broad range of algorithms in depth.' },
  { id: 'BK002', title: 'The Pragmatic Programmer', author: 'Andrew Hunt, David Thomas', category: 'Computer Science', isbn: '978-0135957059', publisher: 'Addison-Wesley', year: 2019, edition: '20th Anniversary', available: 2, total: 4, popularity: 94, coverColor: '#10b981', description: 'Tips and best practices for writing clean, maintainable code.' },
  { id: 'BK003', title: 'Computer Networks', author: 'Andrew S. Tanenbaum', category: 'Computer Science', isbn: '978-0132126953', publisher: 'Pearson', year: 2010, edition: '5th', available: 1, total: 3, popularity: 91, coverColor: '#f59e0b', description: 'A comprehensive textbook on computer networking concepts and protocols.' },
  { id: 'BK004', title: 'Database System Concepts', author: 'Silberschatz, Korth, Sudarshan', category: 'Computer Science', isbn: '978-0078022159', publisher: 'McGraw-Hill', year: 2010, edition: '6th', available: 4, total: 6, popularity: 89, coverColor: '#ef4444', description: 'Comprehensive coverage of database system design and management.' },
  { id: 'BK005', title: 'Operating System Concepts', author: 'Silberschatz, Galvin, Gagne', category: 'Computer Science', isbn: '978-1118063330', publisher: 'Wiley', year: 2018, edition: '10th', available: 0, total: 4, popularity: 95, coverColor: '#8b5cf6', description: 'Known as the "Dinosaur Book", the definitive OS textbook.' },
  { id: 'BK006', title: 'Clean Code', author: 'Robert C. Martin', category: 'Computer Science', isbn: '978-0132350884', publisher: 'Prentice Hall', year: 2008, edition: '1st', available: 3, total: 5, popularity: 97, coverColor: '#3b82f6', description: 'A handbook of agile software craftsmanship for writing clean, readable code.' },
  { id: 'BK007', title: 'Signals and Systems', author: 'Alan V. Oppenheim', category: 'Electronics', isbn: '978-0138147570', publisher: 'Prentice Hall', year: 1997, edition: '2nd', available: 2, total: 3, popularity: 82, coverColor: '#ec4899', description: 'Foundational text for understanding signals and system analysis.' },
  { id: 'BK008', title: 'Engineering Mathematics', author: 'B.S. Grewal', category: 'Mathematics', isbn: '978-8174091955', publisher: 'Khanna Publishers', year: 2021, edition: '44th', available: 6, total: 10, popularity: 96, coverColor: '#14b8a6', description: 'Widely used mathematics textbook for engineering students across India.' },
  { id: 'BK009', title: 'Machine Learning: A Probabilistic Perspective', author: 'Kevin P. Murphy', category: 'Computer Science', isbn: '978-0262018029', publisher: 'MIT Press', year: 2012, edition: '1st', available: 1, total: 2, popularity: 88, coverColor: '#f97316', description: 'An introduction to machine learning using a unified probabilistic approach.' },
  { id: 'BK010', title: 'Design Patterns', author: 'Gang of Four', category: 'Computer Science', isbn: '978-0201633610', publisher: 'Addison-Wesley', year: 1994, edition: '1st', available: 2, total: 3, popularity: 93, coverColor: '#84cc16', description: 'The seminal book on software design patterns.' },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function getBookStore() {
  return getItem('uv_library_books', MOCK_BOOKS);
}

function saveBookStore(books) {
  setItem('uv_library_books', books);
}

function getBorrowedStore(studentId) {
  return getItem(`uv_borrowed_${studentId}`, []);
}

function saveBorrowedStore(studentId, borrowed) {
  setItem(`uv_borrowed_${studentId}`, borrowed);
}

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * searchBooks(query) → filtered books array
 */
export function searchBooks(query) {
  const books = getBookStore();
  if (!query || query.trim() === '') return books;
  const q = query.toLowerCase().trim();
  return books.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.isbn.includes(q)
  );
}

/**
 * getBooksByCategory(category) → filtered books
 */
export function getBooksByCategory(category) {
  const books = getBookStore();
  if (!category || category === 'All') return books;
  return books.filter(
    (b) => b.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * getBorrowedBooks(studentId) → borrowed books with due dates
 */
export function getBorrowedBooks(studentId) {
  const borrowed = getBorrowedStore(studentId);
  const books = getBookStore();
  return borrowed.map((entry) => {
    const book = books.find((b) => b.id === entry.bookId) || {};
    return { ...book, ...entry };
  });
}

/**
 * getPopularBooks() → top 5 books sorted by popularity
 */
export function getPopularBooks() {
  const books = getBookStore();
  return [...books]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5);
}

/**
 * borrowBook(bookId, studentId) → { success, message }
 */
export function borrowBook(bookId, studentId) {
  const books = getBookStore();
  const idx = books.findIndex((b) => b.id === bookId);
  if (idx === -1) return { success: false, message: 'Book not found.' };
  if (books[idx].available === 0) {
    return { success: false, message: 'No copies available.' };
  }

  // Check if already borrowed by student
  const borrowed = getBorrowedStore(studentId);
  const alreadyBorrowed = borrowed.find((b) => b.bookId === bookId);
  if (alreadyBorrowed) {
    return { success: false, message: 'You have already borrowed this book.' };
  }

  // Reduce availability
  books[idx] = { ...books[idx], available: books[idx].available - 1 };
  saveBookStore(books);

  // Add to borrowed list with due date (14 days from now)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  const newEntry = {
    bookId,
    borrowedDate: new Date().toISOString(),
    dueDate: dueDate.toISOString(),
    status: 'borrowed',
  };
  saveBorrowedStore(studentId, [...borrowed, newEntry]);

  return { success: true, message: 'Book borrowed successfully.' };
}

/**
 * returnBook(bookId, studentId) → { success, message }
 */
export function returnBook(bookId, studentId) {
  const books = getBookStore();
  const idx = books.findIndex((b) => b.id === bookId);
  if (idx === -1) return { success: false, message: 'Book not found.' };

  const borrowed = getBorrowedStore(studentId);
  const entryIdx = borrowed.findIndex((b) => b.bookId === bookId);
  if (entryIdx === -1) {
    return { success: false, message: 'You have not borrowed this book.' };
  }

  // Increase availability
  books[idx] = { ...books[idx], available: Math.min(books[idx].available + 1, books[idx].total) };
  saveBookStore(books);

  // Remove from borrowed list
  const updatedBorrowed = borrowed.filter((b) => b.bookId !== bookId);
  saveBorrowedStore(studentId, updatedBorrowed);

  return { success: true, message: 'Book returned successfully.' };
}
