import express from "express";
import axios from "axios";
import Transaction from "../models/Transaction.js";

const router = express.Router();

router.get("/address", (req, res) => {
  const address = process.env.PLATFORM_BTC_ADDRESS;
  if (!address) {
    console.error("PLATFORM_BTC_ADDRESS environment variable not set.");
    return res
      .status(500)
      .json({ error: "Server configuration error: Missing Bitcoin address." });
  }
  res.json({ address });
});

router.get("/transactions", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.blockcypher.com/v1/btc/main/addrs/${process.env.PLATFORM_BTC_ADDRESS}`,
      { params: { token: process.env.BLOCKCYPHER_TOKEN } }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

router.post("/register-webhook", async (req, res) => {
  try {
    const response = await axios.post(
      `https://api.blockcypher.com/v1/btc/main/hooks?token=${process.env.BLOCKCYPHER_TOKEN}`,
      {
        event: "tx-confirmation",
        address: process.env.PLATFORM_BTC_ADDRESS,
        url: `${process.env.WEBHOOK_URL}/api/bitcoin/webhook`,
        confirmations: 3,
      }
    );

    res.json({
      message: "Webhook registered successfully",
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({ error: "Webhook registration failed" });
  }
});

router.post("/webhook", async (req, res) => {
  try {
    const tx = req.body;

    /*
      BlockCypher sends:
      - hash
      - confirmations
      - outputs[]
    */

    if (!tx.hash || !tx.outputs) {
      return res.sendStatus(400);
    }

    let receivedSatoshis = 0;

    tx.outputs.forEach((output) => {
      if (
        output.addresses &&
        output.addresses.includes(process.env.PLATFORM_BTC_ADDRESS)
      ) {
        receivedSatoshis += output.value;
      }
    });

    if (receivedSatoshis === 0) {
      return res.sendStatus(200);
    }

    const amountBTC = receivedSatoshis / 100000000;

    await Transaction.findOneAndUpdate(
      { txHash: tx.hash },
      {
        txHash: tx.hash,
        toAddress: process.env.PLATFORM_BTC_ADDRESS,
        amountBTC,
        confirmations: tx.confirmations,
        status: tx.confirmations >= 3 ? "confirmed" : "pending",
      },
      { upsert: true }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error);
    res.sendStatus(500);
  }
});

export default router;
