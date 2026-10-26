import React, { useState, useEffect } from 'react';
import { AlertCircle, Award, CheckCircle, Clock, Paperclip, Search, X } from 'lucide-react';
import initialAssignmentsData from '../../data/assignments.json';
import './Assignments.css';

const STORAGE_KEY = 'uv_assignments_local_v1';

// ─── HELPER COMPONENT 1: ASSIGNMENT CARD ──────────────────────────────────────
function AssignmentCard({ assignment, onViewDetails, onStatusToggle }) {
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

  const today = new Date().toISOString().split('T')[0];
  const isLate = status === 'pending' && dueDate < today;

  let priorityColor = '#10b981';
  if (priority === 'high') priorityColor = '#ef4444';
  if (priority === 'medium') priorityColor = '#f59e0b';

  return (
    <div className="assignment-item">
      {/* Subject and Status badges */}
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

      {/* Assignment Title */}
      <h4 className="assignment-title">{title}</h4>

      {/* Assignment Description */}
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

      {/* Footer details and action buttons */}
      <div className="assignment-footer-row">
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

// ─── HELPER COMPONENT 2: ASSIGNMENT DETAILS MODAL ────────────────────────────
function AssignmentDetailsModal({ assignment, onClose }) {
  if (!assignment) return null;

  let priorityClass = 'modal-priority-low';
  if (assignment.priority === 'high') priorityClass = 'modal-priority-high';
  if (assignment.priority === 'medium') priorityClass = 'modal-priority-medium';

  const instructionsText = assignment.instructions ||
    'No specific instructions provided. Follow standard submission guidelines.';

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <span className="subject-badge modal-subject-tag">
              {assignment.subject}
              {assignment.subjectCode && (
                <span className="modal-subject-code"> ({assignment.subjectCode})</span>
              )}
            </span>
            <h3 className="modal-title">{assignment.title}</h3>
          </div>

          <button className="modal-close-btn" onClick={onClose} aria-label="Close details">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="modal-section">
            <span className="modal-label">Description</span>
            <p className="modal-text">{assignment.description}</p>
          </div>

          <div className="modal-section modal-instructions-box">
            <span className="modal-label modal-instructions-lbl">Instructions</span>
            <p className="modal-text modal-instructions-text">{instructionsText}</p>
          </div>

          <div className="modal-grid-2">
            <div className="modal-meta-item">
              <span className="modal-label">Faculty</span>
              <span className="modal-value">{assignment.faculty}</span>
            </div>
            <div className="modal-meta-item">
              <span className="modal-label">Due Date</span>
              <span className="modal-value modal-meta-due">{assignment.dueDate}</span>
            </div>
            <div className="modal-meta-item">
              <span className="modal-label">Type</span>
              <span className="modal-value" style={{ textTransform: 'capitalize' }}>
                {assignment.type}
              </span>
            </div>
            <div className="modal-meta-item">
              <span className="modal-label">Total Marks</span>
              <span className="modal-value">{assignment.totalMarks || 100}</span>
            </div>
            <div className="modal-meta-item">
              <span className="modal-label">Priority</span>
              <span className={`modal-value modal-priority-value ${priorityClass}`}>
                {assignment.priority}
              </span>
            </div>
            <div className="modal-meta-item">
              <span className="modal-label">Status</span>
              <span className={`status-badge ${assignment.status}`}>
                {assignment.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Attachments */}
          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="modal-section">
              <span className="modal-label">Reference Attachments</span>
              <div className="modal-attachments-list">
                {assignment.attachments.map((file, index) => (
                  <a
                    key={index}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Downloading: ' + file);
                    }}
                    className="attachment-chip"
                  >
                    <Paperclip size={13} /> {file}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Submission Info */}
          {(assignment.status === 'submitted' || assignment.status === 'graded') && (
            <div className="modal-section modal-section-bordered">
              <span className="modal-label">Your Submission</span>
              <div className="modal-grid-2 modal-sub-grid">
                {assignment.submittedDate && (
                  <div className="modal-meta-item">
                    <span className="modal-label">Submitted On</span>
                    <span className="modal-value">{assignment.submittedDate}</span>
                  </div>
                )}
                {assignment.submitAttachmentName && (
                  <div className="modal-meta-item">
                    <span className="modal-label">Submitted File</span>
                    <span className="modal-value modal-sub-file">
                      <Paperclip size={12} /> {assignment.submitAttachmentName}
                    </span>
                  </div>
                )}
              </div>
              {assignment.submitNotes && (
                <div className="modal-sub-notes-box">
                  <span className="modal-label">Submission Notes / Link</span>
                  <div className="modal-sub-notes-content">
                    "{assignment.submitNotes}"
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Grading & Feedback */}
          {assignment.status === 'graded' && (
            <div className="modal-grading-box">
              <h4 className="modal-grading-title">Result & Feedback</h4>
              <div className="modal-grid-2">
                <div className="modal-meta-item">
                  <span className="modal-label">Score</span>
                  <span className="modal-score-val">
                    {assignment.marks} / {assignment.totalMarks}
                  </span>
                </div>
                <div className="modal-meta-item">
                  <span className="modal-label">Grade</span>
                  <span className="modal-score-val">{assignment.grade}</span>
                </div>
              </div>
              {assignment.feedback && (
                <div className="modal-feedback-box">
                  <span className="modal-label">Teacher Feedback</span>
                  <p className="modal-feedback-text">"{assignment.feedback}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-modal-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT: ASSIGNMENTS ──────────────────────────────────────────────
export default function Assignments() {
  // 1. Load initial state from localStorage if available, otherwise use JSON data
  const [assignments, setAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialAssignmentsData;
  });

  // 2. Save assignments state to localStorage whenever assignments change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  }, [assignments]);

  // 3. Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // 4. Modal states
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submitAssignment, setSubmitAssignment] = useState(null);
  const [submitNotes, setSubmitNotes] = useState('');
  const [submitFileName, setSubmitFileName] = useState('');

  // 5. Unique subjects list for filter dropdown
  const subjectsList = Array.from(
    new Set(assignments.map((item) => item.subject))
  ).filter(Boolean);

  // 6. Summary Statistics Counts
  const totalAssignments = assignments.length;
  const pendingAssignments = assignments.filter((item) => item.status === 'pending').length;
  const submittedAssignments = assignments.filter((item) => item.status === 'submitted').length;
  const gradedAssignments = assignments.filter((item) => item.status === 'graded').length;

  // 7. Filter assignments based on search text, selected subject, and status
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesStatus = selectedStatus === 'all' || assignment.status === selectedStatus;
    const matchesSubject = selectedSubject === 'all' || assignment.subject === selectedSubject;

    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = !query ||
      assignment.title.toLowerCase().includes(query) ||
      assignment.subject.toLowerCase().includes(query) ||
      assignment.description.toLowerCase().includes(query);

    return matchesStatus && matchesSubject && matchesSearch;
  });

  // 8. Event Handlers
  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleCloseDetails = () => {
    setSelectedAssignment(null);
  };

  const handleStatusToggle = (id, currentStatus, assignment) => {
    if (currentStatus === 'graded') return;

    if (currentStatus === 'pending') {
      setSubmitAssignment(assignment);
      setSubmitNotes('');
      setSubmitFileName('');
    } else if (currentStatus === 'submitted') {
      setAssignments((prevAssignments) =>
        prevAssignments.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'pending',
                submittedDate: null,
                submitNotes: null,
                submitAttachmentName: null
              }
            : item
        )
      );
    }
  };

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    if (!submitAssignment) return;

    const today = new Date().toISOString().split('T')[0];
    const fileName = submitFileName.trim() || 'my_submission.pdf';

    setAssignments((prevAssignments) =>
      prevAssignments.map((item) =>
        item.id === submitAssignment.id
          ? {
              ...item,
              status: 'submitted',
              submittedDate: today,
              submitNotes: submitNotes,
              submitAttachmentName: fileName
            }
          : item
      )
    );

    if (selectedAssignment && selectedAssignment.id === submitAssignment.id) {
      setSelectedAssignment((prev) => ({
        ...prev,
        status: 'submitted',
        submittedDate: today,
        submitNotes: submitNotes,
        submitAttachmentName: fileName
      }));
    }

    setSubmitAssignment(null);
  };

  return (
    <div className="assignments-page">
      {/* Header */}
      <div className="assignments-page-header">
        <h2 className="assignments-page-title">Assignments Hub</h2>
        <p className="assignments-page-subtitle">
          View your coursework, submit solutions, and review grades & feedback.
        </p>
      </div>

      {/* Summary Statistics Cards */}
      <div className="assignments-stats-grid">
        <div className="assignments-stat-card">
          <span className="stat-card-lbl">Total Assignments</span>
          <div className="stat-card-val stat-val-total">{totalAssignments}</div>
        </div>

        <div className="assignments-stat-card">
          <span className="stat-card-lbl">Pending</span>
          <div className="stat-card-val stat-val-pending">{pendingAssignments}</div>
        </div>

        <div className="assignments-stat-card">
          <span className="stat-card-lbl">Submitted</span>
          <div className="stat-card-val stat-val-submitted">{submittedAssignments}</div>
        </div>

        <div className="assignments-stat-card">
          <span className="stat-card-lbl">Graded</span>
          <div className="stat-card-val stat-val-graded">{gradedAssignments}</div>
        </div>
      </div>

      {/* Toolbar: Search, Subject Dropdown & Status Pills */}
      <div className="assignments-toolbar">
        {/* Search Input */}
        <div className="search-box-wrapper">
          <Search size={16} className="search-box-icon" />
          <input
            type="text"
            className="search-input-field"
            placeholder="Search by title, subject or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Subject Filter Dropdown */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="filter-select-field"
        >
          <option value="all">All Subjects</option>
          {subjectsList.map((subjectName) => (
            <option key={subjectName} value={subjectName}>{subjectName}</option>
          ))}
        </select>

        {/* Status Filter Pills */}
        <div className="status-pill-group">
          {['all', 'pending', 'submitted', 'graded'].map((statusOption) => (
            <button
              key={statusOption}
              onClick={() => setSelectedStatus(statusOption)}
              className="filter-pill-btn"
              style={{
                background: selectedStatus === statusOption ? '#D71920' : 'transparent',
                color: selectedStatus === statusOption ? '#ffffff' : '#94a3b8'
              }}
            >
              {statusOption}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments Cards List */}
      <div className="assignments-list-container">
        {filteredAssignments.length === 0 ? (
          <div className="assignments-empty-box">
            No assignments match your filters.
          </div>
        ) : (
          filteredAssignments.map((assignmentItem) => (
            <AssignmentCard
              key={assignmentItem.id}
              assignment={assignmentItem}
              onViewDetails={handleViewDetails}
              onStatusToggle={handleStatusToggle}
            />
          ))
        )}
      </div>

      {/* View Details Modal */}
      <AssignmentDetailsModal
        assignment={selectedAssignment}
        onClose={handleCloseDetails}
      />

      {/* Submit Solution Modal */}
      {submitAssignment && (
        <div className="modal-overlay submit-modal-overlay">
          <div className="modal-card submit-modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Submit Assignment Solution</h3>
              <button
                className="modal-close-btn"
                onClick={() => setSubmitAssignment(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmSubmit}>
              <div className="modal-body">
                <div className="form-field-group">
                  <span className="modal-label">Assignment</span>
                  <div className="submit-readonly-title">
                    {submitAssignment.title}
                  </div>
                </div>

                <div className="form-field-group">
                  <label htmlFor="submit-notes-input" className="modal-label modal-field-lbl">
                    Notes / GitHub Repository Link *
                  </label>
                  <input
                    id="submit-notes-input"
                    type="text"
                    required
                    placeholder="https://github.com/username/my-solution"
                    value={submitNotes}
                    onChange={(e) => setSubmitNotes(e.target.value)}
                    className="submit-input-field"
                  />
                </div>

                <div className="form-field-group-last">
                  <label htmlFor="submit-file-input" className="modal-label modal-field-lbl">
                    Submission File Name (mock upload)
                  </label>
                  <input
                    id="submit-file-input"
                    type="text"
                    placeholder="solution.pdf"
                    value={submitFileName}
                    onChange={(e) => setSubmitFileName(e.target.value)}
                    className="submit-input-field"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setSubmitAssignment(null)}
                  className="btn-submit-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit-confirm"
                >
                  Confirm Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
