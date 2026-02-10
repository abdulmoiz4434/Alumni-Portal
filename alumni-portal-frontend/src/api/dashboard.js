import API from './axios';

// Get dashboard statistics
export const getDashboardStats = () => API.get('/dashboard/stats');

// Get dashboard data (events, jobs, mentorships)
export const getDashboardData = () => API.get('/dashboard/data');

// Get upcoming events
export const getUpcomingEvents = (limit = 3) =>
    API.get(`/events?limit=${limit}&upcoming=true`);

// Get recent jobs
export const getRecentJobs = (limit = 3) =>
    API.get(`/jobs?limit=${limit}&sort=recent`);

// Get user's active mentorships
export const getActiveMentorships = () =>
    API.get('/mentorship?status=active');
