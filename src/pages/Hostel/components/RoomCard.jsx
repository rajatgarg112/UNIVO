import React from 'react';
import './RoomCard.css';

/**
 * Helper to display human-readable block names
 */
function getBlockLabel(blockId) {
  if (blockId === 'alpha') return 'Alpha Hostel (Boys)';
  if (blockId === 'beta') return 'Beta Hostel (Boys)';
  if (blockId === 'gamma') return 'Gamma Hostel (Girls)';
  if (blockId === 'delta') return 'Delta Hostel (Girls)';
  if (blockId === 'block-a') return 'Block A (Boys)';
  if (blockId === 'block-b') return 'Block B (Boys)';
  if (blockId === 'block-c') return 'Block C (Girls)';
  if (blockId === 'block-d') return 'Block D (Girls)';
  return blockId || 'Unknown Block';
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
 * RoomCard
 * Displays individual room specs, availability status, occupancy, and a details trigger.
 * Props:
 * - room: object containing room specifications
 * - onViewDetails: function called with the room object when "View Details" is clicked
 */
function RoomCard({ room, onViewDetails }) {
  if (!room) return null;

  const {
    roomNumber,
    blockId,
    floor,
    category,
    occupiedBeds,
    capacity,
    feePerSemester,
    status,
  } = room;

  const blockLabel = getBlockLabel(blockId);
  const statusClassName = getStatusClass(status);

  const handleDetailsClick = () => {
    if (typeof onViewDetails === 'function') {
      onViewDetails(room);
    }
  };

  return (
    <div className="hostel-room-card">
      {/* Header: Room Number, Category, and Status */}
      <div className="hostel-room-header">
        <div className="hostel-room-title-group">
          <h4 className="hostel-room-number">Room {roomNumber}</h4>
          <span className="hostel-room-category">{category}</span>
        </div>
        <span className={`hostel-room-status ${statusClassName}`}>
          <span className="hostel-status-dot" />
          {status}
        </span>
      </div>

      {/* Details Grid: Block, Floor, Occupancy, Fee */}
      <div className="hostel-room-details">
        <div className="hostel-detail-item">
          <span className="hostel-detail-label">Block</span>
          <span className="hostel-detail-value">{blockLabel}</span>
        </div>

        <div className="hostel-detail-item">
          <span className="hostel-detail-label">Floor</span>
          <span className="hostel-detail-value">Floor {floor}</span>
        </div>

        <div className="hostel-detail-item">
          <span className="hostel-detail-label">Occupancy</span>
          <span className="hostel-detail-value">
            {occupiedBeds} / {capacity} Beds
          </span>
        </div>

        <div className="hostel-detail-item">
          <span className="hostel-detail-label">Semester Fee</span>
          <span className="hostel-detail-value hostel-fee-value">
            ₹{feePerSemester ? feePerSemester.toLocaleString('en-IN') : '0'}
          </span>
        </div>
      </div>

      {/* Footer Action */}
      <div className="hostel-room-footer">
        <button
          type="button"
          className="hostel-room-btn"
          onClick={handleDetailsClick}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default RoomCard;
