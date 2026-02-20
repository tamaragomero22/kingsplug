import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { generateNewAddress } from "../utils/walletService.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

/**
 * POST /api/bitcoin/generate-address
 * Returns existing address or generates a new one via Blockonomics.
 */
router.post("/generate-address", requireAuth, async (req, res) => {
  try {
    const user = req.user;

    // If user already has an address, return it
    if (user.btcAddress) {
      return res.json({
        success: true,
        address: user.btcAddress,
        isNew: false,
      });
    }

    // Generate a new address via Blockonomics
    const address = await generateNewAddress();

    // Save to user
    user.btcAddress = address;
    user.btcAddressHistory.push(address);
    await user.save();

    res.json({
      success: true,
      address,
      isNew: true,
    });
  } catch (error) {
    console.error("Generate address error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate Bitcoin address.",
    });
  }
});

/**
 * POST /api/bitcoin/new-address
 * Force-generates a new address (rotates), even if one already exists.
 */
router.post("/new-address", requireAuth, async (req, res) => {
  try {
    const user = req.user;

    // Generate a fresh address via Blockonomics
    const address = await generateNewAddress();

    // Archive old address (if any) and set the new one
    if (user.btcAddress && !user.btcAddressHistory.includes(user.btcAddress)) {
      user.btcAddressHistory.push(user.btcAddress);
    }
    user.btcAddress = address;
    user.btcAddressHistory.push(address);
    await user.save();

    res.json({
      success: true,
      address,
      isNew: true,
    });
  } catch (error) {
    console.error("New address error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate new Bitcoin address.",
    });
  }
});

/**
 * POST /api/bitcoin/webhook
 * Receives blockchain transaction notifications (e.g. from BlockCypher or Blockonomics).
 */
router.post("/webhook", async (req, res) => {
  try {
    const tx = req.body;

    if (!tx.hash && !tx.txid) {
      return res.sendStatus(400);
    }

    const txHash = tx.hash || tx.txid;

    // Try to find the user this transaction belongs to
    const toAddress = tx.addr || (tx.outputs && tx.outputs.find(o =>
      o.addresses
    )?.addresses?.[0]);

    let receivedSatoshis = 0;

    if (tx.value !== undefined) {
      // Blockonomics webhook format
      receivedSatoshis = tx.value;
    } else if (tx.outputs) {
      // BlockCypher webhook format
      const user = toAddress
        ? await User.findOne({ btcAddress: toAddress })
        : null;

      if (user) {
        tx.outputs.forEach((output) => {
          if (output.addresses && output.addresses.includes(user.btcAddress)) {
            receivedSatoshis += output.value;
          }
        });
      }
    }

    if (receivedSatoshis === 0) {
      return res.sendStatus(200);
    }

    const amountBTC = receivedSatoshis / 100000000;

    await Transaction.findOneAndUpdate(
      { txHash },
      {
        txHash,
        toAddress: toAddress || "unknown",
        amountBTC,
        confirmations: tx.confirmations || 0,
        status: (tx.confirmations || 0) >= 3 ? "confirmed" : "pending",
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
