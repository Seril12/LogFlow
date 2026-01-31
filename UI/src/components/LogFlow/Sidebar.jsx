'use client';

import React, { useState, useEffect } from 'react';
import { getLogs } from '../../services/api';

export default function Sidebar() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getLogs(new Date(Date.now() - 3600000).toISOString(), new Date().toISOString(), 50);
        if (Array.isArray(data)) {
          setLogs(data.slice(0, 20));
        } else if (data.logs && Array.isArray(data.logs)) {
          setLogs(data.logs.slice(0, 20));
        }
      } catch (error) {
        console.log('[v0] Error fetching logs:', error);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const getLogLevelClass = (level) => {
    switch (level?.toUpperCase()) {
      case 'ERROR':
        return 'log-error';
      case 'WARN':
        return 'log-warn';
      case 'INFO':
        return 'log-info';
      default:
        return 'log-info';
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Live Logs</h2>
        <span className="log-count">{logs.length}</span>
      </div>
      <div className="logs-container">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div key={index} className={`log-entry ${getLogLevelClass(log.level)}`}>
              <div className="log-level">{log.level}</div>
              <div className="log-message">{log.message}</div>
              <div className="log-time">
                {new Date(log.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        ) : (
          <div className="log-empty">No logs available</div>
        )}
      </div>
    </aside>
  );
}
