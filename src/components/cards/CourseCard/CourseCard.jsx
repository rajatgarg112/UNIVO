import React from 'react';
import { User, Clock, BookOpen } from 'lucide-react';
import ProgressRing from '../../ui/ProgressRing/ProgressRing';
import './CourseCard.css';

const CourseCard = ({ subject = {} }) => {
  const {
    name = 'Course Name',
    code = 'CS101',
    faculty = 'Prof. Unknown',
    schedule = 'Mon, Wed • 09:00 AM',
    attendancePercent = 0,
    color = '#6366f1',
  } = subject;

  const attendanceColor =
    attendancePercent >= 75 ? '#10b981' :
    attendancePercent >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="course-card" style={{ '--course-color': color }}>
      <div className="course-card-top-bar" style={{ background: color }}></div>
      <div className="course-card-body">
        <div className="course-card-header">
          <div className="course-icon" style={{ background: `${color}22`, color }}>
            <BookOpen size={18} />
          </div>
          <div className="course-code">{code}</div>
        </div>
        <h3 className="course-name">{name}</h3>
        <div className="course-faculty">
          <User size={12} />
          <span>{faculty}</span>
        </div>
        <div className="course-schedule">
          <Clock size={12} />
          <span>{schedule}</span>
        </div>
        <div className="course-card-footer">
          <div className="attendance-section">
            <span className="attendance-label">Attendance</span>
            <span
              className="attendance-value"
              style={{ color: attendanceColor }}
            >
              {attendancePercent < 75 && attendancePercent >= 60 && (
                <span className="attendance-warning-dot" />
              )}
              {attendancePercent}%
            </span>
          </div>
          <ProgressRing
            percentage={attendancePercent}
            size={52}
            strokeWidth={5}
            color={attendanceColor}
            showText={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
