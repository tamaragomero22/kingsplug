import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const API_URL = import.meta.env.VITE_API_BASE_URL ||
    (window.location.hostname === 'kingsplug.com' || window.location.hostname === 'www.kingsplug.com'
        ? 'https://api.kingsplug.com'
        : 'http://localhost:4000');

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('Transactions');
    const [transactions, setTransactions] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/transactions/stats`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setPendingCount(data.pendingCount);
            }
        } catch (error) {
            console.error('Fetch stats failed', error);
        }
    };

    const fetchAdminData = async () => {
        setIsLoading(true);
        await fetchStats();
        try {
            const res = await fetch(`${API_URL}/api/admin/transactions`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setTransactions(data.transactions);
            }
        } catch (error) {
            console.error('Fetch admin transactions failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisburseToggle = async (txId, currentStatus) => {
        try {
            const res = await fetch(`${API_URL}/api/admin/transactions/${txId}/disburse`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isDisbursed: !currentStatus }),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                // Update local state without full refetch
                setTransactions(transactions.map(tx =>
                    tx._id === txId ? { ...tx, isDisbursed: !currentStatus } : tx
                ));
                // Update pending count stat
                fetchStats();
            }
        } catch (error) {
            console.error('Failed to toggle disbursement', error);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: 'GET',
                credentials: 'include'
            });
            navigate('/admin');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const navItems = [
        { name: 'Transactions', icon: 'M15 12H9v-2h6v2zm2-6H7v2h10V6zm-4 10H7v2h6v-2z' },
        { name: 'Accounts', icon: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10z' },
        { name: 'Settings', icon: 'M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z' },
    ];

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
                {/* Top Navbar Component inside main content area */}
                <div className="admin-top-navbar">
                    <div className="breadcrumb">Admin / {activeMenu}</div>
                    <div className="top-nav-actions">
                        <div className="notification-bell">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            {pendingCount > 0 && (
                                <span className="notification-badge">{pendingCount}</span>
                            )}
                        </div>
                    </div>
                </div>

                {activeMenu === 'Transactions' && (
                    <div className="transactions-content">
                        {/* Transactions Table Area */}
                        <div className="table-container">
                            <h3>All Conversion Requests</h3>
                            <div className="table-responsive">
                                <table className="transactions-table admin-tx-table">
                                    <thead>
                                        <tr>
                                            <th>Date Received</th>
                                            <th>User Details</th>
                                            <th>Tx Hash</th>
                                            <th>Amount (BTC)</th>
                                            <th>Est. Naira</th>
                                            <th>Blockchain Status</th>
                                            <th>Disbursed?</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr><td colSpan="7" className="empty-state">Loading transactions...</td></tr>
                                        ) : transactions.length === 0 ? (
                                            <tr><td colSpan="7" className="empty-state">No transactions found.</td></tr>
                                        ) : (
                                            transactions.map(tx => {
                                                const txDate = new Date(tx.createdAt).toLocaleString(undefined, {
                                                    month: 'short', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                });
                                                const estNaira = (tx.amountBTC * 1400).toLocaleString('en-NG', { maximumFractionDigits: 2 });

                                                return (
                                                    <tr key={tx._id} className={!tx.isDisbursed ? "highlight-pending" : ""}>
                                                        <td>{txDate}</td>
                                                        <td className="admin-user-cell">
                                                            {tx.user ? (
                                                                <>
                                                                    <div className="user-name">{tx.user.name}</div>
                                                                    <div className="user-email">{tx.user.email}</div>
                                                                </>
                                                            ) : (
                                                                <span className="user-unknown">Unknown Address</span>
                                                            )}
                                                        </td>
                                                        <td className="tx-hash" title={tx.txHash}>
                                                            {tx.txHash.substring(0, 8)}...{tx.txHash.substring(tx.txHash.length - 6)}
                                                        </td>
                                                        <td className="tx-amount">{tx.amountBTC.toFixed(6)}</td>
                                                        <td className="tx-fiat">~&#8358;{estNaira}</td>
                                                        <td>
                                                            <span className={`tx-status ${tx.status}`}>
                                                                {tx.status}
                                                            </span>
                                                        </td>
                                                        <td className="action-cell">
                                                            <label className="checkbox-container">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={tx.isDisbursed}
                                                                    onChange={() => handleDisburseToggle(tx._id, tx.isDisbursed)}
                                                                />
                                                                <span className="checkmark"></span>
                                                            </label>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
