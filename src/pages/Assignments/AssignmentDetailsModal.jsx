import React from 'react';
import { X, Paperclip } from 'lucide-react';

export default function AssignmentDetailsModal({ assignment, onClose }) {
  if (!assignment) return null;

  const priorityClass =
    assignment.priority === 'high' ? 'modal-priority-high' :
    assignment.priority === 'medium' ? 'modal-priority-medium' : 'modal-priority-low';

  const instructionsText = assignment.instructions ||
    'No specific instructions provided. Follow standard submission guidelines.';

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        {/* ── Modal Header ── */}
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

        {/* ── Modal Body ── */}
        <div className="modal-body">

          {/* Description */}
          <div className="modal-section">
            <span className="modal-label">Description</span>
            <p className="modal-text">{assignment.description}</p>
          </div>

          {/* Instructions */}
          <div className="modal-section modal-instructions-box">
            <span className="modal-label modal-instructions-lbl">Instructions</span>
            <p className="modal-text modal-instructions-text">{instructionsText}</p>
          </div>

          {/* Metadata Grid */}
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

          {/* Reference Attachments */}
          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="modal-section">
              <span className="modal-label">Reference Attachments</span>
              <div className="modal-attachments-list">
                {assignment.attachments.map((file, i) => (
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

          {/* Submission Info (if submitted or graded) */}
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

          {/* Result & Feedback (if graded) */}
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

        {/* ── Modal Footer ── */}
        <div className="modal-footer">
          <button className="btn-modal-close" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
