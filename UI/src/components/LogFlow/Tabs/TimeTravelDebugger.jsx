'use client';

import React, { useState } from 'react';
import { compareLogsPeriods } from '../../../services/api';

export default function TimeTravelDebugger() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!startTime || !endTime) {
      alert('Please select both start and end times');
      return;
    }

    setLoading(true);
    try {
      const data = await compareLogsPeriods(startTime, endTime);
      setComparison(data);
    } catch (error) {
      console.log('[v0] Error comparing periods:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-pane">
      <div className="controls-section">
        <div className="control-group">
          <label>Healthy Period Start</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="datetime-input"
          />
        </div>

        <div className="control-group">
          <label>Crash Period Start</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="datetime-input"
          />
        </div>

        <button onClick={handleCompare} className="action-button" disabled={loading}>
          {loading ? 'Analyzing...' : 'Compare Periods'}
        </button>
      </div>

      {comparison && (
        <div className="comparison-results">
          <div className="result-card healthy">
            <h3>Healthy Period</h3>
            <div className="stat-item">
              <span>Log Count:</span>
              <span className="stat-value">{comparison.healthy_count || '0'}</span>
            </div>
            <div className="stat-item">
              <span>Time Period:</span>
              <span className="stat-value">{comparison.healthy_start?.substring(0, 16) || 'N/A'}</span>
            </div>
          </div>

          <div className="result-card crash">
            <h3>Crash Period</h3>
            <div className="stat-item">
              <span>Log Count:</span>
              <span className="stat-value">{comparison.crash_count || '0'}</span>
            </div>
            <div className="stat-item">
              <span>Time Period:</span>
              <span className="stat-value">{comparison.crash_start?.substring(0, 16) || 'N/A'}</span>
            </div>
          </div>

          <div className="result-card diff">
            <h3>AI Analysis</h3>
            <div className="analysis-text">
              {comparison.analysis ? (
                <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9em', lineHeight: '1.6' }}>
                  {comparison.analysis}
                </div>
              ) : (
                <p>No analysis available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
