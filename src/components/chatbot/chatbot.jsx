import { useState } from 'react';
import { MessageSquareText, X } from 'lucide-react';
import axios from "../../Axios/axios.js";

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false); // State to control widget visibility
    const [messages, setMessages] = useState([]); // State to store chat messages
    const [inputText, setInputText] = useState(''); // State for the user's input field
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator during API call


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
            const response = await axios.post('/chatbot/chat', payload);

            let botResponseText = "Sorry, I couldn't get a response from the bot. Please try again.";
            if (response.data && response.data.message) {
                botResponseText = response.data.message;
            }

            const botMessage = { sender: 'bot', text: botResponseText };
            setMessages((prevMessages) => [...prevMessages, botMessage]);

        } catch (error) {
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
        <div>

            <button
                onClick={toggleChat}
                className="fixed bottom-4 left-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 z-50"
                aria-label="Toggle Chatbot"
            >
                <MessageSquareText size={24} />
            </button>


            {isOpen && (
                <div
                    style={{ position: 'fixed', bottom: '5rem', left: '1rem' }}
                >

                    <div>
                        <h2>Chat with Bot</h2>
                        <button
                            onClick={toggleChat}
                            aria-label="Close Chatbot"
                        >
                            <X size={20} />
                        </button>
                    </div>


                    <div>
                        {messages.length === 0 && (
                            <div>
                                <p>Hello! How can I help you today?</p>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                            >
                                <div>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div>
                                <div>
                                    Typing...
                                </div>
                            </div>
                        )}
                        <div />
                    </div>

                    <div>
                        <div>
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                disabled={isLoading}
                            />
                            <button
                                onClick={() => sendMessage(inputText)}
                                disabled={isLoading || inputText.trim() === ''}
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