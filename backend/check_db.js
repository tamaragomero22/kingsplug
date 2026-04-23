import mongoose from 'mongoose';
import User from './models/User.js';
import Transaction from './models/Transaction.js';
mongoose.connect('mongodb+srv://kingspluguser:SecurePass123@cluster0.gxnvhod.mongodb.net/nysonDatabase?retryWrites=true&w=majority');

async function run() {
    const users = await User.find({ btcAddressHistory: { $exists: true, $not: {$size: 0} } });
    console.log("Users with BTC Addresses:");
    users.forEach(u => console.log(u.email, u.btcAddress, u.btcAddressHistory));

    const txs = await Transaction.find();
    console.log("\nAll Transactions:");
    console.log(txs);

    mongoose.disconnect();
}

run();
