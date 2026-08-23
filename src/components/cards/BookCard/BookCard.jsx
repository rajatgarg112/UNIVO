import React from 'react';
import { Star, BookOpen, User } from 'lucide-react';
import Badge from '../../ui/Badge/Badge';
import './BookCard.css';

const CATEGORY_VARIANTS = {
  Fiction: 'purple',
  Science: 'info',
  Technology: 'info',
  History: 'warning',
  Mathematics: 'success',
  Literature: 'purple',
  Reference: 'default',
};

const StarRating = ({ rating = 0 }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={12}
        fill={star <= Math.round(rating) ? '#f59e0b' : 'none'}
        color={star <= Math.round(rating) ? '#f59e0b' : '#334155'}
      />
    ))}
    <span className="star-value">{rating.toFixed(1)}</span>
  </div>
);

const BookCard = ({ book = {}, onBorrow, onView, viewMode = 'grid' }) => {
  const {
    title = 'Book Title',
    author = 'Unknown Author',
    category = 'Reference',
    available = true,
    totalCopies = 1,
    availableCopies = 1,
    rating = 0,
    color = '#6366f1',
    isbn,
  } = book;

  const badgeVariant = CATEGORY_VARIANTS[category] || 'default';

  if (viewMode === 'list') {
    return (
      <div className="book-card book-card-list">
        <div className="book-spine" style={{ background: color }}></div>
        <div className="book-cover-sm" style={{ background: `linear-gradient(160deg, ${color}cc, ${color}55)` }}>
          <BookOpen size={18} color="white" />
        </div>
        <div className="book-info">
          <div className="book-info-left">
            <h3 className="book-title">{title}</h3>
            <div className="book-author">
              <User size={12} />
              <span>{author}</span>
            </div>
          </div>
          <div className="book-info-right">
            <Badge variant={badgeVariant} size="sm">{category}</Badge>
            <StarRating rating={rating} />
          </div>
          <div className="book-availability">
            <span className={`availability-dot ${available ? 'available' : 'unavailable'}`}></span>
            <span className="availability-text">
              {available ? `${availableCopies}/${totalCopies} available` : 'All copies borrowed'}
            </span>
          </div>
        </div>
        <div className="book-actions">
          {onView && (
            <button className="book-btn book-btn-secondary" onClick={() => onView(book)}>
              View
            </button>
          )}
          <button
            className="book-btn book-btn-primary"
            style={{ '--book-color': color }}
            onClick={() => onBorrow && onBorrow(book)}
            disabled={!available}
          >
            {available ? 'Borrow' : 'Waitlist'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-card book-card-grid">
      <div className="book-cover" style={{ background: `linear-gradient(160deg, ${color}dd, ${color}66)` }}>
        <div className="book-spine-vertical" style={{ background: color }}></div>
        <BookOpen size={28} color="white" />
        <div className="book-cover-badge">
          <Badge variant={badgeVariant} size="sm">{category}</Badge>
        </div>
      </div>
      <div className="book-card-body">
        <h3 className="book-title">{title}</h3>
        <div className="book-author">
          <User size={12} />
          <span>{author}</span>
        </div>
        <StarRating rating={rating} />
        <div className="book-footer">
          <div className="book-availability">
            <span className={`availability-dot ${available ? 'available' : 'unavailable'}`}></span>
            <span className="availability-text">
              {available ? `${availableCopies} available` : 'Unavailable'}
            </span>
          </div>
          <div className="book-actions">
            {onView && (
              <button className="book-btn book-btn-secondary" onClick={() => onView(book)}>
                View
              </button>
            )}
            <button
              className="book-btn book-btn-primary"
              style={{ '--book-color': color }}
              onClick={() => onBorrow && onBorrow(book)}
              disabled={!available}
            >
              {available ? 'Borrow' : 'Wait'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
