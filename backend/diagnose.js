const mongoose = require('mongoose');
require('dotenv').config();
const Purchase = require('./models/Purchase');
const Ticket = require('./models/Ticket');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const ids = ['69876cff10eddca7f7636983', '6987700010eddca7f7636996'];

        for (const id of ids) {
            console.log(`\nChecking ID: ${id}`);
            const purchase = await Purchase.findById(id);
            if (!purchase) {
                console.log('Purchase not found!');
            } else {
                console.log('Purchase found:', JSON.stringify(purchase, null, 2));
            }
        }

        const settings = await Ticket.findOne({ isActive: true });
        console.log('\nTicket Settings:', JSON.stringify(settings, null, 2));

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

check();
