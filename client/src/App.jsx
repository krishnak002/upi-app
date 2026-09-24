import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [detailsError, setDetailsError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    const loadPaymentDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/payment-details`);

        if (!response.ok) {
          throw new Error("Unable to load payment details");
        }

        const details = await response.json();
        setPaymentDetails(details);
      } catch {
        setDetailsError("Payment details could not be loaded. Please try again.");
      }
    };

    loadPaymentDetails();
  }, []);

  const quickAmounts = [100, 500, 1000, 2500];

  const handleUPIPayment = () => {
    if (!paymentDetails?.upiId) {
      setPaymentStatus("Payment details are still loading. Please try again.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setPaymentStatus("Please enter a valid amount.");
      return;
    }

    const upiUrl =
      `upi://pay?pa=${encodeURIComponent(paymentDetails.upiId)}` +
      `&pn=${encodeURIComponent(paymentDetails.receiverName)}` +
      `&am=${Number(amount)}` +
      `&cu=INR` +
      `&tn=${encodeURIComponent(name ? `Payment from ${name}` : "Payment from website")}`;

    setPaymentStatus("Opening your UPI app...");
    window.location.assign(upiUrl);

    window.setTimeout(() => {
      setPaymentStatus("If the UPI app did not open, use a mobile device with a UPI app installed.");
    }, 1500);
  };

  const handleCopyUpiId = async () => {
    if (!paymentDetails?.upiId) {
      return;
    }

    try {
      await navigator.clipboard.writeText(paymentDetails.upiId);
      setPaymentStatus("UPI ID copied. Open your UPI app and pay manually.");
    } catch {
      setPaymentStatus(`Copy this UPI ID: ${paymentDetails.upiId}`);
    }
  };

  const handleQuickAmount = (value) => {
    setAmount(value);
  };

  return (
    <div className="payment-page">

      {/* Background decoration */}
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      <div className="payment-container">

        {/* Header */}
        <div className="header">
          <div className="logo">₹</div>

          <div>
            <h1>Secure Payment</h1>
            <p>Pay directly using UPI</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="payment-card">

          <div className="card-top">
            <span>PAYMENT</span>

            <div className="secure">
              🔒 Secure
            </div>
          </div>

          <h2>Make a Payment</h2>

          <p className="description">
            Enter the amount you want to pay to {paymentDetails?.receiverName || "the receiver"} and continue with your preferred UPI application.
          </p>

          {detailsError && <p className="error-message">{detailsError}</p>}

          {/* Name */}
          <div className="input-group">
            <label>Your Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Amount */}
          <div className="input-group">
            <label>Enter Amount</label>

            <div className="amount-input">
              <span>₹</span>

              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Amount */}
          <div className="quick-section">

            <p>Quick Select</p>

            <div className="quick-buttons">
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  className={Number(amount) === value ? "active" : ""}
                  onClick={() => handleQuickAmount(value)}
                >
                  ₹{value}
                </button>
              ))}
            </div>

          </div>

          {/* UPI Information */}
          <div className="upi-box">

            <div className="upi-icon">
              UPI
            </div>

            <div>
              <small>Payment goes to</small>

            <button className="copy-button" onClick={handleCopyUpiId} type="button">
              Copy
            </button>
              <strong>{paymentDetails?.upiId || "Loading..."}</strong>
            </div>

          </div>

          {/* Pay Button */}
          <button
            className="pay-button"
            onClick={handleUPIPayment}
            disabled={!paymentDetails || Boolean(detailsError)}
            type="button"
          >
            Pay ₹{amount || "0"} with UPI
            <span>→</span>
          </button>

          {paymentStatus && <p className="payment-status" role="status">{paymentStatus}</p>}

          {/* Information */}
          <div className="info">

            <div>
              <span>✓</span>
              Direct UPI payment
            </div>

            <div>
              <span>✓</span>
              No card details required
            </div>

            <div>
              <span>✓</span>
              Payment goes to the receiver's bank account
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="footer">

          <p>
            Powered by UPI
          </p>

          <p>
            UPI ID: {paymentDetails?.upiId || "Loading..."}
          </p>

        </div>

      </div>

    </div>
  );
}

export default App;