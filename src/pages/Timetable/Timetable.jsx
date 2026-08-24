import React, { useState } from 'react';
import { Calendar, LayoutGrid, Clock, MapPin, User, Coffee } from 'lucide-react';
import initialTimetableData from '../../data/timetable.json';
import './Timetable.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getTodayIndex() {
  const day = new Date().getDay();
  return day === 0 ? 0 : day - 1;
}

function ClassCard({ slot, onClick }) {
  const typeClass = (slot.type || 'lecture').toLowerCase();
  const startTime = slot.startTime || (slot.time ? slot.time.split('-')[0].trim() : '');
  const endTime = slot.endTime || (slot.time ? slot.time.split('-')[1].trim() : '');

  return (
    <div
      className={`class-card type-${typeClass}`}
      onClick={() => onClick && onClick(slot)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="class-card-header">
        <div>
          <p className="class-subject">{slot.subject}</p>
          <p className="class-code">{slot.code || slot.subjectCode}</p>
        </div>
        <span className={`type-badge ${typeClass}`}>{slot.type}</span>
      </div>
      <div className="class-meta">
        {slot.faculty && (
          <span className="class-meta-item">
            <User size={13} /> {slot.faculty}
          </span>
        )}
        {slot.room && (
          <span className="class-meta-item">
            <MapPin size={13} /> Room {slot.room}
          </span>
        )}
        <span className="class-meta-item">
          <Clock size={13} /> {slot.time || `${startTime} – ${endTime}`}
        </span>
      </div>
    </div>
  );
}

export default function Timetable() {
  const [activeDay, setActiveDay] = useState(getTodayIndex());
  const [viewMode, setViewMode] = useState('day'); // 'day' | 'week'
  const [selectedSlotDetails, setSelectedSlotDetails] = useState(null);

  const schedule = initialTimetableData.schedule || {};

  const todayIdx = getTodayIndex();
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  const dayDates = DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  });

  const activeDayName = DAYS[activeDay].toLowerCase();
  const daySlots = schedule[activeDayName] || [];

  return (
    <div className="timetable-page">
      {/* Header */}
      <div className="timetable-header">
        <div className="timetable-header-left">
          <div className="timetable-header-left-box">
            <h1 className="timetable-title">Class Timetable</h1>
            <span className="timetable-view-badge">
              View-only • Official Faculty Schedule
            </span>
          </div>
          <p className="timetable-subtitle">View your weekly class schedule and upcoming classes</p>
        </div>

        <div className="timetable-header-actions">
          <button
            className={`tt-action-btn ${viewMode === 'day' ? 'active' : ''}`}
            onClick={() => setViewMode('day')}
          >
            <Clock size={15} /> Day View
          </button>
          <button
            className={`tt-action-btn ${viewMode === 'week' ? 'active' : ''}`}
            onClick={() => setViewMode('week')}
          >
            <LayoutGrid size={15} /> Week View
          </button>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="day-tabs">
        {DAYS.map((day, i) => (
          <button
            key={day}
            className={`day-tab ${activeDay === i ? 'active' : ''} ${i === todayIdx ? 'today-tab' : ''}`}
            onClick={() => setActiveDay(i)}
          >
            <span className="day-tab-name">{DAY_SHORT[i]}</span>
            <span className="day-tab-date">{dayDates[i]}</span>
            {i === todayIdx && <span className="today-dot" />}
          </button>
        ))}
      </div>

      {/* Day View */}
      {viewMode === 'day' && (
        <>
          {daySlots.length === 0 ? (
            <div className="schedule-empty">
              <Calendar size={40} className="schedule-empty-icon" />
              <p>No classes scheduled for {DAYS[activeDay]}</p>
            </div>
          ) : (
            <div className="schedule-view">
              {daySlots.map((slot, idx) => {
                const isLast = idx === daySlots.length - 1;
                const times = (slot.time || '').split('-').map((t) => t.trim());
                return (
                  <div className="schedule-slot" key={slot.id || idx}>
                    <div className="slot-time-col">
                      <span className="slot-time-start">{times[0] || '09:00 AM'}</span>
                      <span className="slot-time-end">{times[1] || '10:00 AM'}</span>
                    </div>
                    <div className="slot-timeline">
                      <div className="slot-dot" />
                      {!isLast && <div className="slot-line" />}
                    </div>
                    <div className="slot-card-col">
                      <ClassCard
                        slot={slot}
                        onClick={(s) => setSelectedSlotDetails(s)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="week-view-container">
          <div className="week-grid">
            {DAYS.map((dayName) => {
              const dayClasses = schedule[dayName.toLowerCase()] || [];
              const isSaturdayOff = dayName === 'Saturday' && dayClasses.length === 0;

              return (
                <div key={dayName} className="week-day-column">
                  <div className="week-day-header">
                    <span className="week-day-title">{dayName}</span>
                    <span className="week-day-count">
                      {isSaturdayOff ? 'Off Day' : `${dayClasses.length} Class${dayClasses.length !== 1 ? 'es' : ''}`}
                    </span>
                  </div>

                  <div className="week-day-body">
                    {dayClasses.length === 0 ? (
                      <div className="week-off-day-box">
                        <Coffee size={20} className="off-day-icon" />
                        <span>Off Day</span>
                        <span className="off-day-sub">No classes</span>
                      </div>
                    ) : (
                      dayClasses.map((s) => {
                        const typeLower = (s.type || 'lecture').toLowerCase();
                        return (
                          <div
                            key={s.id}
                            className={`week-class-card ${typeLower}`}
                            onClick={() => setSelectedSlotDetails(s)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="week-card-top">
                              <span className="week-card-subject">{s.subject}</span>
                              <span className="week-card-code">{s.code || s.subjectCode}</span>
                            </div>

                            <div className="week-card-meta">
                              <div className="week-card-time">
                                <Clock size={11} /> {s.time}
                              </div>
                              <div className="week-card-room">
                                <MapPin size={11} /> Room {s.room}
                              </div>
                              {s.faculty && (
                                <div className="week-card-faculty">
                                  <User size={11} /> {s.faculty}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Read-Only Class Details Modal */}
      {selectedSlotDetails && (
        <div className="timetable-modal-overlay">
          <div className="timetable-modal-card">
            <div className="timetable-modal-header">
              <div>
                <span className={`type-badge ${(selectedSlotDetails.type || 'lecture').toLowerCase()} timetable-modal-badge`}>
                  {selectedSlotDetails.type}
                </span>
                <h3 className="timetable-modal-subject">{selectedSlotDetails.subject}</h3>
                <span className="timetable-modal-code">{selectedSlotDetails.code || selectedSlotDetails.subjectCode}</span>
              </div>
            </div>

            <div className="timetable-modal-body">
              <div className="timetable-modal-row">
                <Clock size={16} className="icon-clock" />
                <span><strong>Time:</strong> {selectedSlotDetails.time}</span>
              </div>
              <div className="timetable-modal-row">
                <MapPin size={16} className="icon-room" />
                <span><strong>Room:</strong> {selectedSlotDetails.room}</span>
              </div>
              {selectedSlotDetails.faculty && (
                <div className="timetable-modal-row">
                  <User size={16} className="icon-user" />
                  <span><strong>Faculty:</strong> {selectedSlotDetails.faculty}</span>
                </div>
              )}
            </div>

            <div className="timetable-modal-actions">
              <button
                type="button"
                onClick={() => setSelectedSlotDetails(null)}
                className="timetable-modal-close-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
