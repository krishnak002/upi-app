import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

/*
  GET PAYMENT DETAILS
*/

app.get("/api/payment-details", (req, res) => {
  res.json({
    receiverName: process.env.RECEIVER_NAME,
    upiId: process.env.UPI_ID,
  });
});


/*
  HEALTH CHECK
*/

app.get("/", (req, res) => {
  res.json({
    message: "UPI Payment Server is running",
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});