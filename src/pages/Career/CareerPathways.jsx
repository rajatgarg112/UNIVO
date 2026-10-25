import React, { useState, useMemo, useCallback } from 'react';
import {
  Search,
  CheckCircle,
  ArrowRight,
  X,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import initialCareers from '../../data/careers.json';
import ProgressRing from '../../components/ui/ProgressRing/ProgressRing';
import Badge from '../../components/ui/Badge/Badge';
import './Career.css';

/**
 * Component: CareerCard
 * Demonstrates: Component Composition, Props, and Conditional Styling
 */
function CareerCard({ career, isSelected, onSelect }) {
  const { title, category, tagline, description, skills, avgSalary } = career;

  return (
    <div
      className={`career-card ${isSelected ? 'active-card' : ''}`}
      onClick={() => onSelect(career)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(career);
        }
      }}
    >
      <div>
        <div className="career-card-header">
          <div>
            <Badge variant="default" size="sm">
              {category}
            </Badge>
            <h3 className="career-card-title" style={{ marginTop: '8px' }}>
              {title}
            </h3>
            <p className="career-card-tagline">{tagline}</p>
          </div>
        </div>

        <p className="career-card-desc" style={{ marginTop: '10px' }}>
          {description}
        </p>

        {/* Skill Tags Preview */}
        <div className="career-skills-chips" style={{ marginTop: '14px' }}>
          {skills.slice(0, 4).map((skill, idx) => (
            <span key={idx} className="skill-chip">
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="skill-chip" style={{ opacity: 0.7 }}>
              +{skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className="career-card-footer">
        <span className="career-salary">{avgSalary}</span>
        <span className="btn-select-career">
          {isSelected ? 'Viewing Track' : 'View Roadmap'} <ArrowRight size={13} />
        </span>
      </div>
    </div>
  );
}

/**
 * Main Page Component: CareerPathways
 *
 * Demonstrates Syllabus Concepts:
 * 1. useState: Search filter, selected career path, and user-checked skills
 * 2. useMemo: Performant filtering of career cards based on search query
 * 3. useCallback: Event handler for toggling skill checkboxes
 * 4. Component Composition: Reusable Drive Card, ProgressRing, Badge
 * 5. Conditional Rendering: Active panel, motivational feedback, and empty search state
 */
export default function CareerPathways() {
  // 1. Search Query State
  const [searchTerm, setSearchTerm] = useState('');

  // 2. Active Career Selection State (defaults to first career)
  const [selectedCareer, setSelectedCareer] = useState(initialCareers[0]);

  // 3. User Checked Skills State for the interactive checklist
  // Pre-seed some default skills (e.g. React.js & JavaScript for demo feel)
  const [checkedSkills, setCheckedSkills] = useState({
    'HTML5 & Modern CSS3': true,
    'JavaScript (ES6+)': true,
    'React.js & Hooks': true,
  });

  // 4. Filter career cards based on title or required skill using useMemo
  const filteredCareers = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return initialCareers;

    return initialCareers.filter((career) => {
      const matchesTitle = career.title.toLowerCase().includes(query);
      const matchesCategory = career.category.toLowerCase().includes(query);
      const matchesSkill = career.skills.some((skill) =>
        skill.toLowerCase().includes(query)
      );
      return matchesTitle || matchesCategory || matchesSkill;
    });
  }, [searchTerm]);

  // 5. Toggle skill checkbox handler using useCallback
  const handleToggleSkill = useCallback((skillName) => {
    setCheckedSkills((prev) => ({
      ...prev,
      [skillName]: !prev[skillName],
    }));
  }, []);

  // 6. Reset all checked skills for current career
  const handleResetSkills = () => {
    setCheckedSkills((prev) => {
      const updated = { ...prev };
      selectedCareer.skills.forEach((skill) => {
        delete updated[skill];
      });
      return updated;
    });
  };

  // 7. Calculate Readiness Percentage with useState-driven calculation
  const totalSkills = selectedCareer ? selectedCareer.skills.length : 0;
  const completedSkillsCount = selectedCareer
    ? selectedCareer.skills.filter((skill) => !!checkedSkills[skill]).length
    : 0;

  const readinessPercentage =
    totalSkills > 0 ? Math.round((completedSkillsCount / totalSkills) * 100) : 0;

  // Derive feedback message and color for ProgressRing
  let progressColor = '#ef4444'; // Red for beginner
  let feedbackText = 'Foundational Stage: Start by mastering the core prerequisites.';
  if (readinessPercentage >= 75) {
    progressColor = '#10b981'; // Green
    feedbackText = 'Placement Ready! You possess the required skill set for entry-level roles.';
  } else if (readinessPercentage >= 40) {
    progressColor = '#f59e0b'; // Amber
    feedbackText = 'Intermediate Progress: Keep building hands-on projects to close skill gaps.';
  }

  return (
    <div className="career-page">
      {/* ─── Page Header ─── */}
      <div className="career-header">
        <h1 className="career-title">Career Pathways</h1>
        <p className="career-subtitle">
          Explore structured tech career trajectories, evaluate your skills, and track your job-readiness.
        </p>
      </div>

      {/* ─── Search Toolbar ─── */}
      <div className="career-toolbar">
        <div className="career-search-box">
          <Search size={16} />
          <input
            type="text"
            className="career-search-input"
            placeholder="Search pathways by role or skill (e.g. React, Python, Docker)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ color: '#94a3b8', cursor: 'pointer' }}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
          Showing <strong>{filteredCareers.length}</strong> of {initialCareers.length} pathways
        </span>
      </div>

      {/* ─── Career Pathways Grid ─── */}
      {filteredCareers.length > 0 ? (
        <div className="career-cards-grid">
          {filteredCareers.map((career) => (
            <CareerCard
              key={career.id}
              career={career}
              isSelected={selectedCareer?.id === career.id}
              onSelect={setSelectedCareer}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: '#0B1220',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#94a3b8'
          }}
        >
          <Search size={32} style={{ marginBottom: '10px', color: '#D71920' }} />
          <h3 style={{ color: '#f8fafc', fontSize: '16px' }}>No matching career pathways found</h3>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>
            Try searching for a different skill or clear your search query.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="btn-reset-skills"
            style={{ marginTop: '14px' }}
          >
            Clear Search
          </button>
        </div>
      )}

      {/* ─── Selected Career Deep-Dive: Checklist & Roadmap ─── */}
      {filteredCareers.length > 0 && selectedCareer && (
        <div className="career-detail-section">
          <div className="career-detail-grid">
            {/* Left Card: Interactive Skill Checklist & Readiness Score */}
            <div className="career-panel-card">
              <div className="panel-header-row">
                <h3 className="panel-title">
                  <CheckCircle size={18} color="#10b981" /> Skill Readiness Tracker
                </h3>
                <button
                  onClick={handleResetSkills}
                  className="btn-reset-skills"
                  title="Clear all checked skills"
                >
                  <RotateCcw size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Reset
                </button>
              </div>

              {/* Progress Ring Widget */}
              <div className="readiness-widget-box">
                <ProgressRing
                  percentage={readinessPercentage}
                  size={76}
                  strokeWidth={7}
                  color={progressColor}
                  showText={true}
                />
                <div className="readiness-info">
                  <span className="readiness-heading">
                    {completedSkillsCount} of {totalSkills} Skills Mastered
                  </span>
                  <p className="readiness-subtext">{feedbackText}</p>
                </div>
              </div>

              {/* Interactive Checklist */}
              <div>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#94a3b8',
                    letterSpacing: '0.4px',
                    marginBottom: '10px'
                  }}
                >
                  Select the skills you currently possess:
                </p>

                <div className="skill-checklist">
                  {selectedCareer.skills.map((skill, index) => {
                    const isChecked = !!checkedSkills[skill];
                    return (
                      <label
                        key={index}
                        className={`skill-check-item ${isChecked ? 'completed' : ''}`}
                      >
                        <input
                          type="checkbox"
                          className="skill-checkbox-input"
                          checked={isChecked}
                          onChange={() => handleToggleSkill(skill)}
                        />
                        <span className="skill-item-text">{skill}</span>
                        {isChecked && (
                          <Badge variant="success" size="sm">
                            Ready
                          </Badge>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Card: Step-by-Step Learning Roadmap */}
            <div className="career-panel-card">
              <div className="panel-header-row">
                <h3 className="panel-title">
                  <BookOpen size={18} color="#D71920" /> Learning Roadmap: {selectedCareer.title}
                </h3>
                <Badge variant="purple" size="sm">
                  {selectedCareer.difficulty}
                </Badge>
              </div>

              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                Follow this recommended curriculum progression to gain job-ready competencies for{' '}
                <strong style={{ color: '#f8fafc' }}>{selectedCareer.title}</strong> roles.
              </p>

              {/* Roadmap Timeline */}
              <div className="roadmap-timeline">
                {selectedCareer.roadmap.map((stepItem) => (
                  <div key={stepItem.step} className="roadmap-step">
                    <div className="step-marker">{stepItem.step}</div>
                    <div className="step-content">
                      <span className="step-phase-badge">{stepItem.phase}</span>
                      <h4 className="step-title">{stepItem.title}</h4>
                      <p className="step-details">{stepItem.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
