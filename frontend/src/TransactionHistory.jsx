import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import "./TransactionHistory.css";

const API_URL = import.meta.env.VITE_API_BASE_URL ||
    (window.location.hostname === "kingsplug.com" || window.location.hostname === "www.kingsplug.com"
        ? "https://api.kingsplug.com"
        : "http://localhost:4000");

const TransactionHistory = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [btcRate, setBtcRate] = useState(0);
    const [btcUsdRate, setBtcUsdRate] = useState(0);

    useEffect(() => {
        fetchDashboardData();
        fetchBtcPrice();
        fetchBankAccount();
    }, []);

    const fetchBankAccount = async () => {
        try {
            const res = await fetch(`${API_URL}/api/user/bank-account`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.bankAccount) {
                    setBankName(data.bankAccount.bankName);
                    setAccountNumber(data.bankAccount.accountNumber);
                }
            }
        } catch (err) {
            console.error("Bank account fetch error:", err);
        }
    };

    const fetchDashboardData = async () => {
        try {
            const response = await fetch(`${API_URL}/api/dashboard/data`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!response.ok) {
                navigate("/");
                return;
            }

            const data = await response.json();
            setUserEmail(data.user.email);
            setFirstName(data.user.firstName);
            setLastName(data.user.lastName);

            // After confirming user auth, fetch transactions
            fetchTransactions();
        } catch (error) {
            console.error("Failed to fetch user data:", error.message);
            navigate("/");
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await fetch(`${API_URL}/api/bitcoin/transactions`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch transactions");
            }

            const data = await response.json();
            if (data.success) {
                setTransactions(data.transactions);
            } else {
                setErrorMessage(data.message || "Failed to load transactions.");
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setErrorMessage("Could not connect to the server.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch current BTC rate to estimate Naira equivalency
    const fetchBtcPrice = async () => {
        try {
            const res = await fetch(
                "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,ngn"
            );
            if (res.ok) {
                const data = await res.json();
                setBtcRate(data.bitcoin.ngn);
                setBtcUsdRate(data.bitcoin.usd);
            }
        } catch (err) {
            console.error("BTC price fetch error:", err);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <>
            <Nav
                userEmail={userEmail}
                firstName={firstName}
                onLogout={handleLogout}
                logoLinkTo="/dashboard"
            />
            <div className="transactions-page-container">
                <div className="transactions-header">
                    <h2>Transaction History</h2>
                    <p>View all your completed and pending Bitcoin to Naira conversions.</p>
                </div>

                <div className="transactions-content-wrapper">
                    {isLoading ? (
                        <div className="loading-state">Loading your transactions...</div>
                    ) : errorMessage ? (
                        <div className="error-state">{errorMessage}</div>
                    ) : transactions.length === 0 ? (
                        <div className="empty-state">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                                <line x1="2" y1="10" x2="22" y2="10"></line>
                            </svg>
                            <h3>No Transactions Yet</h3>
                            <p>You haven't made any Bitcoin deposits yet. Once you do, they will appear here.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="user-transactions-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Transaction Hash</th>
                                        <th>BTC</th>
                                        <th>Dollar Value</th>
                                        <th>Naira Value</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => {
                                        const txDate = new Date(tx.createdAt).toLocaleString(undefined, {
                                            year: 'numeric', month: 'short', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        });

                                        // Simple estimate using current live rate, or a hardcoded rate if live fails
                                        const rateToUse = btcRate > 0 ? btcRate : 140000000; // rough fallback
                                        const estNaira = (tx.amountBTC * rateToUse).toLocaleString('en-NG', { maximumFractionDigits: 2 });

                                        const usdRateToUse = btcUsdRate > 0 ? btcUsdRate : 100000; // rough fallback USD
                                        const estDollar = (tx.amountBTC * usdRateToUse).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

                                        return (
                                            <tr key={tx._id} className="clickable-row" onClick={() => setSelectedTransaction(tx)}>
                                                <td className="tx-date">{txDate}</td>
                                                <td className="tx-hash" title={tx.txHash}>
                                                    {tx.txHash.substring(0, 10)}...{tx.txHash.substring(tx.txHash.length - 8)}
                                                </td>
                                                <td className="tx-amount">{tx.amountBTC.toFixed(8)} BTC</td>
                                                <td className="tx-fiat">{estDollar}</td>
                                                <td className="tx-fiat">&#8358;{estNaira}</td>
                                                <td>
                                                    <span className={`tx-status ${tx.status}`}>
                                                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {selectedTransaction && (
                <div className="transaction-modal-overlay" onClick={() => setSelectedTransaction(null)}>
                    <div className="transaction-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="transaction-modal-header">
                            <h3>Transaction Details</h3>
                            <button className="close-modal-btn" onClick={() => setSelectedTransaction(null)}>&times;</button>
                        </div>
                        <div className="transaction-modal-body">
                            <div className="detail-row">
                                <span className="detail-label">Sender Name:</span>
                                <span className="detail-value">{firstName} {lastName}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Bank Name:</span>
                                <span className="detail-value">{bankName || "N/A"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Account Number:</span>
                                <span className="detail-value">{accountNumber || "N/A"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Date:</span>
                                <span className="detail-value">
                                    {new Date(selectedTransaction.createdAt).toLocaleString(undefined, {
                                        year: 'numeric', month: 'long', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Transaction Hash:</span>
                                <span className="detail-value tx-hash-full" style={{wordBreak: "break-all", fontSize: "0.9rem"}}>{selectedTransaction.txHash}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Amount (BTC):</span>
                                <span className="detail-value">{selectedTransaction.amountBTC.toFixed(8)} BTC</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Dollar Value:</span>
                                <span className="detail-value">
                                    {(selectedTransaction.amountBTC * (btcUsdRate > 0 ? btcUsdRate : 100000)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Naira Value:</span>
                                <span className="detail-value">
                                    &#8358;{(selectedTransaction.amountBTC * (btcRate > 0 ? btcRate : 140000000)).toLocaleString('en-NG', { maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Status:</span>
                                <span className={`detail-value tx-status ${selectedTransaction.status}`}>
                                    {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default TransactionHistory;
