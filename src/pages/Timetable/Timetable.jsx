import React, { useState, useEffect } from 'react';
import { Calendar, LayoutGrid, Clock, MapPin, User, Coffee, Plus, Edit2, Trash2, X } from 'lucide-react';
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

function ClassCard({ slot, isCurrent, onEdit, onDelete }) {
  const typeClass = (slot.type || 'lecture').toLowerCase();
  return (
    <div className={`class-card type-${typeClass} ${isCurrent ? 'current-class' : ''}`}>
      <div className="class-card-header">
        <div>
          <p className="class-subject">{slot.subject}</p>
          <p className="class-code">{slot.code}</p>
        </div>
        <div className="class-badges" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span className={`type-badge ${typeClass}`}>{slot.type}</span>
          {isCurrent && <span className="current-badge">● Live</span>}
          {onEdit && (
            <button onClick={() => onEdit(slot)} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', padding: '2px' }} title="Edit">
              <Edit2 size={14} />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(slot.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }} title="Delete">
              <Trash2 size={14} />
            </button>
          )}
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
  const [nowMin, setNowMin] = useState(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  });

  const [schedule, setSchedule] = useState(() => {
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
        // Merge so Wednesday-Friday receive seed slots if missing in cached storage
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedNormalized));
    return seedNormalized;
  });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formData, setFormData] = useState({
    subject: '',
    code: '',
    faculty: '',
    room: '',
    type: 'Lecture',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    day: DAYS[activeDay]
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
  }, [schedule]);

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

  const isCurrent = (slot) => {
    if (activeDay !== todayIdx || slot.isBreak) return false;
    return nowMin >= timeToMin(slot.startTime) && nowMin < timeToMin(slot.endTime);
  };

  const handleOpenAdd = () => {
    setEditingSlot(null);
    setFormData({
      subject: '',
      code: 'CS301',
      faculty: '',
      room: 'LH-101',
      type: 'Lecture',
      startTime: '09:00 AM',
      endTime: '10:00 AM',
      day: DAYS[activeDay]
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (slot) => {
    setEditingSlot(slot);
    setFormData({
      ...slot,
      day: DAYS[activeDay]
    });
    setModalOpen(true);
  };

  const handleDelete = (slotId) => {
    const currentDayName = DAYS[activeDay];
    const updated = (schedule[currentDayName] || []).filter((s) => s.id !== slotId);
    setSchedule((prev) => ({ ...prev, [currentDayName]: updated }));
  };

  const handleSaveSlot = (e) => {
    e.preventDefault();
    const targetDay = formData.day;
    const slotData = normalizeSlot({
      ...formData,
      id: editingSlot ? editingSlot.id : 'slot_' + Date.now()
    });

    setSchedule((prev) => {
      const dayList = prev[targetDay] || [];
      let updated;
      if (editingSlot) {
        updated = dayList.map((s) => (s.id === editingSlot.id ? slotData : s));
      } else {
        updated = [...dayList, slotData];
      }
      return { ...prev, [targetDay]: updated };
    });

    setModalOpen(false);
  };

  return (
    <div className="timetable-page">
      {/* Header */}
      <div className="timetable-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="timetable-header-left">
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f8fafc' }}>Class Timetable</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Semester schedule — track and manage your classes</p>
        </div>
        <div className="timetable-header-actions" style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleOpenAdd}
            style={{ padding: '8px 16px', background: '#6366f1', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Add Class
          </button>
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
                        onEdit={handleOpenEdit}
                        onDelete={handleDelete}
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
                        const isLab = typeLower === 'lab';
                        return (
                          <div key={s.id} className={`week-class-card ${typeLower}`}>
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

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleSaveSlot} style={{ background: '#0f172a', padding: '24px', borderRadius: '16px', width: '420px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', color: '#f8fafc' }}>{editingSlot ? 'Edit Class' : 'Add Class'}</h3>
              <button type="button" onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Day</label>
              <select
                value={formData.day}
                onChange={(e) => setFormData((prev) => ({ ...prev, day: e.target.value }))}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }}
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Subject Name</label>
              <input
                type="text"
                placeholder="e.g. Operating Systems"
                value={formData.subject}
                onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #334155' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Code</label>
                <input
                  type="text"
                  placeholder="CS301"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #334155' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Class Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }}
                >
                  <option value="Lecture">Lecture</option>
                  <option value="Lab">Lab</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Faculty</label>
                <input
                  type="text"
                  placeholder="Dr. Priya Nair"
                  value={formData.faculty}
                  onChange={(e) => setFormData((prev) => ({ ...prev, faculty: e.target.value }))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #334155' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Room</label>
                <input
                  type="text"
                  placeholder="LH-101"
                  value={formData.room}
                  onChange={(e) => setFormData((prev) => ({ ...prev, room: e.target.value }))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #334155' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Start Time</label>
                <input
                  type="text"
                  placeholder="09:00 AM"
                  value={formData.startTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #334155' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>End Time</label>
                <input
                  type="text"
                  placeholder="10:00 AM"
                  value={formData.endTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #334155' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" onClick={() => setModalOpen(false)} style={{ padding: '8px 16px', background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ padding: '8px 16px', background: '#6366f1', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Save Class</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
