import React from 'react';
import Modal from '../../../components/ui/Modal/Modal';
import { Sparkles } from 'lucide-react';
import './RoomDetailsModal.css';

/**
 * Helper to display human-readable block names
 */
function getBlockLabel(room) {
  if (!room) return '';
  if (room.blockName && room.gender) {
    return `${room.blockName} (${room.gender})`;
  }
  if (room.blockName) return room.blockName;
  if (room.blockId === 'alpha') return 'Alpha Hostel (Boys)';
  if (room.blockId === 'beta') return 'Beta Hostel (Boys)';
  if (room.blockId === 'gamma') return 'Gamma Hostel (Girls)';
  if (room.blockId === 'delta') return 'Delta Hostel (Girls)';
  return room.blockId || 'Unknown Block';
}

/**
 * Helper to determine badge CSS class based on room status
 */
function getStatusClass(status) {
  if (status === 'Available') return 'hostel-status-available';
  if (status === 'Occupied') return 'hostel-status-occupied';
  if (status === 'Maintenance') return 'hostel-status-maintenance';
  return 'hostel-status-default';
}

/**
 * RoomDetailsModal
 * Controlled modal displaying complete specifications for a selected room.
 *
 * Props:
 * - room: object | null (selected room data)
 * - isOpen: boolean (whether the modal is visible)
 * - onClose: function (callback to close modal)
 */
function RoomDetailsModal({ room, isOpen, onClose }) {
  if (!room) return null;

  const statusClass = getStatusClass(room.status);
  const blockLabel = getBlockLabel(room);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Room Details — ${room.roomNumber}`}
      size="md"
      className="room-details-modal-window"
    >
      <div className="room-details-content">
        {/* Header Summary Card */}
        <div className="room-details-header-card">
          <div className="room-details-title-group">
            <span className="room-details-block-name">{blockLabel}</span>
            <h3 className="room-details-number">Room {room.roomNumber}</h3>
            <span className="room-details-category">{room.category}</span>
          </div>

          <span className={`hostel-room-status ${statusClass}`}>
            <span className="hostel-status-dot" />
            {room.status}
          </span>
        </div>

        {/* Room Specifications Grid */}
        <div className="room-details-grid">
          <div className="room-detail-box">
            <span className="room-detail-label">Hostel Block</span>
            <span className="room-detail-value">{blockLabel}</span>
          </div>

          <div className="room-detail-box">
            <span className="room-detail-label">Hostel Category</span>
            <span className="room-detail-value">{room.category}</span>
          </div>

          <div className="room-detail-box">
            <span className="room-detail-label">Room Type</span>
            <span className="room-detail-value">{room.acType ? `${room.acType} Room` : 'Standard'}</span>
          </div>

          <div className="room-detail-box">
            <span className="room-detail-label">Floor</span>
            <span className="room-detail-value">Floor {room.floor}</span>
          </div>

          <div className="room-detail-box">
            <span className="room-detail-label">Room Capacity</span>
            <span className="room-detail-value">{room.capacity} Beds</span>
          </div>

          <div className="room-detail-box">
            <span className="room-detail-label">Current Occupancy</span>
            <span className="room-detail-value">
              {room.occupiedBeds} / {room.capacity} Beds
            </span>
          </div>

          <div className="room-detail-box">
            <span className="room-detail-label">Semester Fee</span>
            <span className="room-detail-value room-fee-value">
              ₹{room.feePerSemester ? room.feePerSemester.toLocaleString('en-IN') : '0'}
            </span>
          </div>

          <div className="room-detail-box">
            <span className="room-detail-label">Current Status</span>
            <span className="room-detail-value">{room.status}</span>
          </div>

          {room.washroomType && (
            <div className="room-detail-box">
              <span className="room-detail-label">Washroom Type</span>
              <span className="room-detail-value">{room.washroomType}</span>
            </div>
          )}
        </div>

        {/* Basic Facilities */}
        {room.facilities && room.facilities.length > 0 && (
          <div className="room-details-facilities">
            <h4 className="room-facilities-title">Basic Facilities</h4>
            <div className="room-facility-pills">
              {room.facilities.map((facility, index) => (
                <span key={index} className="room-facility-pill">
                  <Sparkles size={13} />
                  {facility}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Close Button Footer */}
        <div className="room-details-actions">
          <button
            type="button"
            className="room-details-close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default RoomDetailsModal;
