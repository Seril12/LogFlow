'use client';

import React, { useState, useEffect } from 'react';
import { getMetrics } from '../../../services/api';

export default function SystemMetrics() {
  const [metrics, setMetrics] = useState({
    uptime: 0,
    error_rate: 0,
    avg_latency: 0,
    active_connections: 0,
    memory_usage: 0,
    cpu_usage: 0,
    requests_per_second: 0,
    services: [],
  });

  useEffect(() => {
    const handleFetchMetrics = async () => {
      try {
        const data = await getMetrics();
        setMetrics(data);
      } catch (error) {
        console.log('[v0] Error fetching metrics:', error);
      }
    };

    handleFetchMetrics();
    const interval = setInterval(handleFetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (value, threshold = 50) => {
    if (value < threshold) return '#238636';
    if (value < 75) return '#d29922';
    return '#ff4757';
  };

  return (
    <div className="tab-pane metrics-grid">
      <div className="metric-card">
        <div className="metric-label">Uptime</div>
        <div className="metric-value">{metrics.uptime || '0'}h</div>
      </div>

      <div className="metric-card">
        <div className="metric-label">Error Rate</div>
        <div
          className="metric-value"
          style={{ color: getHealthColor(metrics.error_rate) }}
        >
          {metrics.error_rate || '0'}%
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-label">Avg Latency</div>
        <div className="metric-value">{metrics.avg_latency || '0'}ms</div>
      </div>

      <div className="metric-card">
        <div className="metric-label">Active Connections</div>
        <div className="metric-value">{metrics.active_connections || '0'}</div>
      </div>

      <div className="metric-card">
        <div className="metric-label">Memory Usage</div>
        <div
          className="metric-value"
          style={{ color: getHealthColor(metrics.memory_usage) }}
        >
          {metrics.memory_usage || '0'}%
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-label">CPU Usage</div>
        <div
          className="metric-value"
          style={{ color: getHealthColor(metrics.cpu_usage) }}
        >
          {metrics.cpu_usage || '0'}%
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-label">Requests/sec</div>
        <div className="metric-value">{metrics.requests_per_second || '0'}</div>
      </div>

      <div className="metric-card wide">
        <div className="metric-label">Service Health</div>
        <div className="services-list">
          {Array.isArray(metrics.services) && metrics.services.length > 0 ? (
            metrics.services.map((service, index) => (
              <div key={index} className="service-item">
                <span className="service-name">{service.name}</span>
                <span
                  className="service-status"
                  style={{
                    backgroundColor: service.healthy ? '#238636' : '#ff4757',
                  }}
                >
                  {service.healthy ? 'Online' : 'Offline'}
                </span>
              </div>
            ))
          ) : (
            <div className="service-item">No services available</div>
          )}
        </div>
      </div>
    </div>
  );
}
