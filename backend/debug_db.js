const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Ticket = require('./models/Ticket');

async function debug() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const tickets = await Ticket.find({});
        console.log('Total tickets in DB:', tickets.length);
        console.log('Tickets details:', JSON.stringify(tickets, null, 2));

        const activeTicket = await Ticket.findOne({ isActive: true });
        console.log('Active ticket found:', activeTicket ? 'Yes' : 'No');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
