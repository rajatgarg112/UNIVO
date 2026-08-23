import React, { useState, useEffect } from 'react';
import { Calendar, LayoutGrid, Clock, MapPin, User, Coffee } from 'lucide-react';
import initialTimetableData from '../../data/timetable.json';
import './Timetable.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const STORAGE_KEY = 'uv_timetable_data';

/* Utility: parse "09:00" or "09:00 AM" to minutes */
function timeToMin(t = '') {
  if (!t) return 0;
  let timeStr = t.trim();
  let modifier = '';

  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    const parts = timeStr.split(' ');
    timeStr = parts[0];
    modifier = parts[1];
  }

  let [h, m] = timeStr.split(':').map(Number);
  if (isNaN(h)) h = 9;
  if (isNaN(m)) m = 0;

  if (modifier === 'PM' && h < 12) h += 12;
  if (modifier === 'AM' && h === 12) h = 0;

  return h * 60 + m;
}

function getTodayIndex() {
  const d = new Date().getDay(); // 0=Sun
  if (d === 0) return 0;
  return d - 1;
}

/* Safe format 12hr time */
function fmt12(t = '') {
  if (!t) return '9:00 AM';
  if (t.includes('AM') || t.includes('PM')) return t;

  let [h, m] = t.split(':').map(Number);
  if (isNaN(h)) return t;
  if (isNaN(m)) m = 0;

  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

/* Parse time string into startTime and endTime if stored as a range */
function normalizeSlot(slot) {
  let startTime = slot.startTime;
  let endTime = slot.endTime;

  if ((!startTime || !endTime) && slot.time) {
    const parts = slot.time.split('-').map((s) => s.trim());
    startTime = parts[0] || '09:00 AM';
    endTime = parts[1] || '10:00 AM';
  }

  return {
    id: slot.id || 'slot_' + Math.random().toString(36).substr(2, 9),
    subject: slot.subject || 'Class',
    code: slot.subjectCode || slot.code || 'CS101',
    faculty: slot.faculty || '',
    room: slot.room || '',
    type: slot.type || 'Lecture',
    startTime: startTime || '09:00 AM',
    endTime: endTime || '10:00 AM',
    isBreak: !!slot.isBreak
  };
}

function ClassCard({ slot, isCurrent, onClick }) {
  const typeClass = (slot.type || 'lecture').toLowerCase();
  return (
    <div
      className={`class-card type-${typeClass} ${isCurrent ? 'current-class' : ''}`}
      onClick={() => onClick && onClick(slot)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="class-card-header">
        <div>
          <p className="class-subject">{slot.subject}</p>
          <p className="class-code">{slot.code}</p>
        </div>
        <div className="class-badges" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span className={`type-badge ${typeClass}`}>{slot.type}</span>
          {isCurrent && <span className="current-badge">● Live</span>}
        </div>
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
          <Clock size={13} /> {fmt12(slot.startTime)} – {fmt12(slot.endTime)}
        </span>
      </div>
    </div>
  );
}

export default function Timetable() {
  const [activeDay, setActiveDay] = useState(getTodayIndex());
  const [viewMode, setViewMode] = useState('day'); // 'day' | 'week'
  const [selectedSlotDetails, setSelectedSlotDetails] = useState(null);
  const [nowMin, setNowMin] = useState(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  });

  const [schedule] = useState(() => {
    const rawMap = initialTimetableData.schedule || {};
    const seedNormalized = {};
    DAYS.forEach((d) => {
      const key = d.toLowerCase();
      seedNormalized[d] = (rawMap[key] || []).map(normalizeSlot);
    });

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = { ...seedNormalized };
        DAYS.forEach((d) => {
          if (parsed[d] && parsed[d].length > 0) {
            merged[d] = parsed[d];
          }
        });
        return merged;
      }
    } catch (e) {
      // Fallback
    }

    return seedNormalized;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const n = new Date();
      setNowMin(n.getHours() * 60 + n.getMinutes());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const todayIdx = getTodayIndex();

  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const dayDates = DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  });

  const daySlots = schedule[DAYS[activeDay]] || [];
  const todaySlots = schedule[DAYS[todayIdx]] || [];

  const isCurrent = (slot) => {
    if (activeDay !== todayIdx || slot.isBreak) return false;
    return nowMin >= timeToMin(slot.startTime) && nowMin < timeToMin(slot.endTime);
  };

  // Find next upcoming class for today
  const upcomingClassToday = todaySlots.find(
    (slot) => !slot.isBreak && timeToMin(slot.startTime) > nowMin
  );
  const currentClassToday = todaySlots.find(
    (slot) => !slot.isBreak && nowMin >= timeToMin(slot.startTime) && nowMin < timeToMin(slot.endTime)
  );

  return (
    <div className="timetable-page">
      {/* Header */}
      <div className="timetable-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div className="timetable-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--uv-text-primary)', margin: 0 }}>Class Timetable</h1>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'var(--uv-input-bg)',
              border: '1px solid var(--uv-border)',
              color: 'var(--uv-text-muted)',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              View-only • Official Faculty Schedule
            </span>
          </div>
          <p style={{ color: 'var(--uv-text-muted)', fontSize: '14px', margin: 0 }}>View your weekly class schedule and upcoming classes</p>
        </div>
        <div className="timetable-header-actions" style={{ display: 'flex', gap: '8px' }}>
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

      {/* Today's Schedule & Next Class Status Indicator Banner */}
      {(currentClassToday || upcomingClassToday) && (
        <div style={{
          background: 'var(--uv-bg-card)',
          border: '1px solid var(--uv-border)',
          borderLeft: '4px solid var(--uv-primary)',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          gap: '12px',
          boxShadow: 'var(--uv-card-shadow)',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={18} style={{ color: 'var(--uv-primary)' }} />
            <div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--uv-text-primary)' }}>
                {currentClassToday ? 'Live Now:' : 'Next Upcoming Class:'}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--uv-text-muted)', marginLeft: '6px' }}>
                {currentClassToday
                  ? `${currentClassToday.subject} (${currentClassToday.code}) in Room ${currentClassToday.room}`
                  : `${upcomingClassToday.subject} (${upcomingClassToday.code}) at ${fmt12(upcomingClassToday.startTime)} in Room ${upcomingClassToday.room}`}
              </span>
            </div>
          </div>
          <span className="type-badge lecture" style={{ fontSize: '11px' }}>
            {currentClassToday ? currentClassToday.type : upcomingClassToday.type}
          </span>
        </div>
      )}

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
              <Calendar size={40} color="var(--uv-primary)" style={{ marginBottom: '12px' }} />
              <p>No classes scheduled for {DAYS[activeDay]}</p>
            </div>
          ) : (
            <div className="schedule-view">
              {daySlots.map((slot, idx) => {
                const current = isCurrent(slot);
                const isLast = idx === daySlots.length - 1;
                return (
                  <div className="schedule-slot" key={slot.id || idx}>
                    <div className="slot-time-col">
                      <span className="slot-time-start">{fmt12(slot.startTime)}</span>
                      <span className="slot-time-end">{fmt12(slot.endTime)}</span>
                    </div>
                    <div className="slot-timeline">
                      <div className={`slot-dot ${current ? 'current-dot' : ''}`} />
                      {!isLast && <div className="slot-line" />}
                    </div>
                    <div className="slot-card-col">
                      <ClassCard
                        slot={slot}
                        isCurrent={current}
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
              const dayClasses = schedule[dayName] || [];
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
                              <span className="week-card-code">{s.code}</span>
                            </div>

                            <div className="week-card-meta">
                              <div className="week-card-time">
                                <Clock size={11} /> {fmt12(s.startTime)} – {fmt12(s.endTime)}
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: 'var(--uv-bg-card)', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '400px', border: '1px solid var(--uv-border)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className={`type-badge ${(selectedSlotDetails.type || 'lecture').toLowerCase()}`} style={{ display: 'inline-block', marginBottom: '6px' }}>
                  {selectedSlotDetails.type}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--uv-text-primary)', margin: 0 }}>{selectedSlotDetails.subject}</h3>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--uv-primary)' }}>{selectedSlotDetails.code}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--uv-input-bg)', padding: '14px', borderRadius: '12px', border: '1px solid var(--uv-border)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--uv-text-secondary)' }}>
                <Clock size={16} style={{ color: 'var(--uv-primary)' }} />
                <span><strong>Time:</strong> {fmt12(selectedSlotDetails.startTime)} – {fmt12(selectedSlotDetails.endTime)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--uv-text-secondary)' }}>
                <MapPin size={16} style={{ color: 'var(--uv-info)' }} />
                <span><strong>Room:</strong> {selectedSlotDetails.room}</span>
              </div>
              {selectedSlotDetails.faculty && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--uv-text-secondary)' }}>
                  <User size={16} style={{ color: 'var(--uv-success)' }} />
                  <span><strong>Faculty:</strong> {selectedSlotDetails.faculty}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedSlotDetails(null)}
                style={{ padding: '8px 20px', background: 'var(--uv-primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
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

