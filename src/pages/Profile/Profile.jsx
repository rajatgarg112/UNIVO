import React, { useState, useEffect } from 'react';
import {
  GraduationCap, Mail, Phone, MapPin, Code,
  Edit3, Check, X, Award, FileText, Globe, Link2, CheckCircle2, Circle, BookOpen, Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import initialStudents from '../../data/students.json';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();

  // ─── STUDENTS DATA PERSISTENCE ─────────────────────────────────────────────
  const [studentsList, setStudentsList] = useState(() => {
    try {
      const saved = localStorage.getItem('uv_students_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialStudents;
  });

  useEffect(() => {
    localStorage.setItem('uv_students_data', JSON.stringify(studentsList));
  }, [studentsList]);

  // Current logged-in student record
  const currentStudent = studentsList.find(s => s.id === (user?.id || 'STU001')) || studentsList[0];

  // ─── ATTENDANCE CALCULATION ───────────────────────────────────────────────
  const [attendancePercentage, setAttendancePercentage] = useState(85.3);

  useEffect(() => {
    try {
      const savedAtt = localStorage.getItem('uv_attendance_data_v2');
      if (!savedAtt) return;

      const attMap = JSON.parse(savedAtt);
      const semKey = String(currentStudent?.semester).startsWith('Semester')
        ? currentStudent.semester
        : `Semester ${currentStudent?.semester || 6}`;

      const subjects = attMap[semKey] || attMap['Semester 6'] || Object.values(attMap)[0] || [];

      let totalClasses = 0;
      let attendedClasses = 0;
      subjects.forEach(subj => {
        totalClasses += subj.attendedClasses ?? subj.totalClasses ?? subj.total ?? 0;
        attendedClasses += subj.attendedClasses ?? subj.attended ?? 0;
      });

      if (totalClasses > 0) {
        setAttendancePercentage(parseFloat(((attendedClasses / totalClasses) * 100).toFixed(1)));
      }
    } catch (e) {}
  }, [currentStudent?.semester]);

  // ─── MODAL & FORM STATE ───────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    location: '',
    address: '',
    bio: '',
    skills: '',
    avatar: ''
  });

  const handleOpenModal = () => {
    setFormData({
      phone: currentStudent.phone || '',
      email: currentStudent.email || '',
      location: currentStudent.location || 'Chandigarh, India',
      address: currentStudent.address || '',
      bio: currentStudent.bio || 'Computer Science student passionate about technology.',
      skills: (currentStudent.skills || []).join(', '),
      avatar: currentStudent.avatar || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const updatedList = studentsList.map(s => {
      if (s.id !== currentStudent.id) return s;
      return {
        ...s,
        phone: formData.phone,
        email: formData.email,
        location: formData.location,
        address: formData.address,
        bio: formData.bio,
        skills: formData.skills.split(',').map(item => item.trim()).filter(Boolean),
        avatar: formData.avatar
      };
    });

    setStudentsList(updatedList);
    updateUser({ email: formData.email, avatar: formData.avatar });
    setIsModalOpen(false);

    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3500);
  };

  // Helper for student initials avatar fallback
  const initials = currentStudent.name
    ? currentStudent.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'ST';

  // ─── PROFILE COMPLETION CALCULATIONS ──────────────────────────────────────
  const completionItems = [
    {
      label: 'Basic Information (Name, Department, Roll No)',
      completed: Boolean(currentStudent.name && currentStudent.department && currentStudent.rollNo)
    },
    {
      label: 'Academic Information (CGPA, Credits)',
      completed: Boolean(currentStudent.cgpa && currentStudent.totalCredits && currentStudent.completedCredits)
    },
    {
      label: 'Contact & Address details (Phone, Email, Address)',
      completed: Boolean(currentStudent.phone && currentStudent.email && currentStudent.address)
    },
    {
      label: 'Personal Bio & Skills',
      completed: Boolean(currentStudent.bio && currentStudent.skills && currentStudent.skills.length > 0)
    }
  ];

  const completedCount = completionItems.filter(item => item.completed).length;
  const completionPercent = Math.round((completedCount / completionItems.length) * 100);

  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="profile-page">

      {/* ── PAGE HEADER ── */}
      <div className="profile-header">
        <div>
          <h1 className="profile-title">Student Profile</h1>
          <p className="profile-subtitle">View and update your student records and academic information.</p>
        </div>
      </div>

      {/* ── SUCCESS TOAST NOTIFICATION ── */}
      {successToast && (
        <div className="profile-alert-success">
          <Check size={18} /> Profile updated successfully
        </div>
      )}

      {/* ── 1. STUDENT PROFILE HEADER CARD ── */}
      <div className="profile-hero">
        <div className="profile-hero-left">
          <div className="profile-avatar">
            {currentStudent.avatar ? (
              <img src={currentStudent.avatar} alt={currentStudent.name} className="profile-avatar-img" />
            ) : (
              initials
            )}
          </div>
          <div>
            <h2 className="profile-name">{currentStudent.name}</h2>
            <div className="profile-dept">
              {currentStudent.department} • Semester {currentStudent.semester} (Section {currentStudent.section || 'A'})
            </div>
            <div className="profile-meta-row">
              <span>Roll No: <strong className="meta-roll-highlight">{currentStudent.rollNo}</strong></span>
              <span>•</span>
              <span>{currentStudent.email}</span>
            </div>
          </div>
        </div>

        <button onClick={handleOpenModal} className="edit-button">
          <Edit3 size={15} /> Edit Personal Info
        </button>
      </div>

      {/* ── TWO-COLUMN MAIN GRID ── */}
      <div className="profile-grid-two-col">

        {/* ── LEFT COLUMN ── */}
        <div className="profile-col-stack">

          {/* 2. ACADEMIC OVERVIEW CARD */}
          <div className="profile-card">
            <h3 className="profile-card-title">
              <GraduationCap size={18} color="#6366f1" /> Academic Overview
            </h3>

            <div className="academic-info-grid">
              <div className="acad-info-box">
                <div className="acad-info-lbl">Current CGPA</div>
                <div className="acad-info-val acad-color-cgpa">{currentStudent.cgpa}</div>
              </div>

              <div className="acad-info-box">
                <div className="acad-info-lbl">Attendance</div>
                <div className="acad-info-val acad-color-att">{attendancePercentage}%</div>
              </div>

              <div className="acad-info-box">
                <div className="acad-info-lbl">Semester</div>
                <div className="acad-info-val">Semester {currentStudent.semester}</div>
              </div>

              <div className="acad-info-box">
                <div className="acad-info-lbl">Section</div>
                <div className="acad-info-val">Section {currentStudent.section || 'A'}</div>
              </div>

              <div className="acad-info-box">
                <div className="acad-info-lbl">Academic Year</div>
                <div className="acad-info-val">Year {currentStudent.year || '3'}</div>
              </div>

              <div className="acad-info-box">
                <div className="acad-info-lbl">Credits Completed</div>
                <div className="acad-info-val acad-color-credits">
                  {currentStudent.completedCredits} / {currentStudent.totalCredits || '180'}
                </div>
              </div>
            </div>
          </div>

          {/* 3. PROFILE COMPLETION CARD */}
          <div className="profile-card">
            <h3 className="profile-card-title">
              <CheckCircle2 size={18} color="#10b981" /> Profile Completion
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <div className="completion-header">
                <span className="completion-title">Overall Progress</span>
                <span className="completion-percentage">{completionPercent}%</span>
              </div>
              <div className="completion-bar-container">
                <div className="completion-bar-fill" style={{ width: `${completionPercent}%` }} />
              </div>
            </div>

            <div className="completion-items-list">
              {completionItems.map((item, idx) => (
                <div key={idx} className="completion-item">
                  {item.completed ? (
                    <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0 }} />
                  ) : (
                    <Circle size={16} color="var(--uv-text-muted)" style={{ flexShrink: 0 }} />
                  )}
                  <span style={{ color: item.completed ? 'var(--uv-text-primary)' : 'var(--uv-text-muted)' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. SKILLS & EXPERTISE CARD */}
          <div className="profile-card">
            <h3 className="profile-card-title">
              <Code size={18} color="#06b6d4" /> Skills & Expertise
            </h3>

            <div className="skills-wrap">
              {currentStudent.skills && currentStudent.skills.length > 0 ? (
                currentStudent.skills.map((skill, idx) => (
                  <span key={idx} className="skill-badge">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="profile-empty-text">No skills added. Click "Edit Personal Info" to add skills.</span>
              )}
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="profile-col-stack">

          {/* 4. PERSONAL & CONTACT INFORMATION CARD */}
          <div className="profile-card">
            <h3 className="profile-card-title">
              <Mail size={18} color="#10b981" /> Personal & Contact Information
            </h3>

            <div className="contact-info-list">
              
              <div className="contact-item-row">
                <Mail size={16} color="var(--uv-primary)" style={{ flexShrink: 0 }} />
                <div>
                  <div className="acad-info-lbl">University Email</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--uv-text-primary)' }}>
                    {currentStudent.email}
                  </div>
                </div>
              </div>

              <div className="contact-item-row">
                <Phone size={16} color="var(--uv-success)" style={{ flexShrink: 0 }} />
                <div>
                  <div className="acad-info-lbl">Phone Number</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--uv-text-primary)' }}>
                    {currentStudent.phone || 'Not Specified'}
                  </div>
                </div>
              </div>

              <div className="contact-item-row">
                <MapPin size={16} color="var(--uv-warning)" style={{ flexShrink: 0 }} />
                <div>
                  <div className="acad-info-lbl">Current Location</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--uv-text-primary)' }}>
                    {currentStudent.location || 'Chandigarh, India'}
                  </div>
                </div>
              </div>

              {currentStudent.address && (
                <div className="contact-item-row">
                  <BookOpen size={16} color="#ec4899" style={{ flexShrink: 0 }} />
                  <div>
                    <div className="acad-info-lbl">Permanent Address</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--uv-text-primary)', lineHeight: '1.4' }}>
                      {currentStudent.address}
                    </div>
                  </div>
                </div>
              )}

              {currentStudent.hostelRoom && (
                <div className="contact-item-row">
                  <Home size={16} color="#6366f1" style={{ flexShrink: 0 }} />
                  <div>
                    <div className="acad-info-lbl">Hostel Accommodation</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--uv-text-primary)' }}>
                      Room {currentStudent.hostelRoom}
                    </div>
                  </div>
                </div>
              )}

              <div className="contact-item-row contact-bio-box">
                <div className="acad-info-lbl" style={{ marginBottom: '2px' }}>Biography</div>
                <p className="contact-bio-text">
                  {currentStudent.bio || 'Computer Science student passionate about software engineering.'}
                </p>
              </div>

            </div>
          </div>

          {/* 6. KEY ACHIEVEMENTS CARD */}
          <div className="profile-card">
            <h3 className="profile-card-title">
              <Award size={18} color="#f59e0b" /> Key Achievements
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentStudent.achievements && currentStudent.achievements.length > 0 ? (
                currentStudent.achievements.map((ach, idx) => (
                  <div key={idx} className="profile-list-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px' }}>
                    <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>•</span>
                    <span style={{ color: 'var(--uv-text-secondary)' }}>{ach}</span>
                  </div>
                ))
              ) : (
                <span className="profile-empty-text">No achievements recorded.</span>
              )}
            </div>
          </div>

          {/* 7. CERTIFICATIONS CARD */}
          <div className="profile-card">
            <h3 className="profile-card-title">
              <FileText size={18} color="#a855f7" /> Certifications
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentStudent.certificates && currentStudent.certificates.length > 0 ? (
                currentStudent.certificates.map((cert, idx) => (
                  <div key={idx} className="profile-list-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px' }}>
                    <span style={{ color: '#a855f7', fontWeight: 'bold' }}>•</span>
                    <span style={{ color: 'var(--uv-text-secondary)' }}>{cert}</span>
                  </div>
                ))
              ) : (
                <span className="profile-empty-text">No certifications listed.</span>
              )}
            </div>
          </div>

          {/* 8. PROFESSIONAL PROFILES CARD */}
          {currentStudent.socialLinks && (currentStudent.socialLinks.linkedin || currentStudent.socialLinks.github) && (
            <div className="profile-card">
              <h3 className="profile-card-title">
                <Globe size={18} color="#06b6d4" /> Professional Profiles
              </h3>
              <div className="social-links-wrap">
                {currentStudent.socialLinks.linkedin && (
                  <a
                    href={currentStudent.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn linkedin-btn social-btn-link"
                  >
                    <Link2 size={15} /> LinkedIn Profile
                  </a>
                )}
                {currentStudent.socialLinks.github && (
                  <a
                    href={currentStudent.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn github-btn social-btn-link"
                  >
                    <Code size={15} /> GitHub Profile
                  </a>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ── EDIT PROFILE MODAL ── */}
      {isModalOpen && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-card">

            <div className="modal-header-row">
              <h3 className="modal-title-text">Edit Personal Information</h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn-icon">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>

              {/* Read-only student profile summary */}
              <div className="modal-readonly-header">
                <div className="modal-readonly-tag">Student Profile (Read-Only)</div>
                <div className="modal-readonly-name">{currentStudent.name}</div>
                <div className="modal-readonly-meta">
                  Roll No: {currentStudent.rollNo} • {currentStudent.department}
                </div>
              </div>

              <div className="modal-grid-2col">
                <div>
                  <label htmlFor="edit-email" className="acad-info-lbl modal-field-lbl">Personal Email</label>
                  <input
                    id="edit-email"
                    type="email"
                    className="modal-input"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-phone" className="acad-info-lbl modal-field-lbl">Phone Number</label>
                  <input
                    id="edit-phone"
                    type="text"
                    className="modal-input"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="modal-grid-2col">
                <div>
                  <label htmlFor="edit-location" className="acad-info-lbl modal-field-lbl">Location</label>
                  <input
                    id="edit-location"
                    type="text"
                    className="modal-input"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-avatar" className="acad-info-lbl modal-field-lbl">Profile Image URL</label>
                  <input
                    id="edit-avatar"
                    type="text"
                    className="modal-input"
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.avatar}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                  />
                </div>
              </div>

              <label htmlFor="edit-address" className="acad-info-lbl modal-field-lbl">Permanent Address</label>
              <input
                id="edit-address"
                type="text"
                className="modal-input"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />

              <label htmlFor="edit-bio" className="acad-info-lbl modal-field-lbl">Biography</label>
              <textarea
                id="edit-bio"
                className="modal-input modal-textarea"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              />

              <label htmlFor="edit-skills" className="acad-info-lbl modal-field-lbl">Skills (comma-separated)</label>
              <input
                id="edit-skills"
                type="text"
                className="modal-input"
                placeholder="React, Python, Machine Learning..."
                value={formData.skills}
                onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
              />

              {/* Read-only note */}
              <div className="modal-note-box">
                <strong>Note:</strong> Academic records (Name, Roll No, CGPA, Semester, Section, and Hostel room) can only be updated by the university administration.
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-modal-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modal-save"
                >
                  Save Profile
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
