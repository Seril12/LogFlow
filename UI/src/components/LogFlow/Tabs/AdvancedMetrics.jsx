'use client';

import React, { useState, useEffect } from 'react';
import { getAdvancedMetrics } from '../../../services/api';

export default function AdvancedMetrics() {
  const [metrics, setMetrics] = useState({
    top_users: [],
    top_orders: [],
    top_products: [],
    top_error_reasons: [],
    avg_response_time: 0,
    total_timeouts: 0,
    avg_retry_attempts: 0,
    avg_stock_level: 0,
  });

  useEffect(() => {
    const handleFetchMetrics = async () => {
      try {
        const data = await getAdvancedMetrics();
        setMetrics(data);
      } catch (error) {
        console.log('[v0] Error fetching advanced metrics:', error);
      }
    };

    handleFetchMetrics();
    const interval = setInterval(handleFetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ label, value, unit = '', color = '#4d90fe' }) => (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value" style={{ color }}>
        {value}{unit}
      </div>
    </div>
  );

  const ListSection = ({ title, items, icon = '📋' }) => (
    <div className="metric-card wide">
      <div className="metric-label">{icon} {title}</div>
      <div className="services-list">
        {items && items.length > 0 ? (
          items.map((item, idx) => (
            <div key={idx} className="service-item">
              <span className="service-name">{item.name}</span>
              <span className="service-errors" style={{ color: '#d29922' }}>
                {item.count} occurrences
              </span>
            </div>
          ))
        ) : (
          <p style={{ color: '#8b949e' }}>No data available</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="tab-pane metrics-grid">
      <StatCard label="Avg Response Time" value={metrics.avg_response_time} unit="ms" color="#4d90fe" />
      <StatCard label="Total Timeouts" value={metrics.total_timeouts} color="#ff4757" />
      <StatCard label="Avg Retry Attempts" value={metrics.avg_retry_attempts?.toFixed(1)} color="#d29922" />
      <StatCard label="Avg Stock Level" value={metrics.avg_stock_level?.toFixed(0)} unit=" units" color="#238636" />

      <ListSection title="Top Users" items={metrics.top_users} icon="👤" />
      <ListSection title="Top Orders" items={metrics.top_orders} icon="📦" />
      <ListSection title="Top Products" items={metrics.top_products} icon="🛍️" />
      <ListSection title="Top Error Reasons" items={metrics.top_error_reasons} icon="⚠️" />
    </div>
  );
}
