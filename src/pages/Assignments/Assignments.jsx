import React, { useState, useEffect } from 'react';
import { Search, X, Paperclip } from 'lucide-react';
import initialAssignmentsData from '../../data/assignments.json';
import AssignmentCard from './AssignmentCard';
import './Assignments.css';

const STORAGE_KEY = 'uv_assignments_local_v1';

export default function Assignments() {

  // ─── ASSIGNMENTS STATE ────────────────────────────────────────────────────
  // Load from localStorage if available, otherwise use the JSON seed data.
  const [assignments, setAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAssignmentsData));
    return initialAssignmentsData;
  });

  // Persist to localStorage every time the assignments list changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  }, [assignments]);

  // ─── FILTER STATE ─────────────────────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // ─── VIEW DETAILS MODAL STATE ────────────────────────────────────────────
  // Simple pattern: null = modal closed, object = modal open.
  // When a student clicks "View Details" we call setSelectedAssignment(assignment).
  // When the student clicks Close we call setSelectedAssignment(null).
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // ─── SUBMIT MODAL STATE ───────────────────────────────────────────────────
  // A separate state for the submit-work modal so the two modals never conflict.
  const [submitAssignment, setSubmitAssignment] = useState(null);
  const [submitNotes, setSubmitNotes] = useState('');
  const [submitFileName, setSubmitFileName] = useState('');

  // ─── UNIQUE SUBJECTS LIST ─────────────────────────────────────────────────
  const subjectsList = Array.from(
    new Set(assignments.map((a) => a.subject))
  ).filter(Boolean);

  // ─── SUMMARY COUNTS ───────────────────────────────────────────────────────
  // Simple JavaScript: .length and .filter() — beginner-friendly.
  const totalCount     = assignments.length;
  const pendingCount   = assignments.filter((a) => a.status === 'pending').length;
  const submittedCount = assignments.filter((a) => a.status === 'submitted').length;
  const gradedCount    = assignments.filter((a) => a.status === 'graded').length;

  // ─── FILTERED LIST ────────────────────────────────────────────────────────
  const filteredAssignments = assignments.filter((a) => {
    const matchesStatus  = statusFilter === 'all' || a.status === statusFilter;
    const matchesSubject = subjectFilter === 'all' || a.subject === subjectFilter;
    const matchesSearch  =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSubject && matchesSearch;
  });

  // ─── HANDLERS ─────────────────────────────────────────────────────────────

  // Open the View Details modal for the chosen assignment
  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
  };

  // Close the View Details modal
  const handleCloseDetails = () => {
    setSelectedAssignment(null);
  };

  // Open the Submit modal, or directly unsubmit a submitted assignment
  const handleStatusToggle = (id, currentStatus, assignment) => {
    if (currentStatus === 'graded') return;          // graded = locked

    if (currentStatus === 'pending') {
      setSubmitAssignment(assignment);               // open submit modal
      setSubmitNotes('');
      setSubmitFileName('');
    } else if (currentStatus === 'submitted') {
      // Unsubmit directly without a modal
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status: 'pending', submittedDate: null,
                submitNotes: null, submitAttachmentName: null }
            : a
        )
      );
    }
  };

  // Confirm submission from the submit modal
  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    if (!submitAssignment) return;

    const today = new Date().toISOString().split('T')[0];
    const fileName = submitFileName || 'my_submission.pdf';

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === submitAssignment.id
          ? { ...a, status: 'submitted', submittedDate: today,
              submitNotes: submitNotes, submitAttachmentName: fileName }
          : a
      )
    );

    // If the View Details modal is open for the same assignment, keep it in sync
    if (selectedAssignment && selectedAssignment.id === submitAssignment.id) {
      setSelectedAssignment((prev) => ({
        ...prev,
        status: 'submitted',
        submittedDate: today,
        submitNotes: submitNotes,
        submitAttachmentName: fileName
      }));
    }

    setSubmitAssignment(null);    // close submit modal
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="assignments-page">

      {/* ── PAGE HEADING ── */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800',
                     color: 'var(--uv-text-primary)', marginBottom: '4px' }}>
          Assignments Hub
        </h2>
        <p style={{ color: 'var(--uv-text-muted)', fontSize: '14px', margin: 0 }}>
          View your coursework, submit solutions, and review grades & feedback.
        </p>
      </div>

      {/* ── SUMMARY CARDS ── */}
      <div className="assignments-stats-grid">
        <div className="assignments-stat-card">
          <span className="stat-card-lbl">Total Assignments</span>
          <div className="stat-card-val" style={{ color: 'var(--uv-primary)' }}>
            {totalCount}
          </div>
        </div>
        <div className="assignments-stat-card">
          <span className="stat-card-lbl">Pending</span>
          <div className="stat-card-val" style={{ color: 'var(--uv-warning)' }}>
            {pendingCount}
          </div>
        </div>
        <div className="assignments-stat-card">
          <span className="stat-card-lbl">Submitted</span>
          <div className="stat-card-val" style={{ color: '#06b6d4' }}>
            {submittedCount}
          </div>
        </div>
        <div className="assignments-stat-card">
          <span className="stat-card-lbl">Graded</span>
          <div className="stat-card-val" style={{ color: 'var(--uv-success)' }}>
            {gradedCount}
          </div>
        </div>
      </div>

      {/* ── SEARCH + FILTERS ── */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px',
                    flexWrap: 'wrap', alignItems: 'center' }}>

        {/* Search box */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px',
            top: '50%', transform: 'translateY(-50%)',
            color: 'var(--uv-text-muted)' }} />
          <input
            type="text"
            className="search-input-field"
            placeholder="Search by title, subject or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Subject dropdown */}
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="filter-select-field"
        >
          <option value="all">All Subjects</option>
          {subjectsList.map((subj) => (
            <option key={subj} value={subj}>{subj}</option>
          ))}
        </select>

        {/* Status pills */}
        <div className="status-pill-group">
          {['all', 'pending', 'submitted', 'graded'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className="filter-pill-btn"
              style={{
                background: statusFilter === st ? '#6366f1' : 'transparent',
                color: statusFilter === st ? '#ffffff' : 'var(--uv-text-muted)'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── ASSIGNMENT CARDS LIST ── */}
      <div className="assignments-list-container">
        {filteredAssignments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px',
                        background: 'var(--uv-bg-card)', borderRadius: '16px',
                        border: '1px solid var(--uv-border)',
                        color: 'var(--uv-text-muted)' }}>
            No assignments match your filters.
          </div>
        ) : (
          filteredAssignments.map((item) => (
            <AssignmentCard
              key={item.id}
              assignment={item}
              onViewDetails={handleViewDetails}
              onStatusToggle={handleStatusToggle}
            />
          ))
        )}
      </div>


      {/* ════════════════════════════════════════════════════════════════════
          MODAL 1 — VIEW DETAILS
          Shown when selectedAssignment is not null.
          Closed by calling setSelectedAssignment(null).
      ════════════════════════════════════════════════════════════════════ */}
      {selectedAssignment && (
        <div className="modal-overlay">
          <div className="modal-card">

            {/* ── Modal header ── */}
            <div className="modal-header">
              <div>
                <span className="subject-badge" style={{ marginBottom: '6px', display: 'inline-block' }}>
                  {selectedAssignment.subject}
                  {selectedAssignment.subjectCode && (
                    <span style={{ opacity: 0.75, fontSize: '10px' }}>
                      {' '}({selectedAssignment.subjectCode})
                    </span>
                  )}
                </span>
                <h3 className="modal-title">{selectedAssignment.title}</h3>
              </div>

              {/* ✕ Close button — sets selectedAssignment back to null */}
              <button
                className="modal-close-btn"
                onClick={handleCloseDetails}
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Modal body ── */}
            <div className="modal-body">

              {/* Description */}
              <div className="modal-section">
                <span className="modal-label">Description</span>
                <p className="modal-text">{selectedAssignment.description}</p>
              </div>

              {/* Instructions */}
              <div className="modal-section" style={{
                background: 'var(--uv-primary-light)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '10px', padding: '10px 14px'
              }}>
                <span className="modal-label" style={{ color: 'var(--uv-primary)' }}>
                  Instructions
                </span>
                <p className="modal-text" style={{ color: 'var(--uv-primary)', margin: 0 }}>
                  {selectedAssignment.instructions || 'No specific instructions provided. Follow standard submission guidelines.'}
                </p>
              </div>

              {/* 2-column metadata grid */}
              <div className="modal-grid-2">
                <div className="modal-meta-item">
                  <span className="modal-label">Faculty</span>
                  <span className="modal-value">{selectedAssignment.faculty}</span>
                </div>
                <div className="modal-meta-item">
                  <span className="modal-label">Due Date</span>
                  <span className="modal-value" style={{ color: 'var(--uv-primary)', fontWeight: '700' }}>
                    {selectedAssignment.dueDate}
                  </span>
                </div>
                <div className="modal-meta-item">
                  <span className="modal-label">Type</span>
                  <span className="modal-value" style={{ textTransform: 'capitalize' }}>
                    {selectedAssignment.type}
                  </span>
                </div>
                <div className="modal-meta-item">
                  <span className="modal-label">Total Marks</span>
                  <span className="modal-value">{selectedAssignment.totalMarks || 100}</span>
                </div>
                <div className="modal-meta-item">
                  <span className="modal-label">Priority</span>
                  <span className="modal-value" style={{
                    textTransform: 'capitalize', fontWeight: '700',
                    color: selectedAssignment.priority === 'high'   ? '#ef4444' :
                           selectedAssignment.priority === 'medium' ? '#f59e0b' : '#10b981'
                  }}>
                    {selectedAssignment.priority}
                  </span>
                </div>
                <div className="modal-meta-item">
                  <span className="modal-label">Status</span>
                  <span className={`status-badge ${selectedAssignment.status}`}>
                    {selectedAssignment.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Attachments */}
              {selectedAssignment.attachments && selectedAssignment.attachments.length > 0 && (
                <div className="modal-section">
                  <span className="modal-label">Reference Attachments</span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {selectedAssignment.attachments.map((file, i) => (
                      <a
                        key={i}
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

              {/* ── Submission info (only if submitted or graded) ── */}
              {(selectedAssignment.status === 'submitted' || selectedAssignment.status === 'graded') && (
                <div className="modal-section modal-section-bordered">
                  <span className="modal-label">Your Submission</span>
                  <div className="modal-grid-2" style={{ marginTop: '8px' }}>
                    {selectedAssignment.submittedDate && (
                      <div className="modal-meta-item">
                        <span className="modal-label">Submitted On</span>
                        <span className="modal-value">{selectedAssignment.submittedDate}</span>
                      </div>
                    )}
                    {selectedAssignment.submitAttachmentName && (
                      <div className="modal-meta-item">
                        <span className="modal-label">Submitted File</span>
                        <span className="modal-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Paperclip size={12} /> {selectedAssignment.submitAttachmentName}
                        </span>
                      </div>
                    )}
                  </div>
                  {selectedAssignment.submitNotes && (
                    <div style={{ marginTop: '8px' }}>
                      <span className="modal-label">Submission Notes / Link</span>
                      <div style={{ marginTop: '4px', background: 'var(--uv-input-bg)',
                                    padding: '8px 10px', borderRadius: '8px',
                                    fontSize: '13px', fontStyle: 'italic',
                                    color: 'var(--uv-text-secondary)' }}>
                        "{selectedAssignment.submitNotes}"
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Grading result (only when graded) ── */}
              {selectedAssignment.status === 'graded' && (
                <div className="modal-grading-box">
                  <h4 className="modal-grading-title">Result & Feedback</h4>
                  <div className="modal-grid-2">
                    <div className="modal-meta-item">
                      <span className="modal-label">Score</span>
                      <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--uv-success)' }}>
                        {selectedAssignment.marks} / {selectedAssignment.totalMarks}
                      </span>
                    </div>
                    <div className="modal-meta-item">
                      <span className="modal-label">Grade</span>
                      <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--uv-success)' }}>
                        {selectedAssignment.grade}
                      </span>
                    </div>
                  </div>
                  {selectedAssignment.feedback && (
                    <div style={{ marginTop: '10px' }}>
                      <span className="modal-label">Teacher Feedback</span>
                      <p style={{ margin: '4px 0 0 0', fontStyle: 'italic',
                                  fontSize: '13px', color: 'var(--uv-success)',
                                  lineHeight: '1.5' }}>
                        "{selectedAssignment.feedback}"
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>{/* end modal-body */}

            {/* ── Modal footer with Close button ── */}
            <div className="modal-footer">
              <button className="btn-modal-close" onClick={handleCloseDetails}>
                Close
              </button>
            </div>

          </div>
        </div>
      )}


      {/* ════════════════════════════════════════════════════════════════════
          MODAL 2 — SUBMIT WORK
          Shown when submitAssignment is not null.
          Closed by calling setSubmitAssignment(null).
      ════════════════════════════════════════════════════════════════════ */}
      {submitAssignment && (
        <div className="modal-overlay" style={{ zIndex: 1010 }}>
          <div className="modal-card" style={{ maxWidth: '480px' }}>

            <div className="modal-header">
              <h3 className="modal-title">Submit Assignment Solution</h3>
              <button className="modal-close-btn" onClick={() => setSubmitAssignment(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmSubmit}>
              <div className="modal-body">

                {/* Show which assignment is being submitted (read-only) */}
                <div style={{ marginBottom: '14px' }}>
                  <span className="modal-label">Assignment</span>
                  <div style={{ background: 'var(--uv-input-bg)', padding: '9px 12px',
                                borderRadius: '10px', border: '1px solid var(--uv-border)',
                                color: 'var(--uv-text-primary)', fontSize: '13px',
                                fontWeight: '600', marginTop: '4px' }}>
                    {submitAssignment.title}
                  </div>
                </div>

                {/* Notes / repo link */}
                <div style={{ marginBottom: '14px' }}>
                  <label className="modal-label" style={{ display: 'block', marginBottom: '4px' }}>
                    Notes / GitHub Repository Link *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://github.com/username/my-solution"
                    value={submitNotes}
                    onChange={(e) => setSubmitNotes(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px',
                             border: '1px solid var(--uv-input-border)',
                             background: 'var(--uv-input-bg)',
                             color: 'var(--uv-input-text)', fontSize: '13px' }}
                  />
                </div>

                {/* File name */}
                <div style={{ marginBottom: '16px' }}>
                  <label className="modal-label" style={{ display: 'block', marginBottom: '4px' }}>
                    Submission File Name (mock upload)
                  </label>
                  <input
                    type="text"
                    placeholder="solution.pdf"
                    value={submitFileName}
                    onChange={(e) => setSubmitFileName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px',
                             border: '1px solid var(--uv-input-border)',
                             background: 'var(--uv-input-bg)',
                             color: 'var(--uv-input-text)', fontSize: '13px' }}
                  />
                </div>

              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setSubmitAssignment(null)}
                  style={{ padding: '8px 16px', background: 'transparent',
                           color: 'var(--uv-text-muted)', border: 'none',
                           cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px',
                           background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                           color: '#fff', border: 'none', borderRadius: '10px',
                           fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
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
