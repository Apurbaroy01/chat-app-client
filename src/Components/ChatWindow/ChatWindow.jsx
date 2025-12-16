import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ChatWindow = ({ username, roomId, socket }) => {
    const [currentMessage, setCurentMesssage] = useState("");
    const [messages, setMessages] = useState([]);
    const [activityMsg, setActivityMsg] = useState("");
    const uuid = uuidv4();

    const handleInpurChange = (e) => {
        const value = e.target.value;
        setCurentMesssage(value);

        // Detecting typing activity
        socket.emit("user_typing", { username, roomId });

    };
    useEffect(() => {
        // user typing activity
        socket.on("user_typing", ({ username }) => {
            setActivityMsg(`${username} is typing...`);
            setTimeout(() => setActivityMsg(""), 3000);
        })

        return () => {
            socket.off("user_typing");
        }
    }, [socket])



    useEffect(() => {
        // receving message from server
        socket.on("message", ({ username, text, type }) => {
            setMessages(prevMessagea => [...prevMessagea, {
                id: uuid,
                username,
                text,
                type,


            }])
        })
        return () => {
            socket.off("message");
        }
    }, [socket]);

    useEffect(() => {
        socket.on("user_join_Room", ({ text }) => {
            setMessages(prev => [
                ...prev,
                {
                    id: uuidv4(),
                    type: "notif",
                    text,
                }
            ]);
        });

        return () => {
            socket.off("user_join_Room");
        };
    }, [socket]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            socket.emit("user_left_Room", { username, roomId });
        }

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        }
    }, [username, roomId])


    const handleSendMessage = (e) => {
        e.preventDefault();

        setMessages(prevMessagea => [...prevMessagea, {
            id: uuid,
            username,
            text: currentMessage,


        }])



        // sending message to server
        socket.emit("send_message", {
            username,
            roomId,
            text: currentMessage,
        })
        setCurentMesssage("");
    };

    return (
        <div className="flex flex-col h-screen bg-[#e5ddd5]">

            {/* Header */}
            <div className="bg-[#075e54] text-center text-white px-4 py-2 shadow">
                <h2 className="font-semibold text-lg">Room password: {roomId}</h2>
                <p className="text-sm opacity-90">Welcome, {username}</p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.map((message) => {
                    const { id, text, type, username: sender } = message;
                    const isOwnMessage = sender === username;

                    // Notification message (center)
                    if (type === "notif") {
                        return (
                            <div
                                key={id}
                                className="flex justify-center"
                            >
                                <span className="bg-yellow-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                                    {text}
                                </span>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={id}
                            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[75%] px-3 py-2 rounded-lg shadow 
                                    ${isOwnMessage
                                        ? "bg-[#dcf8c6] rounded-br-none"
                                        : "bg-white rounded-bl-none"
                                    }`}
                            >
                                {/* Sender name (only for received messages) */}
                                {!isOwnMessage && (
                                    <p className="text-[10px] font-semibold text-gray-600 mb-1">
                                        {sender}
                                    </p>
                                )}

                                {/* Message text */}
                                <p className="text-sm text-gray-800 break-words">
                                    {text}
                                </p>

                                {/* Time */}
                                <p className="text-[10px] text-gray-500 text-right mt-1">
                                    {new Date().toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    );
                })}
                {/* Typing Indicator */}
                {activityMsg && (
                    <div className="fixed bottom-16 left-4 flex items-center space-x-2 z-50">
                        <div className="bg-white px-4 py-2 rounded-xl shadow-md flex items-center space-x-2 animate-pulse">
                            <p className="text-sm text-gray-600 italic">{activityMsg}</p>
                            {/* Three dots animation */}
                            <div className="flex space-x-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Box */}
            <form
                onSubmit={handleSendMessage}
                className="bg-white px-3 py-2 flex items-center gap-2 border-t"
            >
                <input
                    type="text"
                    placeholder="Type a message"
                    value={currentMessage}
                    onChange={handleInpurChange}
                    required
                    className="flex-1 input input-bordered rounded-full"
                />
                <button
                    type="submit"
                    className="btn btn-circle btn-success text-white"
                >
                    ➤
                </button>
            </form>
        </div>
    );


};

export default ChatWindow;