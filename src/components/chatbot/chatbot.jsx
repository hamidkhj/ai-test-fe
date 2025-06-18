import { useState, useContext } from 'react';
import { MessageSquareText, X } from 'lucide-react';
import axios from "../../Axios/axios.js";
import TokenContext from '../../context/TokenContext';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false); // State to control widget visibility
    const [messages, setMessages] = useState([]); // State to store chat messages
    const [inputText, setInputText] = useState(''); // State for the user's input field
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator during API call
    const { userToken } = useContext(TokenContext)


    const toggleChat = () => {
        setIsOpen(!isOpen);
    };


    const sendMessage = async (message) => {
        if (message.trim() === '') return;

        const userMessage = { sender: 'user', text: message };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInputText('');

        setIsLoading(true);

        try {

            const payload = {
                message: message,
                history: {}
            };
            console.log(payload)
            const response = await axios.post('/chatbot/chat', payload, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

            let botResponseText = "Sorry, I couldn't get a response from the bot. Please try again.";
            if (response.data && response.data.message) {
                botResponseText = response.data.message;
            }

            const botMessage = { sender: 'bot', text: botResponseText };
            setMessages((prevMessages) => [...prevMessages, botMessage]);

        } catch (error) {
            if (error.response.request.status === 429) {
                console.log(error.response.data.message)
                const botMessage = { sender: 'bot', text: error.response.data.message };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            }
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage(inputText);
        }
    };

    return (
        <div className="font-sans">
            {/* Chatbot Floating Button */}
            <button
                onClick={toggleChat}
                className="fixed bottom-4 left-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 z-50"
                aria-label="Toggle Chatbot"
            >
                <MessageSquareText size={24} />
            </button>

            {/* Chat Widget */}
            {isOpen && (
                <div className="fixed bottom-20 left-4 w-11/12 sm:w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col z-40 transition-all duration-300 ease-in-out transform origin-bottom-left scale-100 opacity-100">
                    {/* Widget Header */}
                    <div className="flex items-center justify-between p-4 bg-indigo-600 text-white rounded-t-lg shadow-md">
                        <h2 className="text-lg font-semibold">Chat with Bot</h2>
                        <button
                            onClick={toggleChat}
                            className="p-1 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                            aria-label="Close Chatbot"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Display Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-500 mt-10">
                                <p>Hello! How can I help you today?</p>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] p-3 rounded-lg shadow-sm text-sm ${msg.sender === 'user'
                                        ? 'bg-indigo-500 text-white rounded-br-none'
                                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[75%] p-3 rounded-lg shadow-sm bg-gray-200 text-gray-800 rounded-bl-none animate-pulse">
                                    Typing...
                                </div>
                            </div>
                        )}
                        <div /> {/* For auto-scrolling */}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex rounded-md shadow-sm overflow-hidden">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
                                disabled={isLoading} // Disable input while loading
                            />
                            <button
                                onClick={() => sendMessage(inputText)}
                                className="bg-indigo-600 text-white px-4 py-3 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading || inputText.trim() === ''} // Disable button while loading or if input is empty
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatbotWidget;