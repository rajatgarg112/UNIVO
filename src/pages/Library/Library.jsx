import React, { useState, useEffect } from 'react';
import {
  Search, BookOpen, Calendar, MapPin, Hash, Eye,
  BookMarked, RotateCcw, AlertTriangle, X, Library as LibraryIcon
} from 'lucide-react';
import initialLibraryData from '../../data/library.json';
import './Library.css';

const STORAGE_KEY = 'uv_library_books_v1';
const BORROWINGS_KEY = 'uv_library_borrowings_v1';

export default function Library() {
  // ─── BOOKS DATA & PERSISTENCE ──────────────────────────────────────────────
  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10) return parsed;
      }
    } catch (e) {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialLibraryData));
    return initialLibraryData;
  });

  const [borrowings, setBorrowings] = useState(() => {
    try {
      const saved = localStorage.getItem(BORROWINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      // Fallback
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(BORROWINGS_KEY, JSON.stringify(borrowings));
  }, [borrowings]);

  // ─── VIEW, SEARCH & FILTER STATE ──────────────────────────────────────────
  const [activeView, setActiveView] = useState('catalog'); // 'catalog' | 'borrowings'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // ─── MODAL STATE ───────────────────────────────────────────────────────────
  const [selectedBook, setSelectedBook] = useState(null);
  const [confirmBorrowBook, setConfirmBorrowBook] = useState(null);

  // ─── DERIVED VALUES ────────────────────────────────────────────────────────
  const categories = Array.from(new Set(books.map((b) => b.category))).filter(Boolean).sort();

  const totalBooks = books.length;
  const availableBooks = books.filter((b) => b.availableCopies > 0).length;
  const myBorrowedCount = borrowings.filter((br) => !br.returned).length;
  const overdueCount = borrowings.filter((br) => {
    if (br.returned) return false;
    return new Date(br.dueDate) < new Date();
  }).length;

  // ─── FILTERING ─────────────────────────────────────────────────────────────
  const lowerSearch = searchTerm.toLowerCase().trim();

  const filteredBooks = books.filter((b) => {
    const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;

    let matchesStatus = true;
    if (statusFilter === 'available') matchesStatus = b.availableCopies > 0;
    else if (statusFilter === 'unavailable') matchesStatus = b.availableCopies === 0;

    const matchesSearch =
      !lowerSearch ||
      b.title.toLowerCase().includes(lowerSearch) ||
      b.author.toLowerCase().includes(lowerSearch) ||
      b.isbn.toLowerCase().includes(lowerSearch) ||
      b.category.toLowerCase().includes(lowerSearch) ||
      b.publisher.toLowerCase().includes(lowerSearch);

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const activeBorrowings = borrowings.filter((br) => !br.returned);

  // ─── HELPERS ───────────────────────────────────────────────────────────────
  const getBookStatus = (book) => {
    if (book.availableCopies === 0) return 'unavailable';
    if (book.availableCopies <= 1) return 'low-stock';
    return 'available';
  };

  const getBookStatusLabel = (book) => {
    if (book.availableCopies === 0) return 'Unavailable';
    if (book.availableCopies <= 1) return 'Low Stock';
    return 'Available';
  };

  const isBookBorrowedByMe = (bookId) => {
    return borrowings.some((br) => br.bookId === bookId && !br.returned);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  // ─── ACTIONS ───────────────────────────────────────────────────────────────
  const handleBorrow = (book) => {
    if (book.availableCopies <= 0 || isBookBorrowedByMe(book.id)) return;
    setConfirmBorrowBook(book);
  };

  const handleConfirmBorrow = () => {
    if (!confirmBorrowBook) return;

    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 14); // 14-day borrowing period

    const newBorrowing = {
      id: `borrow_${Date.now()}`,
      bookId: confirmBorrowBook.id,
      bookTitle: confirmBorrowBook.title,
      bookAuthor: confirmBorrowBook.author,
      borrowDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      returned: false,
      returnDate: null,
    };

    setBorrowings((prev) => [newBorrowing, ...prev]);
    setBooks((prev) =>
      prev.map((b) =>
        b.id === confirmBorrowBook.id
          ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) }
          : b
      )
    );

    setConfirmBorrowBook(null);
    if (selectedBook && selectedBook.id === confirmBorrowBook.id) {
      setSelectedBook((prev) => ({
        ...prev,
        availableCopies: Math.max(0, prev.availableCopies - 1),
      }));
    }
  };

  const handleReturn = (borrowingId) => {
    const borrowing = borrowings.find((br) => br.id === borrowingId);
    if (!borrowing) return;

    setBorrowings((prev) =>
      prev.map((br) =>
        br.id === borrowingId
          ? { ...br, returned: true, returnDate: new Date().toISOString().split('T')[0] }
          : br
      )
    );

    setBooks((prev) =>
      prev.map((b) =>
        b.id === borrowing.bookId
          ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) }
          : b
      )
    );
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="library-page">
      {/* ── PAGE HEADER ── */}
      <div className="library-page-header">
        <h2 className="library-page-title">Library</h2>
        <p className="library-page-subtitle">
          Browse the university book catalog, borrow books, and manage your active loans
        </p>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="library-stats-grid">
        <div className="library-stat-card">
          <span className="library-stat-lbl">Total Books</span>
          <div className="library-stat-val val-total">{totalBooks}</div>
        </div>
        <div className="library-stat-card">
          <span className="library-stat-lbl">Available Titles</span>
          <div className="library-stat-val val-available">{availableBooks}</div>
        </div>
        <div className="library-stat-card">
          <span className="library-stat-lbl">My Borrowed</span>
          <div className="library-stat-val val-borrowed">{myBorrowedCount}</div>
        </div>
        <div className="library-stat-card">
          <span className="library-stat-lbl">Overdue</span>
          <div className="library-stat-val val-overdue">{overdueCount}</div>
        </div>
      </div>

      {/* ── VIEW TABS ── */}
      <div className="library-view-tabs">
        <button
          className={`library-tab-btn ${activeView === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveView('catalog')}
        >
          <BookOpen size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          Book Catalog
        </button>
        <button
          className={`library-tab-btn ${activeView === 'borrowings' ? 'active' : ''}`}
          onClick={() => setActiveView('borrowings')}
        >
          <BookMarked size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          My Borrowings ({myBorrowedCount})
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── CATALOG VIEW ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeView === 'catalog' && (
        <>
          {/* Toolbar */}
          <div className="library-toolbar">
            <div className="library-search-wrapper">
              <Search size={16} className="library-search-icon" />
              <input
                type="text"
                className="library-search-input"
                placeholder="Search by title, author, ISBN, or publisher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="library-filter-select"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div className="library-status-pills">
              {['all', 'available', 'unavailable'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className="library-pill-btn"
                  style={{
                    background: statusFilter === st ? '#D71920' : 'transparent',
                    color: statusFilter === st ? '#ffffff' : '#94a3b8',
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Book Grid */}
          <div className="library-book-grid">
            {filteredBooks.length === 0 ? (
              <div className="library-empty-box">
                <LibraryIcon size={40} style={{ opacity: 0.4, margin: '0 auto' }} />
                <h3>No books found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              filteredBooks.map((book) => {
                const status = getBookStatus(book);
                const statusLabel = getBookStatusLabel(book);
                const isBorrowed = isBookBorrowedByMe(book.id);

                return (
                  <div key={book.id} className="library-book-card">
                    <div>
                      <div className="book-card-top">
                        <div className="book-card-badges">
                          <span className="book-category-badge">{book.category}</span>
                          <span className={`book-status-badge ${status}`}>{statusLabel}</span>
                        </div>
                        <span className="book-edition-tag">{book.edition} Ed.</span>
                      </div>

                      <h3 className="book-card-title">{book.title}</h3>
                      <p className="book-card-author">{book.author}</p>
                      <p className="book-card-desc">{book.description}</p>
                    </div>

                    <div>
                      <div className="book-card-meta">
                        <span>
                          <MapPin size={13} /> {book.shelfLocation}
                        </span>
                        <span>
                          <Hash size={13} /> {book.availableCopies}/{book.totalCopies} copies
                        </span>
                      </div>

                      <div className="book-card-actions">
                        <button
                          className="book-borrow-btn"
                          onClick={() => handleBorrow(book)}
                          disabled={book.availableCopies === 0 || isBorrowed}
                        >
                          <BookMarked size={14} />
                          {isBorrowed ? 'Already Borrowed' : book.availableCopies === 0 ? 'Unavailable' : 'Borrow'}
                        </button>
                        <button
                          className="book-details-btn"
                          onClick={() => setSelectedBook(book)}
                        >
                          <Eye size={14} /> Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── MY BORROWINGS VIEW ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeView === 'borrowings' && (
        <div className="borrowings-list">
          {activeBorrowings.length === 0 ? (
            <div className="library-empty-box">
              <BookMarked size={40} style={{ opacity: 0.4, margin: '0 auto' }} />
              <h3>No active borrowings</h3>
              <p>Browse the catalog and borrow books to see them here.</p>
            </div>
          ) : (
            activeBorrowings.map((br) => {
              const overdue = isOverdue(br.dueDate);
              return (
                <div key={br.id} className="borrowing-item">
                  <div className="borrowing-info">
                    <h4 className="borrowing-title">{br.bookTitle}</h4>
                    <p className="borrowing-author">{br.bookAuthor}</p>
                    <div className="borrowing-dates">
                      <span>
                        <Calendar size={13} /> Borrowed: {formatDate(br.borrowDate)}
                      </span>
                      <span className={overdue ? 'borrowing-date-overdue' : 'borrowing-date-due'}>
                        <AlertTriangle size={13} /> Due: {formatDate(br.dueDate)}
                        {overdue && ' (Overdue)'}
                      </span>
                    </div>
                  </div>

                  <div className="borrowing-actions">
                    {overdue && (
                      <span className="borrowing-overdue-badge">Overdue</span>
                    )}
                    <button
                      className="borrowing-return-btn"
                      onClick={() => handleReturn(br.id)}
                    >
                      <RotateCcw size={14} /> Return Book
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── BOOK DETAILS MODAL ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {selectedBook && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedBook(null); }}
        >
          <div
            style={{
              background: '#0B1220',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '0',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '88vh',
              overflowY: 'auto',
              boxShadow: '0 24px 48px rgba(0,0,0,0.35)',
              animation: 'fadeIn 0.22s ease',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '20px 24px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <div className="book-card-badges" style={{ marginBottom: '8px' }}>
                  <span className="book-category-badge">{selectedBook.category}</span>
                  <span className={`book-status-badge ${getBookStatus(selectedBook)}`}>
                    {getBookStatusLabel(selectedBook)}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#f8fafc',
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {selectedBook.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBook(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  flexShrink: 0,
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 24px' }}>
              <div className="book-detail-section">
                <p className="book-detail-label">Author</p>
                <p className="book-detail-value">{selectedBook.author}</p>
              </div>

              <div className="book-detail-section">
                <p className="book-detail-label">Description</p>
                <p className="book-detail-desc">{selectedBook.description}</p>
              </div>

              <div className="book-detail-grid" style={{ marginBottom: '16px' }}>
                <div className="book-detail-section">
                  <p className="book-detail-label">Publisher</p>
                  <p className="book-detail-value">{selectedBook.publisher}</p>
                </div>
                <div className="book-detail-section">
                  <p className="book-detail-label">Year</p>
                  <p className="book-detail-value">{selectedBook.year}</p>
                </div>
                <div className="book-detail-section">
                  <p className="book-detail-label">Edition</p>
                  <p className="book-detail-value">{selectedBook.edition}</p>
                </div>
                <div className="book-detail-section">
                  <p className="book-detail-label">ISBN</p>
                  <p className="book-detail-value">{selectedBook.isbn}</p>
                </div>
                <div className="book-detail-section">
                  <p className="book-detail-label">Shelf Location</p>
                  <p className="book-detail-value">{selectedBook.shelfLocation}</p>
                </div>
                <div className="book-detail-section">
                  <p className="book-detail-label">Copies</p>
                  <p className="book-detail-value">
                    {selectedBook.availableCopies} / {selectedBook.totalCopies} available
                  </p>
                </div>
              </div>

              <div
                className={`book-detail-availability ${
                  selectedBook.availableCopies > 0 ? 'in-stock' : 'out-of-stock'
                }`}
              >
                {selectedBook.availableCopies > 0 ? (
                  <>
                    <BookOpen size={16} />
                    {selectedBook.availableCopies} {selectedBook.availableCopies === 1 ? 'copy' : 'copies'} available for borrowing
                  </>
                ) : (
                  <>
                    <AlertTriangle size={16} />
                    All copies are currently borrowed
                  </>
                )}
              </div>

              <div className="book-detail-footer">
                <button
                  className="book-detail-close-btn"
                  onClick={() => setSelectedBook(null)}
                >
                  Close
                </button>
                <button
                  className="book-detail-borrow-btn"
                  onClick={() => {
                    handleBorrow(selectedBook);
                  }}
                  disabled={selectedBook.availableCopies === 0 || isBookBorrowedByMe(selectedBook.id)}
                >
                  <BookMarked size={14} />
                  {isBookBorrowedByMe(selectedBook.id)
                    ? 'Already Borrowed'
                    : selectedBook.availableCopies === 0
                    ? 'Unavailable'
                    : 'Borrow This Book'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── BORROW CONFIRMATION MODAL ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {confirmBorrowBook && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1010,
            padding: '20px',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmBorrowBook(null); }}
        >
          <div
            style={{
              background: '#0B1220',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              animation: 'fadeIn 0.22s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Confirm Borrowing
              </h3>
              <button
                onClick={() => setConfirmBorrowBook(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '16px',
            }}>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: '0 0 4px' }}>
                {confirmBorrowBook.title}
              </p>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                {confirmBorrowBook.author}
              </p>
            </div>

            <div style={{
              background: 'rgba(215, 25, 32, 0.1)',
              border: '1px solid rgba(215, 25, 32, 0.2)',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#D71920',
              lineHeight: 1.5,
            }}>
              <strong>Loan Period:</strong> 14 days from today<br />
              <strong>Due Date:</strong> {formatDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setConfirmBorrowBook(null)}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  color: '#94a3b8',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBorrow}
                style={{
                  padding: '8px 22px',
                  background: 'linear-gradient(135deg, #D71920, #E8333A)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <BookMarked size={14} /> Confirm Borrow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
