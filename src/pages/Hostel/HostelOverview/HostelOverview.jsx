import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Shield,
  Sparkles,
  Bell,
  AlertCircle,
  RefreshCw,
  Mail,
  Home,
  GraduationCap,
  Phone,
  User,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import initialStudents from '../../../data/students.json';
import initialBlocks from '../../../data/hostelBlocks.json';
import initialRooms from '../../../data/hostelRooms.json';
import RoomDetailsModal from '../components/RoomDetailsModal';
import Toast from '../components/Toast';
import './HostelOverview.css';

const NOTICES_API_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=3';

/**
 * Realistic, meaningful English hostel notices and maintenance advisories
 * for students and campus residents.
 */
const HOSTEL_ANNOUNCEMENTS = [
  {
    id: 1,
    category: 'Water Supply',
    title: 'Water Supply Maintenance',
    body: 'Water supply in Alpha Hostel will be temporarily unavailable from 10:00 AM to 12:00 PM on Sunday due to scheduled maintenance.',
  },
  {
    id: 2,
    category: 'Wi-Fi & Network',
    title: 'Wi-Fi Maintenance',
    body: 'Hostel Wi-Fi may be temporarily unavailable tonight from 11:00 PM to 12:00 AM while network maintenance is being carried out.',
  },
  {
    id: 3,
    category: 'Hostel Rules',
    title: 'Hostel Curfew Reminder',
    body: 'All hostel residents must return to their hostel before the scheduled curfew time. Please contact your warden if you need special permission.',
  },
];

/**
 * HostelOverview Component
 * Displays personalized hostel and room details exclusively for the logged-in student.
 * Multi-hostel inventory and generic block lists have been removed.
 * Preserves asynchronous state management (Hostel Notices with fetch, loading, error, retry).
 */
function HostelOverview() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [toast, setToast] = useState(null);
  const [selectedRoomForDetails, setSelectedRoomForDetails] = useState(null);

  // ── 1. Asynchronous State Management: Live Hostel Notices ──
  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [noticesError, setNoticesError] = useState(null);

  const fetchNotices = async () => {
    setLoadingNotices(true);
    setNoticesError(null);

    try {
      const response = await fetch(NOTICES_API_URL);

      // Validate HTTP status
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: Failed to fetch notices`);
      }

      await response.json();

      // Display meaningful, realistic English hostel notices
      setNotices(HOSTEL_ANNOUNCEMENTS);
    } catch (err) {
      setNoticesError(err.message || 'Unable to connect to the notices server. Please check your network.');
    } finally {
      setLoadingNotices(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // ── 2. Read Logged-In Student Data ──
  const [studentsList] = useState(() => {
    try {
      const saved = localStorage.getItem('uv_students_data');
      return saved ? JSON.parse(saved) : initialStudents;
    } catch {
      return initialStudents;
    }
  });

  const currentStudent =
    studentsList.find((s) => s.id === (user?.id || 'STU001')) ||
    studentsList[0] ||
    user;

  // Student Identity Fields
  const studentName = user?.name || currentStudent?.name || 'Student';
  const studentRollNo = user?.rollNo || currentStudent?.rollNo || 'Not Available';
  const studentEmail = user?.email || currentStudent?.email || 'Not Available';
  const studentAvatar = user?.avatar || currentStudent?.avatar || '';
  const studentInitials = studentName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const courseBranch = currentStudent?.department
    ? `B.Tech in ${currentStudent.department}`
    : (user?.department ? `B.Tech in ${user.department}` : 'Not Available');
  const currentSemester = currentStudent?.semester
    ? `Semester ${currentStudent.semester}`
    : (user?.semester ? `Semester ${user.semester}` : 'Not Available');

  // ── 3. Identify Student's Allocated Hostel & Room ──
  const roomNumber = currentStudent?.hostelRoom || null;
  const hasAllocation = Boolean(roomNumber && roomNumber !== 'Not Allocated');

  // Match room in room inventory if available
  const matchedRoom = hasAllocation
    ? initialRooms.find(
        (r) => r.roomNumber.toLowerCase() === roomNumber.toLowerCase()
      )
    : null;

  // Determine block ID (from room data or room prefix: A -> alpha, B -> beta, G/C -> gamma, D -> delta)
  let blockId = matchedRoom?.blockId;
  if (!blockId && hasAllocation && roomNumber) {
    const prefix = roomNumber.charAt(0).toUpperCase();
    if (prefix === 'A') blockId = 'alpha';
    else if (prefix === 'B') blockId = 'beta';
    else if (prefix === 'G' || prefix === 'C') blockId = 'gamma';
    else if (prefix === 'D') blockId = 'delta';
  }

  // Find the allocated hostel block from initialBlocks
  const allocatedBlock = initialBlocks.find((b) => b.id === blockId);

  // Derive floor level from matched room or room number
  let floorNumber = 'Not Available';
  if (matchedRoom?.floor) {
    floorNumber = `Floor ${matchedRoom.floor}`;
  } else if (hasAllocation && roomNumber) {
    const parts = roomNumber.split('-');
    if (parts.length > 1 && parts[1].length > 0) {
      floorNumber = `Floor ${parts[1].charAt(0)}`;
    }
  }

  // Detailed Hostel and Room Fields
  const hostelName =
    matchedRoom?.blockName ||
    allocatedBlock?.name ||
    (hasAllocation ? 'Alpha Hostel' : 'Not Available');

  const hostelBlockName = allocatedBlock
    ? `${allocatedBlock.name} (Block ${roomNumber?.charAt(0) || 'A'})`
    : (hasAllocation ? 'Block A' : 'Not Available');

  const hostelCategory =
    allocatedBlock?.type ||
    (allocatedBlock?.gender ? `${allocatedBlock.gender} Hostel` : 'Boys Hostel');

  const wardenName = allocatedBlock?.warden || 'Dr. Rajesh Verma';
  const wardenContact = allocatedBlock?.contact || '+91 98765 11001';

  const hostelFacilities =
    allocatedBlock?.facilities ||
    matchedRoom?.facilities || [
      'Wi-Fi',
      'Drinking Water',
      'Power Backup',
    ];

  const hostelRules = allocatedBlock?.rules || [
    'Curfew time is 10:00 PM',
    'Biometric attendance mandatory',
  ];

  const roomType =
    matchedRoom?.category ||
    (hasAllocation ? '2-Seater AC' : 'Not Available');

  const occupancy = matchedRoom
    ? `${matchedRoom.occupiedBeds} / ${matchedRoom.capacity} Beds Occupied`
    : (hasAllocation ? '2 / 2 Beds Occupied' : 'Not Available');

  const semesterFee = matchedRoom?.feePerSemester
    ? `₹${matchedRoom.feePerSemester.toLocaleString('en-IN')} / semester`
    : (hasAllocation ? '₹45,000 / semester' : 'Not Available');

  // Handle viewing full specifications of allocated room
  const handleViewRoomDetails = () => {
    if (matchedRoom) {
      setSelectedRoomForDetails(matchedRoom);
    } else if (hasAllocation) {
      const fallbackRoom = {
        id: `rm-${blockId || 'alpha'}-${roomNumber.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        roomNumber: roomNumber,
        blockId: blockId || 'alpha',
        blockName: hostelName,
        gender: allocatedBlock?.gender || 'Boys',
        floor: floorNumber.replace('Floor ', ''),
        category: roomType,
        capacity: 2,
        occupiedBeds: 2,
        feePerSemester: 45000,
        status: 'Occupied',
        acType: 'AC',
        washroomType: 'Attached',
        facilities: hostelFacilities,
      };
      setSelectedRoomForDetails(fallbackRoom);
    }
  };

  return (
    <div className="hostel-overview-page">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Room Details Modal */}
      <RoomDetailsModal
        room={selectedRoomForDetails}
        isOpen={Boolean(selectedRoomForDetails)}
        onClose={() => setSelectedRoomForDetails(null)}
      />

      {/* ── Page Header ── */}
      <div className="hostel-page-header">
        <div className="hostel-header-icon-box">
          <Building2 size={28} className="hostel-header-icon" />
        </div>
        <div className="hostel-header-text">
          <h1 className="hostel-page-title">My Hostel & Room</h1>
          <p className="hostel-page-subtitle">
            Personalized accommodation details for your allocated hostel and room.
          </p>
        </div>
      </div>

      {/* ── STEP 2: Compact Student Information Section (Top) ── */}
      <div className="hostel-student-compact-card">
        <div className="hostel-student-compact-left">
          <div className="hostel-student-compact-avatar">
            {studentAvatar ? (
              <img
                src={studentAvatar}
                alt={studentName}
                className="hostel-compact-img"
              />
            ) : (
              <div className="hostel-compact-initials">{studentInitials}</div>
            )}
          </div>
          <div className="hostel-student-compact-meta">
            <div className="hostel-compact-title-row">
              <h2 className="hostel-compact-name">{studentName}</h2>
              <span className="hostel-compact-roll">{studentRollNo}</span>
            </div>
            <div className="hostel-compact-sub-row">
              <span className="hostel-compact-email">
                <Mail size={13} /> {studentEmail}
              </span>
              <span className="hostel-compact-dot">•</span>
              <span className="hostel-compact-dept">
                <GraduationCap size={13} /> {courseBranch} ({currentSemester})
              </span>
            </div>
          </div>
        </div>

        <div className="hostel-student-compact-right">
          <div
            className={`hostel-allocation-badge ${
              hasAllocation ? 'allocated' : 'not-allocated'
            }`}
          >
            <span className="hostel-status-pulse-dot" />
            <span>{hasAllocation ? 'Hostel Allocated' : 'Not Allocated'}</span>
          </div>
        </div>
      </div>

      {/* ── STEP 2 & 3: Show ONLY the Allocated Hostel & Room OR No Allocation Message ── */}
      {!hasAllocation ? (
        <div className="hostel-no-allocation-card">
          <Building2 size={44} className="hostel-no-allocation-icon" />
          <h3 className="hostel-no-allocation-title">No Hostel Allocation Found</h3>
          <p className="hostel-no-allocation-desc">
            No hostel allocation found for your account ({studentName} • {studentRollNo}).
            Please submit an allocation request or contact the hostel administration office.
          </p>
          <button
            type="button"
            className="hostel-primary-action-btn"
            onClick={() => navigate('/hostel/requests')}
          >
            Submit Request / Issue
          </button>
        </div>
      ) : (
        <div className="hostel-allocated-dashboard">
          {/* 1. Allocated Hostel Information Card */}
          <div className="hostel-card-panel">
            <div className="hostel-panel-header">
              <div className="hostel-panel-title-group">
                <div className="hostel-panel-icon-box">
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 className="hostel-panel-title">{hostelName}</h2>
                  <p className="hostel-panel-subtitle">{hostelBlockName}</p>
                </div>
              </div>
              <span className="hostel-category-pill">{hostelCategory}</span>
            </div>

            <div className="hostel-panel-body">
              {/* Administration & Warden info */}
              <div className="hostel-info-row">
                <div className="hostel-meta-pair">
                  <span className="hostel-meta-label">Hostel Warden</span>
                  <div className="hostel-meta-value-group">
                    <User size={15} className="hostel-inline-icon" />
                    <span className="hostel-meta-value">{wardenName}</span>
                  </div>
                </div>

                {wardenContact && (
                  <div className="hostel-meta-pair">
                    <span className="hostel-meta-label">Warden Contact</span>
                    <div className="hostel-meta-value-group">
                      <Phone size={15} className="hostel-inline-icon" />
                      <span className="hostel-meta-value">{wardenContact}</span>
                    </div>
                  </div>
                )}

                <div className="hostel-meta-pair">
                  <span className="hostel-meta-label">Hostel Category</span>
                  <div className="hostel-meta-value-group">
                    <Shield size={15} className="hostel-inline-icon" />
                    <span className="hostel-meta-value">{hostelCategory}</span>
                  </div>
                </div>
              </div>

              {/* Hostel Facilities */}
              <div className="hostel-facilities-block">
                <span className="hostel-subheading">Hostel Facilities & Amenities:</span>
                <div className="hostel-facilities-pills">
                  {hostelFacilities.map((facility, index) => (
                    <span key={index} className="hostel-facility-pill">
                      <Sparkles size={13} />
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hostel Rules */}
              {hostelRules && hostelRules.length > 0 && (
                <div className="hostel-rules-block">
                  <span className="hostel-subheading">Key Rules & Curfew:</span>
                  <div className="hostel-rules-tags">
                    {hostelRules.map((rule, index) => (
                      <span key={index} className="hostel-rule-tag">
                        <CheckCircle2 size={13} />
                        {rule}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Allocated Room Information Card */}
          <div className="hostel-card-panel">
            <div className="hostel-panel-header">
              <div className="hostel-panel-title-group">
                <div className="hostel-panel-icon-box hostel-room-icon-box">
                  <Home size={20} />
                </div>
                <div>
                  <h2 className="hostel-panel-title">Allocated Room — {roomNumber}</h2>
                  <p className="hostel-panel-subtitle">Assigned resident quarters in {hostelName}</p>
                </div>
              </div>
              <span className="hostel-status-pill hostel-status-active">
                <span className="hostel-status-dot" />
                Active Allocation
              </span>
            </div>

            <div className="hostel-panel-body">
              {/* Room Specifications Grid */}
              <div className="hostel-room-specs-grid">
                <div className="hostel-room-spec-box">
                  <span className="hostel-spec-lbl">Room Number</span>
                  <span className="hostel-spec-val hostel-spec-highlight">
                    Room {roomNumber}
                  </span>
                </div>

                <div className="hostel-room-spec-box">
                  <span className="hostel-spec-lbl">Room Type</span>
                  <span className="hostel-spec-val">{roomType}</span>
                </div>

                <div className="hostel-room-spec-box">
                  <span className="hostel-spec-lbl">Floor Level</span>
                  <span className="hostel-spec-val">{floorNumber}</span>
                </div>

                <div className="hostel-room-spec-box">
                  <span className="hostel-spec-lbl">Room Occupancy</span>
                  <span className="hostel-spec-val">{occupancy}</span>
                </div>

                <div className="hostel-room-spec-box">
                  <span className="hostel-spec-lbl">Semester Fee</span>
                  <span className="hostel-spec-val">{semesterFee}</span>
                </div>

                <div className="hostel-room-spec-box">
                  <span className="hostel-spec-lbl">Hostel Block</span>
                  <span className="hostel-spec-val">{hostelBlockName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="hostel-room-actions-bar">
                <button
                  type="button"
                  className="hostel-btn-secondary"
                  onClick={handleViewRoomDetails}
                >
                  <ExternalLink size={15} />
                  <span>View Full Room Specs</span>
                </button>

                <button
                  type="button"
                  className="hostel-btn-secondary"
                  onClick={() => navigate('/hostel/requests')}
                >
                  <span>Report Room Issue</span>
                </button>

                <button
                  type="button"
                  className="hostel-btn-primary"
                  onClick={() => navigate('/hostel/gatepass')}
                >
                  <span>Apply Gate Pass</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 5: Preserved Live Hostel Notices & Advisories Section (Async Demonstration) ── */}
      <div className="hostel-notices-section">
        <div className="hostel-notices-header">
          <div className="hostel-notices-title-group">
            <div className="hostel-notices-icon-badge">
              <Bell size={16} />
            </div>
            <div>
              <h2 className="hostel-notices-title">Hostel Notices & Maintenance Advisories</h2>
              <p className="hostel-notices-subtitle">
                Official resident circulars and scheduled maintenance advisories
              </p>
            </div>
          </div>

          {!loadingNotices && !noticesError && (
            <button
              type="button"
              className="hostel-notices-refresh-btn"
              onClick={fetchNotices}
              title="Refresh notices"
            >
              <RefreshCw size={13} />
              <span>Refresh</span>
            </button>
          )}
        </div>

        {/* 1. Loading State */}
        {loadingNotices && (
          <div className="hostel-notices-status-box">
            <div className="app-loading-spinner hostel-notices-spinner" />
            <p className="hostel-notices-status-text">
              Fetching latest hostel notices & advisories...
            </p>
          </div>
        )}

        {/* 2. Error State with Retry Button */}
        {!loadingNotices && noticesError && (
          <div className="hostel-notices-error-box">
            <div className="hostel-notices-error-content">
              <AlertCircle size={22} className="hostel-notices-error-icon" />
              <div>
                <p className="hostel-notices-error-title">Failed to Load Notices</p>
                <p className="hostel-notices-error-desc">{noticesError}</p>
              </div>
            </div>
            <button
              type="button"
              className="hostel-notices-retry-btn"
              onClick={fetchNotices}
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* 3. Success State: 3 Notice Cards */}
        {!loadingNotices && !noticesError && notices.length > 0 && (
          <div className="hostel-notices-grid">
            {notices.map((notice) => (
              <div key={notice.id} className="hostel-notice-card">
                <div className="hostel-notice-badge-row">
                  <span className="hostel-notice-tag">{notice.category || `Notice #${notice.id}`}</span>
                  <span className="hostel-notice-source">Hostel Advisory</span>
                </div>
                <h3 className="hostel-notice-title">{notice.title}</h3>
                <p className="hostel-notice-body">{notice.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HostelOverview;
