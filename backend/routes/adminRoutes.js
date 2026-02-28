import express from "express";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * GET /api/admin/transactions/stats
 * Get the count of undisbursed transactions for the notification badge
 */
router.get("/transactions/stats", async (req, res) => {
    try {
        const pendingCount = await Transaction.countDocuments({ isDisbursed: false });
        res.json({ success: true, pendingCount });
    } catch (error) {
        console.error("Admin stats error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch stats" });
    }
});

/**
 * GET /api/admin/transactions
 * Get all transactions across all users.
 * Attempts to attach user information (email, name) by matching toAddress to btcAddressHistory.
 */
router.get("/transactions", async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 }).lean();

        // Fetch all users that have generated a BTC address
        const usersWithBtc = await User.find(
            { btcAddressHistory: { $exists: true, $ne: [] } },
            'firstName lastName email btcAddressHistory btcAddress'
        ).lean();

        // Create a fast lookup map: address -> User details
        const addressToUserMap = {};
        usersWithBtc.forEach(user => {
            if (user.btcAddress) addressToUserMap[user.btcAddress] = user;
            user.btcAddressHistory.forEach(addr => {
                addressToUserMap[addr] = user;
            });
        });

        // Map through transactions and attach user info if found
        const enrichedTransactions = transactions.map(tx => {
            const userMatch = addressToUserMap[tx.toAddress];
            return {
                ...tx,
                user: userMatch ? {
                    name: `${userMatch.firstName} ${userMatch.lastName}`,
                    email: userMatch.email
                } : null
            };
        });

        res.json({ success: true, transactions: enrichedTransactions });
    } catch (error) {
        console.error("Admin fetch transactions error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch all transactions" });
    }
});

/**
 * PUT /api/admin/transactions/:id/disburse
 * Mark a transaction as disbursed (paid out)
 */
router.put("/transactions/:id/disburse", async (req, res) => {
    try {
        const { id } = req.params;
        const { isDisbursed } = req.body;

        const transaction = await Transaction.findByIdAndUpdate(
            id,
            { isDisbursed: isDisbursed },
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        res.json({ success: true, transaction });
    } catch (error) {
        console.error("Admin disburse transaction error:", error);
        res.status(500).json({ success: false, message: "Failed to update transaction status" });
    }
});

export default router;
