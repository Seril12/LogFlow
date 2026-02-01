const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// MASTER apiCall - Sidebar + TimeTravel use THIS
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('🌐 API:', url, options.method || 'GET'); // DEBUG ALL CALLS
  
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ API FAIL:', url, response.status, errorText.slice(0, 200));
    throw new Error(`API ${response.status}: ${errorText.slice(0, 100)}`);
  }

  return await response.json();
};

// Health
export const checkHealth = () => apiCall('/health');

// Logs (Sidebar uses this)
export const getLogs = (startTime, endTime, limit = 50) => 
  apiCall(`/logs?start=${startTime}&end=${endTime}&limit=${limit}`);

// Metrics
export const getMetrics = async () => {
  const data = await apiCall('/metrics');
  const logCounts = data.log_counts || {};
  return {
    log_counts: logCounts,
    top_services: data.top_services,
    // ... rest unchanged
  };
};

// 🔥 TIME TRAVEL - USES SAME apiCall!
export const compareLogsPeriods = async (healthyISO, crashISO) => {
  const url = `/ai/compare?healthy=${healthyISO}&crash=${crashISO}`;
  console.log('🕒 TimeTravel:', url);
  return apiCall(url); // SAME apiCall as Sidebar!
};

// AI Summary
export const getSummary = () => apiCall('/ai/summary');

// Ingest log
export const ingestLog = (log) => apiCall('/ingest', {
  method: 'POST',
  body: JSON.stringify(log),
});

// Query AI
export const queryAI = (question) => apiCall('/ai/query', {
  method: 'POST',
  body: JSON.stringify({ question }),
});

export default { checkHealth, getLogs, getMetrics, compareLogsPeriods, queryAI, getSummary, ingestLog };
