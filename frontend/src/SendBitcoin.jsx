import { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

export default function SendBitcoin() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const fetchAddress = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/bitcoin/address`
      );
      setAddress(res.data.address);
      setShow(true);
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

  return (
    <div className="send-container">
      <button onClick={fetchAddress} className="send-btn" disabled={loading}>
        {loading ? "Generating..." : "Send Bitcoin"}
      </button>

      {error && <p className="error-message">{error}</p>}

      {show && (
        <div className="address-box">
          <p className="btc-address">{address}</p>

          <button onClick={copyToClipboard}>Copy Address</button>

          <div className="qr-wrapper">
            {address && <QRCodeCanvas value={address} size={180} />}
          </div>
        </div>
      )}
    </div>
  );
}
