// src/components/Chatbot/Chatbot.js
import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { sendChatbotMessage } from '../../services/ChatbotService';
import './Chatbot.css';

const config = {
    initialMessages: [
        {
            id: 'welcome',
            message: 'Hello! How can I assist you today? Ask about jewelry, news, or store info!',
            user: false,
        },
    ],
    botName: 'Jewelry Chatbot',
};

const MessageParser = ({ children, actions }) => {
    const parse = async (message) => {
        try {
            const userId = localStorage.getItem('user_id') || 'guest';
            console.log('Sending userId:', userId); // Log để debug
            const response = await sendChatbotMessage(message, userId);
            const botMessage = typeof response.message === 'string'
                ? response.message
                : JSON.stringify(response.message || 'Invalid response');
            console.log('Bot message:', botMessage);
            actions.handleBotResponse(botMessage);
        } catch (error) {
            console.error('Chatbot error:', error.message);
            actions.handleBotResponse('Sorry, an error occurred. Please try again!');
        }
    };

    return (
        <div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, { parse });
            })}
        </div>
    );
};

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
    const handleBotResponse = (message) => {
        const botMessage = createChatBotMessage(message);
        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    };

    return (
        <div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, { actions: { handleBotResponse } });
            })}
        </div>
    );
};

const MyChatbot = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="chatbot-container">
            {isOpen && (
                <Chatbot
                    config={config}
                    messageParser={MessageParser}
                    actionProvider={ActionProvider}
                    headerText="Jewelry Chatbot"
                    placeholderText="Type your question..."
                    className="chatbot-popup"
                />
            )}
            <button className="chatbot-toggle-btn" onClick={toggleChatbot}>
                {isOpen ? '✖' : '💬'}
            </button>
        </div>
    );
};

export default MyChatbot;