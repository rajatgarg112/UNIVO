import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import initialAssignmentsData from '../../data/assignments.json';
import AssignmentCard from './AssignmentCard';
import AssignmentDetailsModal from './AssignmentDetailsModal';
import './Assignments.css';

const STORAGE_KEY = 'uv_assignments_local_v1';

export default function Assignments() {

  // ─── ASSIGNMENTS DATA & PERSISTENCE ───────────────────────────────────────
  const [assignments, setAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialAssignmentsData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  }, [assignments]);

  // ─── FILTER & SEARCH STATE ────────────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // ─── MODAL STATES ─────────────────────────────────────────────────────────
  const [selectedAssignment, setSelectedAssignment] = useState(null); // View Details
  const [submitAssignment, setSubmitAssignment] = useState(null);     // Submit Solution
  const [submitNotes, setSubmitNotes] = useState('');
  const [submitFileName, setSubmitFileName] = useState('');

  // ─── DERIVED LISTS & SUMMARY COUNTS ──────────────────────────────────────
  const subjectsList = Array.from(
    new Set(assignments.map(a => a.subject))
  ).filter(Boolean);

  const totalCount = assignments.length;
  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const submittedCount = assignments.filter(a => a.status === 'submitted').length;
  const gradedCount = assignments.filter(a => a.status === 'graded').length;

  // Filtered assignments list
  const lowerSearch = searchTerm.toLowerCase().trim();

  const filteredAssignments = assignments.filter((a) => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesSubject = subjectFilter === 'all' || a.subject === subjectFilter;
    const matchesSearch = !lowerSearch ||
      a.title.toLowerCase().includes(lowerSearch) ||
      a.subject.toLowerCase().includes(lowerSearch) ||
      a.description.toLowerCase().includes(lowerSearch);

    return matchesStatus && matchesSubject && matchesSearch;
  });

  // ─── ACTION HANDLERS ──────────────────────────────────────────────────────
  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleCloseDetails = () => {
    setSelectedAssignment(null);
  };

  const handleStatusToggle = (id, currentStatus, assignment) => {
    if (currentStatus === 'graded') return; // Graded assignments are locked

    if (currentStatus === 'pending') {
      // Open Submit modal for pending items
      setSubmitAssignment(assignment);
      setSubmitNotes('');
      setSubmitFileName('');
    } else if (currentStatus === 'submitted') {
      // Directly unsubmit submitted items
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: 'pending',
                submittedDate: null,
                submitNotes: null,
                submitAttachmentName: null
              }
            : a
        )
      );
    }
  };

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    if (!submitAssignment) return;

    const today = new Date().toISOString().split('T')[0];
    const fileName = submitFileName.trim() || 'my_submission.pdf';

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === submitAssignment.id
          ? {
              ...a,
              status: 'submitted',
              submittedDate: today,
              submitNotes: submitNotes,
              submitAttachmentName: fileName
            }
          : a
      )
    );

    // Keep View Details modal in sync if open
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

  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="assignments-page">

      {/* ── PAGE HEADER ── */}
      <div className="assignments-page-header">
        <h2 className="assignments-page-title">Assignments Hub</h2>
        <p className="assignments-page-subtitle">
          View your coursework, submit solutions, and review grades & feedback.
        </p>
      </div>

      {/* ── SUMMARY STATS CARDS ── */}
      <div className="assignments-stats-grid">
        <div className="assignments-stat-card">
          <span className="stat-card-lbl">Total Assignments</span>
          <div className="stat-card-val stat-val-total">{totalCount}</div>
        </div>

        <div className="assignments-stat-card">
          <span className="stat-card-lbl">Pending</span>
          <div className="stat-card-val stat-val-pending">{pendingCount}</div>
        </div>

        <div className="assignments-stat-card">
          <span className="stat-card-lbl">Submitted</span>
          <div className="stat-card-val stat-val-submitted">{submittedCount}</div>
        </div>

        <div className="assignments-stat-card">
          <span className="stat-card-lbl">Graded</span>
          <div className="stat-card-val stat-val-graded">{gradedCount}</div>
        </div>
      </div>

      {/* ── SEARCH & FILTER TOOLBAR ── */}
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
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="filter-select-field"
        >
          <option value="all">All Subjects</option>
          {subjectsList.map((subj) => (
            <option key={subj} value={subj}>{subj}</option>
          ))}
        </select>

        {/* Status Filter Pills */}
        <div className="status-pill-group">
          {['all', 'pending', 'submitted', 'graded'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className="filter-pill-btn"
              style={{
                background: statusFilter === st ? '#6366f1' : 'transparent',
                color: statusFilter === st ? '#ffffff' : '#94a3b8'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── ASSIGNMENTS CARDS LIST ── */}
      <div className="assignments-list-container">
        {filteredAssignments.length === 0 ? (
          <div className="assignments-empty-box">
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

      {/* ── MODAL 1: VIEW DETAILS ── */}
      <AssignmentDetailsModal
        assignment={selectedAssignment}
        onClose={handleCloseDetails}
      />

      {/* ── MODAL 2: SUBMIT WORK ── */}
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

                {/* Assignment Title (Read-Only) */}
                <div className="form-field-group">
                  <span className="modal-label">Assignment</span>
                  <div className="submit-readonly-title">
                    {submitAssignment.title}
                  </div>
                </div>

                {/* Solution Link / Notes */}
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

                {/* Submission File Name */}
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
