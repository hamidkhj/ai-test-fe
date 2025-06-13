import React, { useContext } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import TokenContext from '../../context/TokenContext.js';
import './header.css';

function Header() {
    const token = localStorage.getItem('authToken');
    const { user } = useContext(TokenContext);

    const logout = () => {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    };

    return (
        <div>
            <nav className="bg-blue-50 border-b border-blue-100 shadow-sm px-6 py-4 flex justify-between items-center">
                {/* App Logo */}
                <div className="text-2xl font-bold tracking-wide">
                    <Link
                        to="/"
                        className="text-blue-700 hover:text-blue-800 transition duration-200"
                    >
                        Shift Manager
                    </Link>
                </div>

                {/* Navigation / Auth Buttons */}
                <div className="flex items-center gap-4">
                    {token ? (
                        <>
                            <span className="text-sm text-gray-700">
                                Welcome,&nbsp;
                                <span className="font-semibold text-blue-700 capitalize">{user?.name}</span>
                            </span>
                            <button
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    `px-5 py-2 rounded-full text-sm font-semibold border transition ${
                                        isActive
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-blue-600 border border-blue-500 hover:bg-blue-600 hover:text-white'
                                    }`
                                }
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    `px-5 py-2 rounded-full text-sm font-semibold border transition ${
                                        isActive
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-blue-600 border border-blue-500 hover:bg-blue-600 hover:text-white'
                                    }`
                                }
                            >
                                Register
                            </NavLink>
                        </>
                    )}
                </div>
            </nav>
            <Outlet />
        </div>
    );
}

export default Header;
