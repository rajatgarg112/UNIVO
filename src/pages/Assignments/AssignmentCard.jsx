import React from 'react';
import { CheckCircle, Clock, Award, AlertCircle } from 'lucide-react';

// AssignmentCard is a reusable functional component.
// It receives one assignment object as a prop, plus two callback functions.
//
// Props:
//   assignment     - the full assignment data object from assignments.json
//   onViewDetails  - function called when the student clicks "View Details"
//   onStatusToggle - function called when the student clicks Submit / Unsubmit
export default function AssignmentCard({ assignment, onViewDetails, onStatusToggle }) {

  // Destructure every field we need from the assignment prop
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

  // --- LATE CHECK ---
  // An assignment is "late" if it is still pending AND the due date has already passed.
  // Comparing YYYY-MM-DD strings works correctly because they are lexicographically ordered.
  const today = new Date().toISOString().split('T')[0];
  const isLate = status === 'pending' && dueDate < today;

  // --- PRIORITY COLOUR ---
  // Map the priority level to a colour that matches the design system.
  const priorityColor =
    priority === 'high'   ? '#ef4444' :   // red
    priority === 'medium' ? '#f59e0b' :   // amber
                            '#10b981';    // green for low

  return (
    <div className="assignment-item">

      {/* ── ROW 1: Subject chip (left)  +  Status badge (right) ── */}
      <div className="assignment-header-row">

        <span className="subject-badge">
          {subject}&nbsp;
          <span style={{ opacity: 0.7, fontSize: '10px' }}>({subjectCode})</span>
        </span>

        {/* Show LATE badge when the due date has already passed, otherwise show normal status */}
        {isLate ? (
          <span className="status-badge late" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={11} /> LATE
          </span>
        ) : (
          <span className={`status-badge ${status}`}>
            {status.toUpperCase()}
          </span>
        )}

      </div>

      {/* ── ROW 2: Assignment title ── */}
      <h4 className="assignment-title">{title}</h4>

      {/* ── ROW 3: Short description, capped at 2 lines ── */}
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

      {/* ── ROW 4: Metadata (left)  +  Action buttons (right) ── */}
      <div className="assignment-footer-row">

        {/* Left side — key metadata shown as small inline labels */}
        <div className="assignment-meta-left">

          <span>Faculty: <strong className="meta-strong-text">{faculty}</strong></span>
          <span>•</span>
          <span>
            Due:{' '}
            <strong
              className="meta-due-text"
              style={{ color: isLate ? '#ef4444' : 'var(--uv-primary)' }}
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

          {/* Score is only shown after the assignment has been graded */}
          {marks !== null && marks !== undefined && (
            <>
              <span>•</span>
              <span>
                Score: <strong className="meta-marks-text">{marks} / {totalMarks || 100}</strong>
              </span>
            </>
          )}

        </div>

        {/* Right side — action buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

          {/* View Details button — always visible regardless of status */}
          <button
            className="btn-view-details"
            onClick={() => onViewDetails(assignment)}
          >
            View Details
          </button>

          {/* Submit / Unsubmit / Graded — disabled once the assignment is graded */}
          <button
            onClick={() => onStatusToggle(id, status, assignment)}
            className={`btn-toggle-status ${status}-btn`}
            disabled={status === 'graded'}
            style={{ cursor: status === 'graded' ? 'not-allowed' : 'pointer' }}
          >
            {status === 'pending' && isLate && <><AlertCircle size={14} /> Submit Late</>}
            {status === 'pending' && !isLate  && <><CheckCircle size={14} /> Submit Work</>}
            {status === 'submitted'           && <><Clock size={14} /> Unsubmit</>}
            {status === 'graded'              && <><Award size={14} /> Graded ({grade || 'A'})</>}
          </button>

        </div>
      </div>

    </div>
  );
}
