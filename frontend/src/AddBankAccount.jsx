import { useState } from "react";
import axios from "axios";
import "./Dashboard.css"; // Reuse dashboard styles or add specific ones

const API_URL = import.meta.env.VITE_API_BASE_URL ||
    (window.location.hostname === 'kingsplug.com' || window.location.hostname === 'www.kingsplug.com'
        ? 'https://api.kingsplug.com'
        : 'http://localhost:4000');

const banks = [
    { name: "Access Bank", code: "044" },
    { name: "Citibank Nigeria", code: "023" },
    { name: "Ecobank Nigeria", code: "050" },
    { name: "Fidelity Bank", code: "070" },
    { name: "First Bank of Nigeria", code: "011" },
    { name: "First City Monument Bank (FCMB)", code: "214" },
    { name: "Globus Bank", code: "00103" },
    { name: "Guaranty Trust Bank (GTB)", code: "058" },
    { name: "Heritage Bank", code: "030" },
    { name: "Jaiz Bank", code: "301" },
    { name: "Keystone Bank", code: "082" },
    { name: "Kuda Bank", code: "50211" },
    { name: "Moniepoint MFB", code: "50515" },
    { name: "Opay", code: "999992" },
    { name: "Palmpay", code: "999991" },
    { name: "Polaris Bank", code: "076" },
    { name: "Providus Bank", code: "101" },
    { name: "Stanbic IBTC Bank", code: "221" },
    { name: "Standard Chartered Bank", code: "068" },
    { name: "Sterling Bank", code: "232" },
    { name: "Union Bank of Nigeria", code: "032" },
    { name: "United Bank For Africa (UBA)", code: "033" },
    { name: "Unity Bank", code: "215" },
    { name: "VFD Microfinance Bank", code: "566" },
    { name: "Wema Bank", code: "035" },
    { name: "Zenith Bank", code: "057" },
].sort((a, b) => a.name.localeCompare(b.name));

const AddBankAccount = ({ onSave, onCancel }) => {
    const [accountName, setAccountName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [bankCode, setBankCode] = useState("");
    const [bankName, setBankName] = useState("");
    const [loading, setLoading] = useState(false);
    const [resolving, setResolving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleResolveName = async (num, code) => {
        if (num.length === 10 && code) {
            setResolving(true);
            setError("");
            try {
                const response = await axios.post(
                    `${API_URL}/api/user/resolve-bank`,
                    { accountNumber: num, bankCode: code },
                    { withCredentials: true }
                );
                if (response.data.success) {
                    setAccountName(response.data.accountName);
                }
            } catch (err) {
                setAccountName("");
                setError("Could not resolve account name. Please verify details.");
            } finally {
                setResolving(false);
            }
        }
    };

    const handleNumberChange = (e) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
        setAccountNumber(val);
        if (val.length === 10 && bankCode) {
            handleResolveName(val, bankCode);
        }
    };

    const handleBankChange = (e) => {
        const code = e.target.value;
        const name = banks.find((b) => b.code === code)?.name || "";
        setBankCode(code);
        setBankName(name);
        if (accountNumber.length === 10 && code) {
            handleResolveName(accountNumber, code);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!accountName) {
            setError("Please ensure the account name is resolved.");
            return;
        }
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.post(
                `${API_URL}/api/user/bank-account`,
                { accountName, accountNumber, bankName },
                { withCredentials: true }
            );

            if (response.data.success) {
                setSuccess("Bank account saved successfully!");
                setTimeout(() => {
                    onSave(response.data.bankAccount);
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save bank account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-bank-container fade-up visible" style={{ marginTop: "2rem" }}>
            <form onSubmit={handleSubmit} className="bank-form" style={{
                background: "#f9fafc",
                padding: "2rem",
                borderRadius: "1rem",
                border: "1px solid #e1e2e4",
                textAlign: "left"
            }}>
                <h3 style={{ marginBottom: "1.5rem", color: "#1a1a2e", textAlign: "center" }}>
                    Add Bank Account
                </h3>

                {error && <p style={{ color: "red", fontSize: "0.9rem", marginBottom: "1rem" }}>{error}</p>}
                {success && <p style={{ color: "green", fontSize: "0.9rem", marginBottom: "1rem" }}>{success}</p>}

                <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#555" }}>
                        Select Bank
                    </label>
                    <select
                        value={bankCode}
                        onChange={handleBankChange}
                        style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd", background: "#fff" }}
                        required
                    >
                        <option value="">Choose a bank...</option>
                        {banks.map((bank) => (
                            <option key={bank.code} value={bank.code}>
                                {bank.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#555" }}>
                        Account Number
                    </label>
                    <input
                        type="text"
                        placeholder="10-digit number"
                        value={accountNumber}
                        onChange={handleNumberChange}
                        style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd" }}
                        required
                    />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#555" }}>
                        Account Name
                    </label>
                    <div style={{ position: "relative" }}>
                        <input
                            type="text"
                            placeholder={resolving ? "Resolving name..." : "Verified Account Name"}
                            value={accountName}
                            readOnly
                            style={{
                                width: "100%",
                                padding: "0.8rem",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                                background: "#eee",
                                color: "#333",
                                fontWeight: "bold"
                            }}
                            required
                        />
                        {resolving && (
                            <div style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                fontSize: "0.8rem",
                                color: "#666"
                            }}>
                                Searching...
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                        type="submit"
                        disabled={loading || resolving || !accountName}
                        className="cta-button"
                        style={{
                            flex: 1,
                            margin: 0,
                            opacity: (loading || resolving || !accountName) ? 0.7 : 1,
                            cursor: (loading || resolving || !accountName) ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading ? "Saving..." : "Save Account"}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            background: "#eee",
                            border: "none",
                            borderRadius: "50px",
                            padding: "1rem",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBankAccount;
