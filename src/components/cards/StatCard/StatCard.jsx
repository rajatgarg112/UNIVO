import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import CountUpNumber from '../../ui/CountUpNumber/CountUpNumber';
import './StatCard.css';

const StatCard = ({
  title = 'Metric',
  value = 0,
  change,
  changeType = 'neutral',
  icon,
  color = '#6366f1',
  gradient = false,
  suffix = '',
}) => {
  const ChangeIcon =
    changeType === 'up' ? TrendingUp :
    changeType === 'down' ? TrendingDown :
    Minus;

  const isNumeric = typeof value === 'number';

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div>
          <p className="stat-card-title">{title}</p>
          <div className="stat-card-value-row">
            <span className="stat-card-value">
              {isNumeric ? (
                <CountUpNumber end={value} suffix={suffix} decimals={value % 1 !== 0 ? 1 : 0} />
              ) : (
                `${value}${suffix}`
              )}
            </span>
          </div>
          {change !== undefined && (
            <div className={`stat-card-change ${changeType}`}>
              <ChangeIcon size={14} />
              <span>{change}</span>
              <span className="stat-card-change-label">vs last month</span>
            </div>
          )}
        </div>
        <div
          className="stat-card-icon"
          style={{
            background: gradient
              ? `linear-gradient(135deg, ${color}, ${color}99)`
              : `${color}22`,
            color: gradient ? '#fff' : color,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
