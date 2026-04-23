import mongoose from 'mongoose';
import User from './models/User.js';
import Transaction from './models/Transaction.js';
mongoose.connect('mongodb+srv://kingspluguser:SecurePass123@cluster0.gxnvhod.mongodb.net/nysonDatabase?retryWrites=true&w=majority');

async function run() {
    const users = await User.find({ btcAddressHistory: { $exists: true, $not: { $size: 0 } } });
    console.log("Users with BTC Addresses:");
    users.forEach(u => console.log(u.email, u.btcAddress, u.btcAddressHistory));

    const txs = await Transaction.find().sort({ createdAt: -1 });
    console.log("\nAll Transactions:", txs.length);
    txs.forEach(tx => {
        // Print essential fields for quick debugging
        console.log(`#${tx._id} txHash=${tx.txHash} to=${tx.toAddress} amountBTC=${tx.amountBTC} status=${tx.status} createdAt=${tx.createdAt}`);
    });

    const count = await Transaction.countDocuments();
    console.log("\nTotal count:", count);

    mongoose.disconnect();
}

run();
