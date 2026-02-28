import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('Transactions');

    const handleLogout = () => {
        // Here we could also call the logout API to clear the cookie
        navigate('/admin');
    };

    const navItems = [
        { name: 'Dashboard', icon: 'M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z' },
        { name: 'Accounts', icon: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10z' },
        { name: 'Transactions', icon: 'M15 12H9v-2h6v2zm2-6H7v2h10V6zm-4 10H7v2h6v-2z' }, // Simplistic list icon
        { name: 'Budgeting', icon: 'M11 2v4c0 1.1-.9 2-2 2H5C3.9 8 3 7.1 3 6V2h8zm10 0v4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2V2h8zM11 10v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h8zm10 0v12c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2V10h8z' },
        { name: 'Goals', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z' },
        { name: 'Reports', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z' },
        { name: 'Bills', icon: 'M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V8h14v10z' },
        { name: 'Settings', icon: 'M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z' },
    ];

    const filterTags = ["All", "Income", "Food", "Transport", "Housing", "Entertainment", "Utilities", "Shopping", "Healthcare", "Education", "Travel", "Other"];

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <div className="admin-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path>
                        </svg>
                        <h2>Finance</h2>
                    </div>
                </div>

                <ul className="sidebar-nav">
                    {navItems.map((item) => (
                        <li
                            key={item.name}
                            className={`nav-item ${activeMenu === item.name ? 'active' : ''}`}
                            onClick={() => setActiveMenu(item.name)}
                        >
                            <svg className="nav-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d={item.icon} />
                            </svg>
                            {item.name}
                        </li>
                    ))}
                </ul>

                <div className="sidebar-footer">
                    <div className="user-profile" onClick={handleLogout}>
                        <div className="avatar">N</div>
                        <div className="logout-text">Logout</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="admin-main">
                <div className="main-header">
                    <h1>{activeMenu}</h1>
                    <p>View and manage your financial {activeMenu.toLowerCase()}.</p>
                </div>

                {activeMenu === 'Transactions' && (
                    <div className="transactions-content">
                        {/* Summary Cards */}
                        <div className="summary-cards">
                            <div className="card">
                                <h3>Total Income</h3>
                                <div className="amount positive">+$5200.00 <span className="arrow">↑</span></div>
                            </div>
                            <div className="card">
                                <h3>Total Expenses</h3>
                                <div className="amount negative">-$3055.00 <span className="arrow">↓</span></div>
                            </div>
                            <div className="card">
                                <h3>Net Change</h3>
                                <div className="amount positive">+$2145.00 <span className="arrow">↑</span></div>
                            </div>
                        </div>

                        {/* Filter Chips */}
                        <div className="filter-chips">
                            {filterTags.map(tag => (
                                <button key={tag} className={`chip ${tag === 'All' ? 'active' : ''}`}>{tag}</button>
                            ))}
                        </div>

                        {/* Search and Filters Row */}
                        <div className="search-filter-row">
                            <div className="search-wrapper">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <input type="text" placeholder="Search transactions..." />
                            </div>
                            <button className="apply-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"></path>
                                </svg> Apply
                            </button>
                        </div>

                        <div className="secondary-filters-row">
                            <select className="filter-select"><option>Account</option></select>
                            <select className="filter-select"><option>Category</option></select>
                            <select className="filter-select"><option>Type</option></select>
                            <input type="text" placeholder="dd/mm/yyyy" className="date-input" />
                            <input type="text" placeholder="dd/mm/yyyy" className="date-input" />
                            <button className="add-transaction-btn">+ Add Transaction</button>
                        </div>

                        {/* Transactions Table Area */}
                        <div className="table-container">
                            <h3>All Transactions</h3>
                            <table className="transactions-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Account</th>
                                        <th>Description</th>
                                        <th>Category</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan="7" className="empty-state">No transactions found.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
