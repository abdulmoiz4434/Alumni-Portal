import API from './axios';

export const getDashboardStats = () => API.get('/dashboard/stats');

export const getDashboardData = () => API.get('/dashboard/data');

export const getUpcomingEvents = (limit = 3) =>
    API.get(`/events?limit=${limit}&upcoming=true`);

export const getRecentJobs = (limit = 3) =>
    API.get(`/jobs?limit=${limit}&sort=recent`);

export const getActiveMentorships = () =>
    API.get('/mentorship?status=active');
