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

  // Load students data from localStorage or fallback to JSON file
  const [studentsList, setStudentsList] = useState(() => {
    try {
      const saved = localStorage.getItem('uv_students_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialStudents;
  });

  // Save to localStorage whenever studentsList changes
  useEffect(() => {
    localStorage.setItem('uv_students_data', JSON.stringify(studentsList));
  }, [studentsList]);

  // Find the logged-in student (fallback to STU001)
  const currentStudent = studentsList.find(s => s.id === (user?.id || 'STU001')) || studentsList[0];

  // Dynamic Attendance Calculation from uv_attendance_data_v2
  const [attendancePercentage, setAttendancePercentage] = useState(85.3);
  useEffect(() => {
    const savedAtt = localStorage.getItem('uv_attendance_data_v2');
    if (savedAtt) {
      try {
        const attMap = JSON.parse(savedAtt);
        const semKey = String(currentStudent?.semester).startsWith('Semester')
          ? currentStudent.semester
          : `Semester ${currentStudent?.semester || 6}`;
        const subjects = attMap[semKey] || attMap['Semester 6'] || Object.values(attMap)[0] || [];
        if (subjects.length > 0) {
          let totalClasses = 0;
          let attendedClasses = 0;
          subjects.forEach(subj => {
            const att = subj.attendedClasses !== undefined ? subj.attendedClasses : (subj.attended || 0);
            const tot = subj.totalClasses !== undefined ? subj.totalClasses : (subj.total || 0);
            totalClasses += tot;
            attendedClasses += att;
          });
          if (totalClasses > 0) {
            setAttendancePercentage(parseFloat(((attendedClasses / totalClasses) * 100).toFixed(1)));
          }
        }
      } catch (e) {}
    }
  }, [currentStudent?.semester]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Form State for editing personal/contact info (Strictly non-academic, read-only Name)
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    location: '',
    address: '',
    bio: '',
    skills: '',
    avatar: ''
  });

  // Open modal and prefill data
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

  // Save modified personal details
  const handleSave = (e) => {
    e.preventDefault();

    const updatedList = studentsList.map(s => {
      if (s.id === currentStudent.id) {
        return {
          ...s,
          phone: formData.phone,
          email: formData.email,
          location: formData.location,
          address: formData.address,
          bio: formData.bio,
          skills: formData.skills.split(',').map(sk => sk.trim()).filter(Boolean),
          avatar: formData.avatar
        };
      }
      return s;
    });

    setStudentsList(updatedList);

    // Sync updates with AuthContext to show in Topbar/Dashboard
    updateUser({
      email: formData.email,
      avatar: formData.avatar
    });

    setIsModalOpen(false);
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
    }, 3500);
  };

  // Helper: Initials
  const getInitials = (name) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Dynamic Profile Completion Calculation
  const completionItems = [
    {
      label: 'Basic Information (Name, Department, Roll No)',
      completed: !!(currentStudent.name && currentStudent.department && currentStudent.rollNo)
    },
    {
      label: 'Academic Information (CGPA, Credits)',
      completed: !!(currentStudent.cgpa && currentStudent.totalCredits && currentStudent.completedCredits)
    },
    {
      label: 'Contact & Address details (Phone, Email, Address)',
      completed: !!(currentStudent.phone && currentStudent.email && currentStudent.address)
    },
    {
      label: 'Personal Bio & Skills',
      completed: !!(currentStudent.bio && currentStudent.skills && currentStudent.skills.length > 0)
    }
  ];

  const completedCount = completionItems.filter(item => item.completed).length;
  const completionPercent = Math.round((completedCount / completionItems.length) * 100);

  return (
    <div className="profile-page">
      {/* PAGE HEADER */}
      <div className="profile-header">
        <div>
          <h1 className="profile-title">Student Profile</h1>
          <p className="profile-subtitle">View and update your student records and academic information.</p>
        </div>
      </div>

      {/* SUCCESS TOAST NOTIFICATION */}
      {successToast && (
        <div className="profile-alert-success">
          <Check size={18} /> Profile updated successfully
        </div>
      )}

      {/* 1. COMPACT STUDENT PROFILE HEADER CARD */}
      <div className="profile-hero">
        <div className="profile-hero-left">
          <div className="profile-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {currentStudent.avatar ? (
              <img src={currentStudent.avatar} alt={currentStudent.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              getInitials(currentStudent.name)
            )}
          </div>
          <div>
            <h2 className="profile-name">{currentStudent.name}</h2>
            <div className="profile-dept">
              {currentStudent.department} • Semester {currentStudent.semester} (Section {currentStudent.section || 'A'})
            </div>
            <div className="profile-meta-row">
              <span>Roll No: <strong style={{ color: 'var(--uv-text-primary)' }}>{currentStudent.rollNo}</strong></span>
              <span>•</span>
              <span>{currentStudent.email}</span>
            </div>
          </div>
        </div>

        <button onClick={handleOpenModal} className="edit-button">
          <Edit3 size={15} /> Edit Personal Info
        </button>
      </div>

      {/* TWO-COLUMN GRID */}
      <div className="profile-grid-two-col">
        
        {/* LEFT COLUMN: Academic, Completion, Skills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* 2. ACADEMIC OVERVIEW CARD */}
          <div className="profile-card">
            <h3 className="profile-card-title">
              <GraduationCap size={18} color="#6366f1" /> Academic Overview
            </h3>

            <div className="academic-info-grid">
              <div className="acad-info-box">
                <div className="acad-info-lbl">Current CGPA</div>
                <div className="acad-info-val" style={{ color: '#6366f1' }}>{currentStudent.cgpa}</div>
              </div>

              <div className="acad-info-box">
                <div className="acad-info-lbl">Attendance</div>
                <div className="acad-info-val" style={{ color: '#10b981' }}>{attendancePercentage}%</div>
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
                <div className="acad-info-val" style={{ color: '#06b6d4' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--uv-text-secondary)' }}>Overall Progress</span>
                <span className="completion-percentage">{completionPercent}%</span>
              </div>
              <div className="completion-bar-container">
                <div className="completion-bar-fill" style={{ width: `${completionPercent}%` }}></div>
              </div>
            </div>

            <div className="completion-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {completionItems.map((item, idx) => (
                <div key={idx} className="completion-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
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

          {/* 5. SKILLS CARD */}
          <div className="profile-card">
            <h3 className="profile-card-title">
              <Code size={18} color="#06b6d4" /> Skills & Expertise
            </h3>

            <div className="skills-wrap">
              {(currentStudent.skills && currentStudent.skills.length > 0) ? (
                currentStudent.skills.map((skill, idx) => (
                  <span key={idx} className="skill-badge">
                    {skill}
                  </span>
                ))
              ) : (
                <span style={{ color: 'var(--uv-text-muted)', fontSize: '13px' }}>No skills added. Click "Edit Personal Info" to add skills.</span>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Contact Info, Bio, Achievements, Certifications, Profiles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* 4. CONTACT & PERSONAL INFORMATION CARD */}
          <div className="profile-card">
            <h3 className="profile-card-title">
              <Mail size={18} color="#10b981" /> Personal & Contact Information
            </h3>

            <div className="contact-info-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div className="contact-item-row">
                <Mail size={16} color="var(--uv-primary)" style={{ flexShrink: 0 }} />
                <div>
                  <div className="acad-info-lbl">University Email</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--uv-text-primary)' }}>{currentStudent.email}</div>
                </div>
              </div>

              <div className="contact-item-row">
                <Phone size={16} color="var(--uv-success)" style={{ flexShrink: 0 }} />
                <div>
                  <div className="acad-info-lbl">Phone Number</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--uv-text-primary)' }}>{currentStudent.phone || 'Not Specified'}</div>
                </div>
              </div>

              <div className="contact-item-row">
                <MapPin size={16} color="var(--uv-warning)" style={{ flexShrink: 0 }} />
                <div>
                  <div className="acad-info-lbl">Current Location</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--uv-text-primary)' }}>{currentStudent.location || 'Chandigarh, India'}</div>
                </div>
              </div>

              {currentStudent.address && (
                <div className="contact-item-row">
                  <BookOpen size={16} color="#ec4899" style={{ flexShrink: 0 }} />
                  <div>
                    <div className="acad-info-lbl">Permanent Address</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--uv-text-primary)', lineHeight: '1.4' }}>{currentStudent.address}</div>
                  </div>
                </div>
              )}

              {currentStudent.hostelRoom && (
                <div className="contact-item-row">
                  <Home size={16} color="#6366f1" style={{ flexShrink: 0 }} />
                  <div>
                    <div className="acad-info-lbl">Hostel Accommodation</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--uv-text-primary)' }}>Room {currentStudent.hostelRoom}</div>
                  </div>
                </div>
              )}

              <div className="contact-item-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <div className="acad-info-lbl" style={{ marginBottom: '2px' }}>Biography</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--uv-text-secondary)', lineHeight: '1.5' }}>
                  {currentStudent.bio || 'Computer Science student passionate about software engineering.'}
                </p>
              </div>

            </div>
          </div>

          {/* 6. ACHIEVEMENTS CARD */}
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
                <span style={{ color: 'var(--uv-text-muted)', fontSize: '13px' }}>No achievements recorded.</span>
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
                <span style={{ color: 'var(--uv-text-muted)', fontSize: '13px' }}>No certifications listed.</span>
              )}
            </div>
          </div>

          {/* 8. PROFESSIONAL PROFILES CARD */}
          {currentStudent.socialLinks && (currentStudent.socialLinks.linkedin || currentStudent.socialLinks.github) && (
            <div className="profile-card">
              <h3 className="profile-card-title">
                <Globe size={18} color="#06b6d4" /> Professional Profiles
              </h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {currentStudent.socialLinks.linkedin && (
                  <a
                    href={currentStudent.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn linkedin-btn"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Link2 size={15} /> LinkedIn Profile
                  </a>
                )}
                {currentStudent.socialLinks.github && (
                  <a
                    href={currentStudent.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn github-btn"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Code size={15} /> GitHub Profile
                  </a>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      {isModalOpen && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--uv-text-primary)', margin: 0 }}>Edit Personal Information</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--uv-text-subtle)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              {/* READ ONLY STUDENT NAME & DETAILS AT TOP OF FORM */}
              <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--uv-border)', paddingBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--uv-text-subtle)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student Profile (Read-Only)</div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--uv-text-primary)', marginTop: '4px' }}>{currentStudent.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--uv-text-muted)', marginTop: '2px' }}>
                  Roll No: {currentStudent.rollNo} • {currentStudent.department}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label htmlFor="edit-email" className="acad-info-lbl" style={{ display: 'block', marginBottom: '4px' }}>Personal Email</label>
                  <input
                    id="edit-email"
                    type="email"
                    className="modal-input"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-phone" className="acad-info-lbl" style={{ display: 'block', marginBottom: '4px' }}>Phone Number</label>
                  <input
                    id="edit-phone"
                    type="text"
                    className="modal-input"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label htmlFor="edit-location" className="acad-info-lbl" style={{ display: 'block', marginBottom: '4px' }}>Location</label>
                  <input
                    id="edit-location"
                    type="text"
                    className="modal-input"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-avatar" className="acad-info-lbl" style={{ display: 'block', marginBottom: '4px' }}>Profile Image URL</label>
                  <input
                    id="edit-avatar"
                    type="text"
                    className="modal-input"
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.avatar}
                    onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
                  />
                </div>
              </div>

              <label htmlFor="edit-address" className="acad-info-lbl" style={{ display: 'block', marginBottom: '4px' }}>Permanent Address</label>
              <input
                id="edit-address"
                type="text"
                className="modal-input"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              />

              <label htmlFor="edit-bio" className="acad-info-lbl" style={{ display: 'block', marginBottom: '4px' }}>Biography</label>
              <textarea
                id="edit-bio"
                className="modal-input"
                style={{ resize: 'vertical', height: '60px', fontFamily: 'inherit' }}
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              />

              <label htmlFor="edit-skills" className="acad-info-lbl" style={{ display: 'block', marginBottom: '4px' }}>Skills (comma-separated)</label>
              <input
                id="edit-skills"
                type="text"
                className="modal-input"
                placeholder="React, Python, Machine Learning..."
                value={formData.skills}
                onChange={(e) => setFormData((prev) => ({ ...prev, skills: e.target.value }))}
              />

              {/* READ ONLY NOTE */}
              <div style={{ background: 'var(--uv-primary-light)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)', marginBottom: '16px', fontSize: '11px', color: 'var(--uv-primary)' }}>
                <strong>Note:</strong> Academic records (Name, Roll No, CGPA, Semester, Section, and Hostel room) can only be updated by the university administration.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', background: 'transparent', color: 'var(--uv-text-muted)', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', background: '#6366f1', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
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
