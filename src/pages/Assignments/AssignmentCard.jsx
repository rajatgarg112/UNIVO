import React from 'react';
import { CheckCircle, Clock, Award, AlertCircle } from 'lucide-react';

export default function AssignmentCard({ assignment, onViewDetails, onStatusToggle }) {
  const {
    id,
    title,
    subject,
    subjectCode,
    faculty,
    dueDate,
    status,
    grade,
    marks,
    totalMarks,
    description,
    priority,
    type
  } = assignment;

  // Check if the assignment is overdue and still pending
  const today = new Date().toISOString().split('T')[0];
  const isLate = status === 'pending' && dueDate < today;

  // Map priority to theme color
  const priorityColor =
    priority === 'high' ? '#ef4444' :
    priority === 'medium' ? '#f59e0b' : '#10b981';

  return (
    <div className="assignment-item">

      {/* ── ROW 1: Subject badge & Status badge ── */}
      <div className="assignment-header-row">
        <span className="subject-badge">
          {subject}&nbsp;
          <span style={{ opacity: 0.7, fontSize: '10px' }}>({subjectCode})</span>
        </span>

        {isLate ? (
          <span className="status-badge late status-late-badge">
            <AlertCircle size={11} /> LATE
          </span>
        ) : (
          <span className={`status-badge ${status}`}>
            {status.toUpperCase()}
          </span>
        )}
      </div>

      {/* ── ROW 2: Title ── */}
      <h4 className="assignment-title">{title}</h4>

      {/* ── ROW 3: Short Description (max 2 lines) ── */}
      <p
        className="assignment-desc"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {description}
      </p>

      {/* ── ROW 4: Metadata & Action Buttons ── */}
      <div className="assignment-footer-row">

        {/* Left Side: Metadata Labels */}
        <div className="assignment-meta-left">
          <span>Faculty: <strong className="meta-strong-text">{faculty}</strong></span>
          <span>•</span>
          <span>
            Due:{' '}
            <strong
              className="meta-due-text"
              style={{ color: isLate ? '#ef4444' : '#D71920' }}
            >
              {dueDate}
            </strong>
          </span>
          <span>•</span>
          <span style={{ textTransform: 'capitalize' }}>
            Type: <strong className="meta-strong-text">{type}</strong>
          </span>
          <span>•</span>
          <span style={{ textTransform: 'capitalize' }}>
            Priority: <strong style={{ color: priorityColor }}>{priority}</strong>
          </span>

          {marks !== null && marks !== undefined && (
            <>
              <span>•</span>
              <span>
                Score: <strong className="meta-marks-text">{marks} / {totalMarks || 100}</strong>
              </span>
            </>
          )}
        </div>

        {/* Right Side: Action Buttons */}
        <div className="card-actions-group">
          <button
            className="btn-view-details"
            onClick={() => onViewDetails(assignment)}
          >
            View Details
          </button>

          <button
            onClick={() => onStatusToggle(id, status, assignment)}
            className={`btn-toggle-status ${status}-btn`}
            disabled={status === 'graded'}
            style={{ cursor: status === 'graded' ? 'not-allowed' : 'pointer' }}
          >
            {status === 'pending' && isLate && <><AlertCircle size={14} /> Submit Late</>}
            {status === 'pending' && !isLate && <><CheckCircle size={14} /> Submit Work</>}
            {status === 'submitted' && <><Clock size={14} /> Unsubmit</>}
            {status === 'graded' && <><Award size={14} /> Graded ({grade || 'A'})</>}
          </button>
        </div>

      </div>

    </div>
  );
}
