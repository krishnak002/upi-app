import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const clientDistPath = path.resolve(__dirname, "../client/dist");

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
  if (fs.existsSync(clientDistPath)) {
    res.sendFile(path.join(clientDistPath, "index.html"));
    return;
  }

  res.json({
    message: "UPI Payment Server is running",
  });
});

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
      next();
      return;
    }

    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});