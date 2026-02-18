const mongoose = require('mongoose');
require('dotenv').config();
const Purchase = require('./models/Purchase');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const purchases = await Purchase.find({}, '_id fullName status');
        console.log('--- ALL PURCHASES ---');
        purchases.forEach(p => {
            console.log(`ID: ${p._id}, Name: ${p.fullName}, Status: ${p.status}`);
        });
        console.log('--- END ---');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
