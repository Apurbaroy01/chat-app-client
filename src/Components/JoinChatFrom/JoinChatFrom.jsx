import React from "react";
import { FaLock, FaDoorOpen } from "react-icons/fa";

const JoinChatFrom = ({onJoin, username, setUsername, roomId, setRoomId}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onJoin();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Join Chat Room
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Enter room details to start chatting
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Room Name */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Room Name</span>
                        </label>
                        <div className="relative">
                            <FaDoorOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Enter room name"
                                required
                                className="input input-bordered w-full pl-10"
                                onChange={(e)=>setUsername(e.target.value)}
                                value={username}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Password</span>
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Enter room password"
                                required
                                className="input input-bordered w-full pl-10"
                                onChange={(e)=>setRoomId(e.target.value)}
                                value={roomId}
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-4 text-lg"
                    >
                        Join Room
                    </button>
                </form>
            </div>
        </div>
    );
};

export default JoinChatFrom;
