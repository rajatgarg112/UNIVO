import React from 'react';

export default function PerformanceChart({ data }) {
  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <h3 style={{ fontSize: '16px', color: '#f8fafc', marginBottom: '16px' }}>Semester Performance Trend (CGPA)</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '16px', paddingTop: '20px' }}>
        {data?.map((item) => (
          <div key={item.semester} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ fontSize: '11px', color: '#10b981', marginBottom: '4px' }}>{item.cgpa}</div>
            <div style={{ width: '100%', height: `${(item.cgpa / 10) * 100}%`, background: 'linear-gradient(180deg, #10b981, #059669)', borderRadius: '6px 6px 0 0' }} />
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>{item.semester}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
