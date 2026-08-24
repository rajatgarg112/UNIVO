import React, { useEffect, useState } from 'react';
import {
  Award, BookOpen, Check, CheckCircle2, Circle, Code, Edit3, FileText,
  Globe, GraduationCap, Home, Link2, Mail, MapPin, Phone, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import initialStudents from '../../data/students.json';
import './Profile.css';

const getSavedData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

function Card({ icon: Icon, color, title, children }) {
  return (
    <div className="profile-card">
      <h3 className="profile-card-title">
        <Icon size={18} color={color} /> {title}
      </h3>
      {children}
    </div>
  );
}

function InfoBox({ label, value, className = '' }) {
  return (
    <div className="acad-info-box">
      <div className="acad-info-lbl">{label}</div>
      <div className={`acad-info-val ${className}`}>{value}</div>
    </div>
  );
}

function ContactItem({ icon: Icon, color, label, value, children }) {
  return (
    <div className="contact-item-row">
      <Icon size={16} color={color} style={{ flexShrink: 0 }} />
      <div>
        <div className="acad-info-lbl">{label}</div>
        {children || (
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>
            {value}
          </div>
        )}
      </div>
    </div>
  );
}

function SimpleListCard({ icon: Icon, color, title, items, emptyText }) {
  return (
    <Card icon={Icon} color={color} title={title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items?.length ? items.map((item, index) => (
          <div key={index} className="profile-list-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px' }}>
            <span style={{ color, fontWeight: 'bold' }}>•</span>
            <span style={{ color: '#cbd5e1' }}>{item}</span>
          </div>
        )) : <span className="profile-empty-text">{emptyText}</span>}
      </div>
    </Card>
  );
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [studentsList, setStudentsList] = useState(() => getSavedData('uv_students_data', initialStudents));
  const [attendancePercentage, setAttendancePercentage] = useState(85.3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [formData, setFormData] = useState({
    phone: '', email: '', location: '', address: '', bio: '', skills: '', avatar: ''
  });

  useEffect(() => {
    localStorage.setItem('uv_students_data', JSON.stringify(studentsList));
  }, [studentsList]);

  const currentStudent = studentsList.find(s => s.id === (user?.id || 'STU001')) || studentsList[0];

  useEffect(() => {
    const attMap = getSavedData('uv_attendance_data_v2', null);
    if (!attMap) return;

    const semester = String(currentStudent?.semester || '6');
    const semKey = semester.startsWith('Semester') ? semester : `Semester ${semester}`;
    const subjects = attMap[semKey] || attMap['Semester 6'] || Object.values(attMap)[0] || [];

    let total = 0;
    let attended = 0;
    subjects.forEach(subject => {
      total += subject.attendedClasses ?? subject.totalClasses ?? subject.total ?? 0;
      attended += subject.attendedClasses ?? subject.attended ?? 0;
    });

    if (total) setAttendancePercentage(Number(((attended / total) * 100).toFixed(1)));
  }, [currentStudent?.semester]);

  const openModal = () => {
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

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = event => {
    event.preventDefault();
    const updatedStudent = {
      ...currentStudent,
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
    };

    setStudentsList(list => list.map(student => (
      student.id === currentStudent.id ? updatedStudent : student
    )));
    updateUser({ email: formData.email, avatar: formData.avatar });
    setIsModalOpen(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3500);
  };

  const initials = currentStudent.name
    ? currentStudent.name.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)
    : 'ST';

  const completionItems = [
    ['Basic Information (Name, Department, Roll No)', currentStudent.name && currentStudent.department && currentStudent.rollNo],
    ['Academic Information (CGPA, Credits)', currentStudent.cgpa && currentStudent.totalCredits && currentStudent.completedCredits],
    ['Contact & Address details (Phone, Email, Address)', currentStudent.phone && currentStudent.email && currentStudent.address],
    ['Personal Bio & Skills', currentStudent.bio && currentStudent.skills?.length > 0]
  ].map(([label, completed]) => ({ label, completed: Boolean(completed) }));

  const completionPercent = Math.round(
    completionItems.filter(item => item.completed).length / completionItems.length * 100
  );

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <h1 className="profile-title">Student Profile</h1>
          <p className="profile-subtitle">View and update your student records and academic information.</p>
        </div>
      </div>

      {successToast && (
        <div className="profile-alert-success">
          <Check size={18} /> Profile updated successfully
        </div>
      )}

      <div className="profile-hero">
        <div className="profile-hero-left">
          <div className="profile-avatar">
            {currentStudent.avatar ? (
              <img src={currentStudent.avatar} alt={currentStudent.name} className="profile-avatar-img" />
            ) : initials}
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
        <button onClick={openModal} className="edit-button">
          <Edit3 size={15} /> Edit Personal Info
        </button>
      </div>

      <div className="profile-grid-two-col">
        <div className="profile-col-stack">
          <Card icon={GraduationCap} color="#6366f1" title="Academic Overview">
            <div className="academic-info-grid">
              <InfoBox label="Current CGPA" value={currentStudent.cgpa} className="acad-color-cgpa" />
              <InfoBox label="Attendance" value={`${attendancePercentage}%`} className="acad-color-att" />
              <InfoBox label="Semester" value={`Semester ${currentStudent.semester}`} />
              <InfoBox label="Section" value={`Section ${currentStudent.section || 'A'}`} />
              <InfoBox label="Academic Year" value={`Year ${currentStudent.year || '3'}`} />
              <InfoBox label="Credits Completed" value={`${currentStudent.completedCredits} / ${currentStudent.totalCredits || '180'}`} className="acad-color-credits" />
            </div>
          </Card>

          <Card icon={CheckCircle2} color="#10b981" title="Profile Completion">
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
              {completionItems.map((item, index) => (
                <div key={index} className="completion-item">
                  {item.completed ? (
                    <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0 }} />
                  ) : (
                    <Circle size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                  )}
                  <span style={{ color: item.completed ? '#f8fafc' : '#94a3b8' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card icon={Code} color="#06b6d4" title="Skills & Expertise">
            <div className="skills-wrap">
              {currentStudent.skills?.length ? currentStudent.skills.map((skill, index) => (
                <span key={index} className="skill-badge">{skill}</span>
              )) : (
                <span className="profile-empty-text">No skills added. Click "Edit Personal Info" to add skills.</span>
              )}
            </div>
          </Card>
        </div>

        <div className="profile-col-stack">
          <Card icon={Mail} color="#10b981" title="Personal & Contact Information">
            <div className="contact-info-list">
              <ContactItem icon={Mail} color="#6366f1" label="University Email" value={currentStudent.email} />
              <ContactItem icon={Phone} color="#10b981" label="Phone Number" value={currentStudent.phone || 'Not Specified'} />
              <ContactItem icon={MapPin} color="#f59e0b" label="Current Location" value={currentStudent.location || 'Chandigarh, India'} />

              {currentStudent.address && (
                <ContactItem icon={BookOpen} color="#ec4899" label="Permanent Address">
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc', lineHeight: '1.4' }}>
                    {currentStudent.address}
                  </div>
                </ContactItem>
              )}

              {currentStudent.hostelRoom && (
                <ContactItem icon={Home} color="#6366f1" label="Hostel Accommodation" value={`Room ${currentStudent.hostelRoom}`} />
              )}

              <div className="contact-item-row contact-bio-box">
                <div className="acad-info-lbl" style={{ marginBottom: '2px' }}>Biography</div>
                <p className="contact-bio-text">
                  {currentStudent.bio || 'Computer Science student passionate about software engineering.'}
                </p>
              </div>
            </div>
          </Card>

          <SimpleListCard
            icon={Award}
            color="#f59e0b"
            title="Key Achievements"
            items={currentStudent.achievements}
            emptyText="No achievements recorded."
          />

          <SimpleListCard
            icon={FileText}
            color="#a855f7"
            title="Certifications"
            items={currentStudent.certificates}
            emptyText="No certifications listed."
          />

          {currentStudent.socialLinks && (currentStudent.socialLinks.linkedin || currentStudent.socialLinks.github) && (
            <Card icon={Globe} color="#06b6d4" title="Professional Profiles">
              <div className="social-links-wrap">
                {currentStudent.socialLinks.linkedin && (
                  <a href={currentStudent.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-btn linkedin-btn social-btn-link">
                    <Link2 size={15} /> LinkedIn Profile
                  </a>
                )}
                {currentStudent.socialLinks.github && (
                  <a href={currentStudent.socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-btn github-btn social-btn-link">
                    <Code size={15} /> GitHub Profile
                  </a>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

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
              <div className="modal-readonly-header">
                <div className="modal-readonly-tag">Student Profile (Read-Only)</div>
                <div className="modal-readonly-name">{currentStudent.name}</div>
                <div className="modal-readonly-meta">Roll No: {currentStudent.rollNo} • {currentStudent.department}</div>
              </div>

              <div className="modal-grid-2col">
                <EditField id="email" label="Personal Email" type="email" value={formData.email} onChange={handleChange} required />
                <EditField id="phone" label="Phone Number" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="modal-grid-2col">
                <EditField id="location" label="Location" value={formData.location} onChange={handleChange} required />
                <EditField id="avatar" label="Profile Image URL" placeholder="https://example.com/avatar.jpg" value={formData.avatar} onChange={handleChange} />
              </div>

              <EditField id="address" label="Permanent Address" value={formData.address} onChange={handleChange} />
              <EditField id="bio" label="Biography" as="textarea" value={formData.bio} onChange={handleChange} />
              <EditField id="skills" label="Skills (comma-separated)" placeholder="React, Python, Machine Learning..." value={formData.skills} onChange={handleChange} />

              <div className="modal-note-box">
                <strong>Note:</strong> Academic records (Name, Roll No, CGPA, Semester, Section, and Hostel room) can only be updated by the university administration.
              </div>

              <div className="modal-actions-row">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-modal-cancel">Cancel</button>
                <button type="submit" className="btn-modal-save">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function EditField({ id, label, type = 'text', as = 'input', ...props }) {
  const Field = as;
  return (
    <div>
      <label htmlFor={`edit-${id}`} className="acad-info-lbl modal-field-lbl">{label}</label>
      <Field id={`edit-${id}`} name={id} type={as === 'input' ? type : undefined} className={`modal-input ${as === 'textarea' ? 'modal-textarea' : ''}`} {...props} />
    </div>
  );
}