import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  CheckSquare, Calendar, Clock, BookOpen, FileText, ArrowRight, Home
} from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load students data from localStorage or fallback
  const [studentsList] = React.useState(() => {
    try {
      const saved = localStorage.getItem('uv_students_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const currentStudent = studentsList.find(s => s.id === (user?.id || 'STU001')) || { cgpa: 9.2 };

  // Dynamic attendance and breakdown calculation
  const [attendancePercentage, setAttendancePercentage] = React.useState(85.3);
  const [attendanceBreakdown, setAttendanceBreakdown] = React.useState([
    { subject: 'Data Structures & Algorithms', percentage: 86, isSafe: true },
    { subject: 'Database Management Systems', percentage: 84, isSafe: true },
    { subject: 'Computer Networks', percentage: 74, isSafe: false },
    { subject: 'Software Engineering', percentage: 93, isSafe: true }
  ]);

  React.useEffect(() => {
    const savedAtt = localStorage.getItem('uv_attendance_data_v2');
    if (savedAtt) {
      try {
        const attMap = JSON.parse(savedAtt);
        const subjects = attMap['Semester 6'] || [];
        if (subjects.length > 0) {
          let totalClasses = 0;
          let attendedClasses = 0;
          const breakdown = subjects.map(subj => {
            const att = subj.attendedClasses !== undefined ? subj.attendedClasses : (subj.attended || 0);
            const tot = subj.totalClasses !== undefined ? subj.totalClasses : (subj.total || 0);
            totalClasses += tot;
            attendedClasses += att;
            const percentage = tot > 0 ? parseFloat(((att / tot) * 100).toFixed(1)) : 0;
            return {
              subject: subj.name,
              percentage: percentage,
              isSafe: percentage >= 75
            };
          });
          setAttendanceBreakdown(breakdown);
          if (totalClasses > 0) {
            setAttendancePercentage(parseFloat(((attendedClasses / totalClasses) * 100).toFixed(1)));
          }
        }
      } catch (e) {}
    }
  }, []);

  const warningCount = attendanceBreakdown.filter(item => !item.isSafe).length;

  // Demo today's schedule
  const todaySchedule = [
    { time: '09:00 AM – 10:00 AM', subject: 'Machine Learning', room: 'Room CS-301', type: 'Lecture' },
    { time: '11:00 AM – 12:00 PM', subject: 'Database Management Systems', room: 'Room CS-302', type: 'Lecture' },
    { time: '02:00 PM – 03:00 PM', subject: 'Data Structures', room: 'Room CS-201', type: 'Lab' }
  ];

  // Demo upcoming assignments
  const upcomingAssignments = [
    { title: 'Data Structures Assignment 3', dueDate: 'Aug 12', status: 'pending' },
    { title: 'Database Systems Mini Project', dueDate: 'Aug 15', status: 'pending' },
    { title: 'Computer Networks Lab Report', dueDate: 'Submitted', status: 'submitted' }
  ];

  // Demo campus updates
  const campusUpdates = [
    { title: 'HackVerse 2026 — 36hr National Hackathon', date: 'Aug 15, 2026', type: 'Event' },
    { title: 'Cloud Native & Kubernetes Workshop', date: 'Aug 20, 2026', type: 'Workshop' },
    { title: 'Guest Lecture on NLP', date: 'Aug 20, 2026', type: 'Lecture' }
  ];

  // Quick actions list
  const quickActions = [
    { label: 'Attendance', route: '/attendance', icon: <CheckSquare size={18} color="#10b981" /> },
    { label: 'Assignments', route: '/assignments', icon: <FileText size={18} color="#f59e0b" /> },
    { label: 'Notes', route: '/notes', icon: <BookOpen size={18} color="#06b6d4" /> },
    { label: 'Timetable', route: '/timetable', icon: <Calendar size={18} color="#D71920" /> },
  ];

  return (
    <div className="dashboard-page">
      {/* 1. Page Header */}
      <div className="dashboard-header-card">
        <div>
          <h1 className="dashboard-greeting">Good Morning, {user?.name || 'Aryan'} 👋</h1>
          <p className="dashboard-subtitle">Here’s your university overview for today.</p>
        </div>
        <div className="header-meta-badge">
          <Calendar size={15} /> Saturday, August 9, 2026
        </div>
      </div>

      {/* 2. Top Summary Stat Cards Grid (4 Cards) */}
      <div className="dashboard-stats-grid">
        {/* Card 1: Attendance */}
        <div className="dash-summary-card">
          <div>
            <span className="dash-summary-lbl">Attendance</span>
            <div className="dash-summary-val" style={{ color: '#10b981' }}>{attendancePercentage}%</div>
            <div className="dash-summary-sub" style={{ color: '#10b981' }}>{attendancePercentage >= 75 ? 'Safe Standing' : 'Below 75%'}</div>
          </div>
          <button onClick={() => navigate('/attendance')} className="dash-summary-btn">
            View Attendance <ArrowRight size={12} />
          </button>
        </div>

        {/* Card 2: Current CGPA */}
        <div className="dash-summary-card">
          <div>
            <span className="dash-summary-lbl">Current CGPA</span>
            <div className="dash-summary-val" style={{ color: '#D71920' }}>{currentStudent.cgpa}</div>
            <div className="dash-summary-sub" style={{ color: '#D71920' }}>Top 5% in Department</div>
          </div>
          <button onClick={() => navigate('/profile')} className="dash-summary-btn">
            View Profile <ArrowRight size={12} />
          </button>
        </div>

        {/* Card 3: Pending Assignments */}
        <div className="dash-summary-card">
          <div>
            <span className="dash-summary-lbl">Pending Assignments</span>
            <div className="dash-summary-val" style={{ color: '#f59e0b' }}>2</div>
            <div className="dash-summary-sub" style={{ color: '#f59e0b' }}>Due This Week</div>
          </div>
          <button onClick={() => navigate('/assignments')} className="dash-summary-btn">
            View Assignments <ArrowRight size={12} />
          </button>
        </div>

        {/* Card 4: Placement Readiness */}
        <div className="dash-summary-card">
          <div>
            <span className="dash-summary-lbl">Placement Readiness</span>
            <div className="dash-summary-val" style={{ color: '#06b6d4' }}>88%</div>
            <div className="dash-summary-sub" style={{ color: '#94a3b8' }}>Resume & Skills Audit</div>
          </div>
          <button onClick={() => navigate('/profile')} className="dash-summary-btn">
            View Career <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Main 2-Column Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-col">
          {/* SECTION 1 — TODAY'S SCHEDULE */}
          <div className="dashboard-card">
            <div className="card-header-flex">
              <h3 className="card-title">
                <Clock size={20} color="#D71920" /> Today's Schedule
              </h3>
              <button onClick={() => navigate('/timetable')} className="btn-link">View Timetable <ArrowRight size={14} /></button>
            </div>
            <div className="list-container">
              {todaySchedule.map((cls, idx) => (
                <div key={idx} className="timetable-item-row" style={{ borderLeftColor: idx === 2 ? '#f59e0b' : '#D71920' }}>
                  <div>
                    <span className="tt-time">{cls.time}</span>
                    <h4 className="item-title" style={{ marginTop: '2px' }}>{cls.subject}</h4>
                    <span className="item-sub">{cls.room}</span>
                  </div>
                  <span className="subject-code-tag" style={{ background: cls.type === 'Lab' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(215, 25, 32, 0.15)', color: cls.type === 'Lab' ? '#f59e0b' : '#D71920' }}>
                    {cls.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2 — ATTENDANCE OVERVIEW */}
          <div className="dashboard-card">
            <div className="card-header-flex">
              <h3 className="card-title">
                <CheckSquare size={20} color="#10b981" /> Attendance Overview
              </h3>
              <button onClick={() => navigate('/attendance')} className="btn-link">View Attendance <ArrowRight size={14} /></button>
            </div>
            <div className="dash-attendance-breakdown">
              {attendanceBreakdown.map((item, idx) => (
                <div key={idx} className="attendance-prog-item">
                  <div className="attendance-lbl-row">
                    <span className="attendance-subj-name">{item.subject}</span>
                    <span className={`attendance-subj-pct ${item.isSafe ? 'safe' : 'warning'}`}>{item.percentage}%</span>
                  </div>
                  <div className="attendance-prog-bg">
                    <div className={`attendance-prog-fill ${item.isSafe ? 'fill-safe' : 'fill-warning'}`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {warningCount > 0 && (
              <div className="dash-attention-box">
                <span>{warningCount} subject(s) below 75% threshold</span>
                <button onClick={() => navigate('/attendance')} className="dash-attention-btn">
                  Check Attendance
                </button>
              </div>
            )}
          </div>

          <div className="dashboard-card">
            <div className="card-header-flex">
              <h3 className="card-title">
                <FileText size={20} color="#f59e0b" /> Upcoming Assignments
              </h3>
              <button onClick={() => navigate('/assignments')} className="btn-link">View All <ArrowRight size={14} /></button>
            </div>
            <div className="list-container">
              {upcomingAssignments.map((a, idx) => (
                <div key={idx} className="list-item-row">
                  <div>
                    <h4 className="item-title">{a.title}</h4>
                    <span className="item-sub">Due: {a.dueDate}</span>
                  </div>
                  <span className={`status-badge-tag status-${a.status}`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-col">
          {/* SECTION 4 — RECENT CAMPUS UPDATES */}
          <div className="dashboard-card">
            <h3 className="card-title">
              <Calendar size={20} color="#06b6d4" /> Recent Campus Updates
            </h3>
            <div className="list-container">
              {campusUpdates.map((item, idx) => (
                <div key={idx} className="update-item-row">
                  <span className="event-type-badge">{item.type}</span>
                  <h4 className="item-title" style={{ marginTop: '2px' }}>{item.title}</h4>
                  <span className="item-sub">📅 {item.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5 — QUICK ACTIONS */}
          <div className="dashboard-card">
            <h3 className="card-title">
              <Home size={20} color="#E8333A" /> Quick Actions
            </h3>
            <div className="quick-actions-grid">
              {quickActions.map((action, idx) => (
                <button key={idx} onClick={() => navigate(action.route)} className="quick-action-btn">
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
