const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });
const Purchase = require('c:/omniatickets/backend/models/Purchase.js');
const Ticket = require('c:/omniatickets/backend/models/Ticket.js');

async function clearAndReset() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const deleteRes = await Purchase.deleteMany({});
        console.log(`Deleted ${deleteRes.deletedCount} purchases`);

        const ticket = await Ticket.findOne({ isActive: true });
        if (ticket) {
            ticket.availableTickets = ticket.totalTickets;
            await ticket.save();
            console.log(`Stock reset for ticket ${ticket._id}. Available: ${ticket.availableTickets}`);
        } else {
            const anyTicket = await Ticket.findOne({});
            if (anyTicket) {
                anyTicket.availableTickets = anyTicket.totalTickets;
                anyTicket.isActive = true;
                await anyTicket.save();
                console.log(`Stock reset and activated for ticket ${anyTicket._id}. Available: ${anyTicket.availableTickets}`);
            }
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

clearAndReset();
