import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  ArrowLeft,
  Sparkles,
  Shield,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  Wrench,
} from 'lucide-react';
import initialRooms from '../../../data/hostelRooms.json';
import initialBlocks from '../../../data/hostelBlocks.json';
import './RoomDetailsPage.css';

/**
 * Helper to determine badge CSS class and icon based on room status
 */
function getStatusBadge(status) {
  switch (status) {
    case 'Available':
      return {
        className: 'hostel-status-available',
        icon: <CheckCircle2 size={13} />,
      };
    case 'Occupied':
      return {
        className: 'hostel-status-occupied',
        icon: <AlertCircle size={13} />,
      };
    case 'Maintenance':
      return {
        className: 'hostel-status-maintenance',
        icon: <Wrench size={13} />,
      };
    default:
      return {
        className: 'hostel-status-default',
        icon: <AlertCircle size={13} />,
      };
  }
}

/**
 * RoomDetailsPage Component
 * Demonstrates Dynamic Routing with React Router using useParams().
 * URL: /hostel/room/:roomId
 */
function RoomDetailsPage() {
  // Read dynamic parameter from the route URL
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Find room by id (e.g. rm-alpha-101) or roomNumber (e.g. A-101)
  const room = initialRooms.find(
    (r) =>
      r.id === roomId ||
      r.roomNumber?.toLowerCase() === roomId?.toLowerCase()
  );

  // If room does not exist, display simple "Room not found" message and Back button
  if (!room) {
    return (
      <div className="room-details-page">
        <div className="room-not-found-card">
          <Building2 size={48} className="room-not-found-icon" />
          <h2 className="room-not-found-title">Room Not Found</h2>
          <p className="room-not-found-text">
            No hostel room was found matching identifier &quot;
            <strong>{roomId}</strong>&quot;.
          </p>
          <button
            type="button"
            className="room-back-btn"
            onClick={() => navigate('/hostel')}
          >
            <ArrowLeft size={16} />
            Back to Hostel Overview
          </button>
        </div>
      </div>
    );
  }

  // Find block details for additional warden and facility information
  const blockData = initialBlocks.find((b) => b.id === room.blockId);
  const statusInfo = getStatusBadge(room.status);

  return (
    <div className="room-details-page">
      {/* Navigation Breadcrumb / Back Button */}
      <div className="room-page-topbar">
        <button
          type="button"
          className="room-back-link-btn"
          onClick={() => navigate('/hostel')}
        >
          <ArrowLeft size={16} />
          Back to Hostel Overview
        </button>

        <span className="room-url-param-pill">
          Route Param: <code>:roomId = {roomId}</code>
        </span>
      </div>

      {/* Main Room Card */}
      <div className="room-main-card">
        {/* Header Summary */}
        <div className="room-main-header">
          <div className="room-header-left">
            <div className="room-header-icon-box">
              <Building2 size={28} className="room-header-icon" />
            </div>
            <div>
              <span className="room-block-subtitle">
                {room.blockName || blockData?.name || 'Hostel Block'} ({room.gender || blockData?.gender || 'Hostel'})
              </span>
              <h1 className="room-header-title">Room {room.roomNumber}</h1>
              <p className="room-header-category">{room.category}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="room-header-right">
            <span className={`room-status-badge ${statusInfo.className}`}>
              {statusInfo.icon}
              {room.status}
            </span>
          </div>
        </div>

        {/* Room Specifications Grid */}
        <div className="room-specs-section">
          <h2 className="room-section-heading">Room Specifications</h2>
          <div className="room-specs-grid">
            <div className="room-spec-box">
              <span className="room-spec-label">Hostel Block</span>
              <span className="room-spec-value">
                {room.blockName || blockData?.name || room.blockId}
              </span>
            </div>

            <div className="room-spec-box">
              <span className="room-spec-label">Hostel Gender</span>
              <span className="room-spec-value">{room.gender || blockData?.gender || 'N/A'}</span>
            </div>

            <div className="room-spec-box">
              <span className="room-spec-label">Floor</span>
              <span className="room-spec-value">Floor {room.floor}</span>
            </div>

            <div className="room-spec-box">
              <span className="room-spec-label">Air Conditioning</span>
              <span className="room-spec-value">{room.acType || 'Standard'}</span>
            </div>

            <div className="room-spec-box">
              <span className="room-spec-label">Room Capacity</span>
              <span className="room-spec-value">{room.capacity} Beds</span>
            </div>

            <div className="room-spec-box">
              <span className="room-spec-label">Current Occupancy</span>
              <span className="room-spec-value">
                {room.occupiedBeds} / {room.capacity} Beds Occupied
              </span>
            </div>

            <div className="room-spec-box">
              <span className="room-spec-label">Semester Fee</span>
              <span className="room-spec-value room-fee-highlight">
                ₹{room.feePerSemester ? room.feePerSemester.toLocaleString('en-IN') : '0'}
              </span>
            </div>

            <div className="room-spec-box">
              <span className="room-spec-label">Washroom Type</span>
              <span className="room-spec-value">{room.washroomType || 'Standard'}</span>
            </div>
          </div>
        </div>

        {/* Facilities Section */}
        {room.facilities && room.facilities.length > 0 && (
          <div className="room-facilities-section">
            <h2 className="room-section-heading">Included Amenities & Facilities</h2>
            <div className="room-facilities-pills">
              {room.facilities.map((facility, index) => (
                <span key={index} className="room-facility-pill">
                  <Sparkles size={14} />
                  {facility}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Warden Contact Card (from Block data) */}
        {blockData && (
          <div className="room-warden-section">
            <h2 className="room-section-heading">Hostel Administration & Warden</h2>
            <div className="room-warden-card">
              <div className="room-warden-item">
                <User size={16} className="room-warden-icon" />
                <div>
                  <span className="room-warden-label">Warden Name</span>
                  <span className="room-warden-value">{blockData.warden}</span>
                </div>
              </div>

              <div className="room-warden-item">
                <Phone size={16} className="room-warden-icon" />
                <div>
                  <span className="room-warden-label">Contact Number</span>
                  <span className="room-warden-value">{blockData.contact}</span>
                </div>
              </div>

              {blockData.rules && blockData.rules.length > 0 && (
                <div className="room-warden-rules">
                  <Shield size={16} className="room-warden-icon" />
                  <div>
                    <span className="room-warden-label">Key Rules</span>
                    <span className="room-warden-value">
                      {blockData.rules.join(' • ')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="room-page-actions">
          <button
            type="button"
            className="room-action-btn-secondary"
            onClick={() => navigate('/hostel')}
          >
            <ArrowLeft size={16} />
            Back to All Rooms
          </button>

          <Link to="/hostel/requests" className="room-action-btn-primary">
            Report Issue / Raise Complaint
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RoomDetailsPage;
