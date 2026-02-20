import { useState, useEffect } from "react";
import axios from "axios";
import "./SendBitcoin.css";
import AddBankAccount from "./AddBankAccount";

const API_URL = import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === 'kingsplug.com' || window.location.hostname === 'www.kingsplug.com'
    ? 'https://api.kingsplug.com'
    : 'http://localhost:4000');

const CURRENCY_OPTIONS = [
  { label: "Nigerian Naira (NGN)", value: "NGN", symbol: "₦" },
];

export default function SendBitcoin() {
  const [bankAccount, setBankAccount] = useState(null);
  const [showBankForm, setShowBankForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreeNetwork, setAgreeNetwork] = useState(false);
  const [agreeMinPayout, setAgreeMinPayout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);
  const [copied, setCopied] = useState(false);
  const [generatingNew, setGeneratingNew] = useState(false);

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

  const handleConvertClick = () => {
    setShowDropdown((prev) => !prev);
    setSelectedCurrency(null);
    setSelectedAccount(null);
    setShowAgreement(false);
    setAgreeNetwork(false);
    setAgreeMinPayout(false);
    setWalletAddress(null);
    setError("");
  };

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    setSelectedAccount(null);
    setShowAgreement(false);
    setAgreeNetwork(false);
    setAgreeMinPayout(false);
    setWalletAddress(null);
    setError("");
  };

  const handleConfirmAccount = () => {
    if (!selectedAccount) {
      setError("Please select a payout account to proceed.");
      return;
    }
    setError("");
    setShowAgreement(true);
  };

  const handleContinue = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${API_URL}/api/bitcoin/generate-address`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setWalletAddress(res.data.address);
        setShowAgreement(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate wallet address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestNewAddress = async () => {
    setGeneratingNew(true);
    setCopied(false);
    setError("");
    try {
      const res = await axios.post(
        `${API_URL}/api/bitcoin/new-address`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setWalletAddress(res.data.address);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate new address.");
    } finally {
      setGeneratingNew(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showBankForm) {
    return (
      <AddBankAccount
        onSave={(data) => {
          setBankAccount(data);
          setSelectedAccount(data);
          setShowBankForm(false);
        }}
        onCancel={() => setShowBankForm(false)}
      />
    );
  }

  return (
    <div className="send-container">
      {/* Main convert button */}
      <button onClick={handleConvertClick} className="send-btn">
        {showDropdown ? "Close" : "Convert Bitcoin to Cash"}
      </button>

      {/* Animated dropdown panel */}
      {showDropdown && (
        <div className="currency-dropdown">
          {/* Step 1 — Currency selection */}
          <p className="dropdown-title">Select your currency</p>
          <div className="currency-options">
            {CURRENCY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`currency-option${selectedCurrency?.value === opt.value ? " selected" : ""}`}
                onClick={() => handleCurrencySelect(opt)}
              >
                <span className="currency-symbol">{opt.symbol}</span>
                <span className="currency-label">{opt.label}</span>
                {selectedCurrency?.value === opt.value && (
                  <span className="currency-check">✓</span>
                )}
              </button>
            ))}
          </div>

          {/* Step 2 — Payout account selection */}
          {selectedCurrency && !walletAddress && !showAgreement && (
            <div className="payout-section">
              <p className="payout-section-title">Select your Nigerian Payout Account</p>

              {bankAccount ? (
                <>
                  <button
                    className={`payout-account-card${selectedAccount ? " selected" : ""}`}
                    onClick={() => setSelectedAccount(bankAccount)}
                  >
                    <div className="payout-account-info">
                      <span className="payout-bank-icon">🏦</span>
                      <div className="payout-account-details">
                        <span className="payout-account-name">{bankAccount.accountName}</span>
                        <span className="payout-account-sub">
                          {bankAccount.bankName} &bull; {bankAccount.accountNumber}
                        </span>
                      </div>
                    </div>
                    {selectedAccount && <span className="currency-check">✓</span>}
                  </button>

                  <button
                    className="add-payout-btn"
                    onClick={() => setShowBankForm(true)}
                  >
                    + Add new payout account
                  </button>
                </>
              ) : (
                <button
                  className="add-payout-btn add-payout-btn--primary"
                  onClick={() => setShowBankForm(true)}
                >
                  + Add new payout account
                </button>
              )}

              {error && <p className="error-message">{error}</p>}

              {selectedAccount && (
                <button onClick={handleConfirmAccount} className="proceed-btn">
                  Confirm payout account
                </button>
              )}
            </div>
          )}

          {/* Step 3 — Confirmation Agreement */}
          {showAgreement && !walletAddress && (
            <div className="agreement-section">
              <h4 className="agreement-title">Confirmation Agreement</h4>
              <p className="agreement-desc">
                Please agree to the terms and conditions below to generate your wallet address for converting your bitcoin to Naira.
              </p>

              <label className="agreement-checkbox">
                <input
                  type="checkbox"
                  checked={agreeNetwork}
                  onChange={(e) => setAgreeNetwork(e.target.checked)}
                />
                <span>
                  I agree that I am transferring Bitcoin from the BTC network that supports this wallet address.
                </span>
              </label>

              <p className="agreement-warning">
                Kingsplug is not responsible for any loss by sending assets to the wrong wallet address or through the wrong network.
              </p>

              <label className="agreement-checkbox">
                <input
                  type="checkbox"
                  checked={agreeMinPayout}
                  onChange={(e) => setAgreeMinPayout(e.target.checked)}
                />
                <span>I am aware that the minimum payout is ₦1,000</span>
              </label>

              {error && <p className="error-message">{error}</p>}

              <button
                onClick={handleContinue}
                className="proceed-btn"
                disabled={loading || !agreeNetwork || !agreeMinPayout}
              >
                {loading ? "Generating address..." : "Continue"}
              </button>
            </div>
          )}

          {/* Step 4 — Wallet Address Display */}
          {walletAddress && (
            <div className="wallet-address-section">
              <div className="wallet-address-card">
                <p className="wallet-address-label">Your Bitcoin Wallet Address</p>
                <p className="wallet-address-value">{walletAddress}</p>
                <div className="wallet-actions">
                  <button onClick={handleCopy} className="wallet-copy-btn">
                    {copied ? "✓ Copied!" : "📋 Copy Address"}
                  </button>
                  <button
                    onClick={handleRequestNewAddress}
                    className="wallet-new-btn"
                    disabled={generatingNew}
                  >
                    {generatingNew ? "Generating..." : "🔄 Request new address"}
                  </button>
                </div>
              </div>
              <p className="wallet-info-text">
                Send Bitcoin (BTC) to the address above. Only send BTC via the <strong>Bitcoin (BTC)</strong> network.
              </p>
              {error && <p className="error-message">{error}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
