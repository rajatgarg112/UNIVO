import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Pencil,
  Trash2,
  Calendar,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import ComplaintModal from '../components/ComplaintModal';
import Toast from '../components/Toast';
import HostelStatCard from '../components/HostelStatCard';
import useLocalStorage from '../../../hooks/useLocalStorage';
import useDebounce from '../../../hooks/useDebounce';

import initialComplaintsData from '../../../data/hostelComplaints.json';
import './HostelRequests.css';

const STATUS_FILTERS = ['All', 'Pending', 'In Progress', 'Resolved'];
const STORAGE_KEY = 'univo_hostel_complaints';
const ITEMS_PER_PAGE = 6;

/**
 * HostelRequests Page
 * Allows students/users to view, search, filter, submit, edit, and delete hostel complaints.
 */
function HostelRequests() {
  // ── State Management with useLocalStorage Custom Hook ──
  const [complaints, setComplaints] = useLocalStorage(
    STORAGE_KEY,
    initialComplaintsData
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [complaintToEdit, setComplaintToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);

  // ── Debounced Search Query (300ms delay) ──
  // Input stays responsive immediately; filtering only triggers after user pauses typing for 300ms
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // ── Memoized Statistics Calculations ──
  // Recalculates stats only when the complaints array changes, not on search/filter re-renders
  const stats = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter((c) => c.status === 'Pending').length,
      inProgress: complaints.filter((c) => c.status === 'In Progress').length,
      resolved: complaints.filter((c) => c.status === 'Resolved').length,
    };
  }, [complaints]);

  // ── Toast Helper (memoized with stable setter) ──
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  // ── Modal Handlers ──
  const handleOpenCreateModal = () => {
    setComplaintToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (complaint) => {
    setComplaintToEdit(complaint);
    setIsModalOpen(true);
  };

  // Stable callback passed to ComplaintModal onClose prop
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setComplaintToEdit(null);
  }, []);

  // ── CRUD Handlers ──
  // Memoized callback passed to ComplaintModal onSubmit prop; depends on complaintToEdit
  const handleSaveComplaint = useCallback((formData) => {
    if (complaintToEdit) {
      // Update existing complaint
      setComplaints((prev) =>
        prev.map((item) => (item.id === complaintToEdit.id ? { ...item, ...formData } : item))
      );
      showToast('Complaint updated successfully!', 'success');
    } else {
      // Add new complaint
      const newComplaint = {
        ...formData,
        id: `cmp-${Date.now()}`,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
      };
      setComplaints((prev) => [newComplaint, ...prev]);
      setCurrentPage(1); // Jump to page 1 to see newly added complaint
      showToast('New complaint registered successfully!', 'success');
    }

    handleCloseModal();
  }, [complaintToEdit, showToast, handleCloseModal, setComplaints]);

  const handleDeleteComplaint = (id, title) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete the complaint: "${title}"?`);
    if (isConfirmed) {
      setComplaints((prev) => prev.filter((item) => item.id !== id));
      showToast('Complaint deleted successfully.', 'info');
    }
  };

  // ── Reset Current Page to 1 on Search, Filter, or Sort Change ──
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, statusFilter, sortBy]);

  // ── Filtering & Searching (Using Debounced Search Query) ──
  const filteredComplaints = complaints.filter((complaint) => {
    const cleanSearch = debouncedSearchQuery.toLowerCase().trim();
    const matchesSearch =
      !cleanSearch ||
      complaint.title.toLowerCase().includes(cleanSearch) ||
      (complaint.roomNumber &&
        complaint.roomNumber.toLowerCase().includes(cleanSearch));

    const matchesStatus =
      statusFilter === 'All' || complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ── Non-mutating Sort by Date (Newest / Oldest) ──
  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    if (sortBy === 'oldest') {
      return dateA - dateB; // Ascending: Oldest first
    }
    return dateB - dateA; // Descending: Newest first
  });

  // ── Pagination Calculations (slice method) ──
  const totalPages = Math.ceil(sortedComplaints.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentComplaints = sortedComplaints.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // ── Boundary Safety: Ensure currentPage stays valid after deletions ──
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // ── Status & Priority Badge Helpers ──
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Resolved':
        return 'complaint-status-resolved';
      case 'In Progress':
        return 'complaint-status-progress';
      case 'Pending':
      default:
        return 'complaint-status-pending';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'complaint-priority-high';
      case 'Medium':
        return 'complaint-priority-medium';
      case 'Low':
      default:
        return 'complaint-priority-low';
    }
  };

  return (
    <div className="hostel-requests-page">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Complaint Modal (used for both Create & Edit) */}
      <ComplaintModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveComplaint}
        complaintToEdit={complaintToEdit}
      />

      {/* ── Page Header ── */}
      <div className="hostel-page-header">
        <div className="hostel-header-left">
          <div className="hostel-header-icon-box">
            <MessageSquare size={28} className="hostel-header-icon" />
          </div>
          <div className="hostel-header-text">
            <h1 className="hostel-page-title">Hostel Requests</h1>
            <p className="hostel-page-subtitle">
              Submit maintenance complaints, track issue resolution, and manage room requests.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="hostel-new-complaint-btn"
          onClick={handleOpenCreateModal}
        >
          <Plus size={18} />
          New Complaint
        </button>
      </div>

      {/* ── Statistics Summary Grid ── */}
      <div className="hostel-stats-grid">
        <HostelStatCard
          title="Total Complaints"
          value={stats.total}
          description="Logged requests across blocks"
        />
        <HostelStatCard
          title="Pending"
          value={stats.pending}
          description="Awaiting assignment"
        />
        <HostelStatCard
          title="In Progress"
          value={stats.inProgress}
          description="Under active maintenance"
        />
        <HostelStatCard
          title="Resolved"
          value={stats.resolved}
          description="Successfully completed"
        />
      </div>

      {/* ── Requests Section ── */}
      <div className="hostel-section">
        <div className="hostel-section-header">
          <div>
            <h2 className="hostel-section-title">Submitted Complaints</h2>
            <p className="hostel-section-subtitle">
              View details, status progress, and updates on your maintenance tickets.
            </p>
          </div>
          <span className="hostel-badge-count">
            {sortedComplaints.length > 0
              ? `Page ${currentPage} of ${totalPages} • Showing ${currentComplaints.length} of ${sortedComplaints.length} Requests`
              : `0 of ${complaints.length} Requests`}
          </span>
        </div>

        {/* ── Controls Bar: Search, Status Filters & Sort ── */}
        <div className="hostel-controls-bar">
          {/* Search Input */}
          <div className="hostel-search-wrapper">
            <Search size={16} className="hostel-search-icon" />
            <input
              type="text"
              placeholder="Search by title or room (e.g. Fan, A-105)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hostel-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="hostel-search-clear"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Buttons */}
          <div className="hostel-filter-group">
            <Filter size={15} className="hostel-filter-icon" />
            <span className="hostel-filter-label">Status:</span>
            <div className="hostel-filter-pills">
              {STATUS_FILTERS.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`hostel-filter-pill ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="hostel-sort-group">
            <ArrowUpDown size={15} className="hostel-sort-icon" />
            <label htmlFor="hostel-sort-select" className="hostel-sort-label">
              Sort:
            </label>
            <select
              id="hostel-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="hostel-sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* ── Complaints List Grid ── */}
        {sortedComplaints.length > 0 ? (
          <>
            <div className="hostel-complaints-list">
              {currentComplaints.map((complaint) => (
                <div key={complaint.id} className="hostel-complaint-card">
                  {/* Card Top: Category, Room, and Badges */}
                  <div className="complaint-card-header">
                    <div className="complaint-meta-top">
                      <span className="complaint-category-pill">{complaint.category}</span>
                      <span className="complaint-room-tag">Room {complaint.roomNumber}</span>
                    </div>

                    <div className="complaint-badges-group">
                      <span className={`complaint-priority-badge ${getPriorityBadgeClass(complaint.priority)}`}>
                        {complaint.priority} Priority
                      </span>
                      <span className={`complaint-status-badge ${getStatusBadgeClass(complaint.status)}`}>
                        <span className="complaint-status-dot" />
                        {complaint.status}
                      </span>
                    </div>
                  </div>

                  {/* Card Middle: Title & Description */}
                  <div className="complaint-body">
                    <h3 className="complaint-title">{complaint.title}</h3>
                    <p className="complaint-desc">{complaint.description}</p>
                  </div>

                  {/* Card Bottom: Date and Action Buttons */}
                  <div className="complaint-card-footer">
                    <div className="complaint-date-info">
                      <Calendar size={14} />
                      <span>Logged on {complaint.date || 'Recent'}</span>
                    </div>

                    <div className="complaint-actions-group">
                      <button
                        type="button"
                        className="complaint-action-btn complaint-edit-btn"
                        onClick={() => handleOpenEditModal(complaint)}
                        title="Edit complaint"
                      >
                        <Pencil size={14} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        className="complaint-action-btn complaint-delete-btn"
                        onClick={() => handleDeleteComplaint(complaint.id, complaint.title)}
                        title="Delete complaint"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Pagination Controls ── */}
            {totalPages > 1 && (
              <div className="hostel-pagination">
                <button
                  type="button"
                  className="hostel-page-btn hostel-page-nav-btn"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <div className="hostel-page-numbers">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`hostel-page-btn hostel-page-num ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                      aria-current={currentPage === pageNum ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="hostel-page-btn hostel-page-nav-btn"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          /* ── Empty State ── */
          <div className="hostel-empty-state">
            <Building2 size={40} className="hostel-empty-icon" />
            <h3 className="hostel-empty-title">No complaints found</h3>
            <p className="hostel-empty-desc">
              {complaints.length === 0
                ? "You haven't submitted any complaints yet. Click '+ New Complaint' to report an issue."
                : `No complaints match your search "${searchQuery}" or status filter.`}
            </p>
            {complaints.length > 0 ? (
              <button
                type="button"
                className="hostel-reset-btn"
                onClick={() => {
                  setStatusFilter('All');
                  setSearchQuery('');
                  setSortBy('newest');
                }}
              >
                Reset Filters
              </button>
            ) : (
              <button
                type="button"
                className="hostel-reset-btn"
                onClick={handleOpenCreateModal}
              >
                + Raise Complaint
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HostelRequests;
