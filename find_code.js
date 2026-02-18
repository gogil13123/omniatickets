const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });
const Purchase = require('./backend/models/Purchase');

async function findCode() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const p = await Purchase.findOne({ status: 'confirmed' });
        if (p) {
            console.log('FOUND_CODE:' + p.confirmationCode);
        } else {
            console.log('NO_CODE_FOUND');
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

findCode();
