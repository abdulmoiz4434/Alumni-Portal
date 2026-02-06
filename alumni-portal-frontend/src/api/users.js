import API from './axios';
export const getAllAlumni = () => API.get('/alumni/all');
export const getAllStudents = () => API.get('/students/all');