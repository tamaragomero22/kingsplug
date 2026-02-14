import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "./SendBitcoin.css";
import AddBankAccount from "./AddBankAccount";

const API_URL = import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === 'kingsplug.com' || window.location.hostname === 'www.kingsplug.com'
    ? 'https://api.kingsplug.com'
    : 'http://localhost:4000');

export default function SendBitcoin() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showBtcDetails, setShowBtcDetails] = useState(false);
  const [bankAccount, setBankAccount] = useState(null);
  const [showBankForm, setShowBankForm] = useState(false);

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/user/bank-account`, { withCredentials: true });
      if (res.data.success && res.data.bankAccount) {
        setBankAccount(res.data.bankAccount);
      }
    } catch (err) {
      console.error("Failed to fetch bank details:", err);
    }
  };

  const fetchAddress = async () => {
    if (!bankAccount) {
      alert("Please add a bank account first before you can convert bitcoin to cash.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_URL}/api/bitcoin/address`, { withCredentials: true });
      setAddress(res.data.address);
      setShowBtcDetails(true);
    } catch (err) {
      setError("Failed to fetch Bitcoin address. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    alert("Bitcoin address copied");
  };

  if (showBankForm) {
    return (
      <AddBankAccount
        onSave={(data) => {
          setBankAccount(data);
          setShowBankForm(false);
        }}
        onCancel={() => setShowBankForm(false)}
      />
    );
  }

  return (
    <div className="send-container">
      {bankAccount ? (
        <div className="bank-info-box" style={{
          background: "#f8f9fa",
          padding: "1.5rem",
          borderRadius: "1rem",
          border: "1px solid #e1e2e4",
          marginBottom: "1.5rem",
          textAlign: "left"
        }}>
          <h4 style={{ color: "#1a1a2e", marginBottom: "0.5rem", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Saved Bank Account</h4>
          <p style={{ color: "#1a1a2e", fontSize: "1.2rem", fontWeight: "bold", margin: "5px 0" }}>{bankAccount.accountName}</p>
          <p style={{ color: "#555", fontSize: "1rem" }}>{bankAccount.bankName} - {bankAccount.accountNumber}</p>
          <button
            onClick={() => setShowBankForm(true)}
            style={{
              background: "none",
              border: "none",
              color: "#9580ff",
              textDecoration: "underline",
              fontSize: "0.9rem",
              cursor: "pointer",
              padding: 0,
              marginTop: "10px",
              fontWeight: "600"
            }}
          >
            Change Account
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowBankForm(true)}
          className="bank-btn"
        >
          Add Bank Account
        </button>
      )}

      <button onClick={fetchAddress} className="send-btn" disabled={loading}>
        {loading ? "Generating..." : "Convert Bitcoin to Cash"}
      </button>

      {error && <p className="error-message">{error}</p>}

      {showBtcDetails && (
        <div className="address-box">
          <p className="btc-address">{address}</p>

          <button onClick={copyToClipboard} className="copy-btn">Copy Address</button>

          <div className="qr-wrapper">
            {address && <QRCodeCanvas value={address} size={180} />}
          </div>
        </div>
      )}
    </div>
  );
}
