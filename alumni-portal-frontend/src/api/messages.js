import API from './axios';
export const getConversations = () => API.get('/messages/conversations');
export const getMessages = (conversationId) => API.get(`/messages/${conversationId}`);
export const startConversation = (receiverId) => 
    API.post('/messages/conversation', { receiverId });
export const sendMessage = (conversationId, content) => 
    API.post('/messages/send', { conversationId, content });