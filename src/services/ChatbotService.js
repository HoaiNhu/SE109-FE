// src/services/ChatbotService.js
import axios from 'axios';

export const sendChatbotMessage = async (message, userId) => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL_BACKEND}/chatbot/chat`,
            { message, userId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
                },
            }
        );
        console.log('Backend response:', response.data); // Log để debug
        const responseMessage = typeof response.data.message === 'string'
            ? response.data.message
            : JSON.stringify(response.data.message || 'Invalid response');
        return { message: responseMessage };
    } catch (error) {
        console.error('Error in sendChatbotMessage:', error.message, error.response?.data);
        return { message: 'Sorry, an error occurred. Please try again!' };
    }
};