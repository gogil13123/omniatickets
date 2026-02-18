const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const PurchaseSchema = new mongoose.Schema({
    status: String,
    ticketQuantity: Number,
    confirmationCode: String
}, { timestamps: true });

const TicketSchema = new mongoose.Schema({
    totalTickets: Number,
    availableTickets: Number,
    isActive: Boolean
});

const Purchase = mongoose.model('Purchase_Cleanup', PurchaseSchema, 'purchases');
const Ticket = mongoose.model('Ticket_Cleanup', TicketSchema, 'tickets');

async function runCleanup() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const deleteRes = await Purchase.deleteMany({});
        console.log(`Successfully deleted ${deleteRes.deletedCount} purchase records.`);

        const ticket = await Ticket.findOne({ isActive: true });
        if (ticket) {
            ticket.availableTickets = ticket.totalTickets;
            await ticket.save();
            console.log(`Reset stock for ticket ID: ${ticket._id}. Available: ${ticket.availableTickets}/${ticket.totalTickets}`);
        } else {
            const anyTicket = await Ticket.findOne({});
            if (anyTicket) {
                anyTicket.availableTickets = anyTicket.totalTickets;
                anyTicket.isActive = true;
                await anyTicket.save();
                console.log(`Reset stock and activated ticket ID: ${anyTicket._id}. Available: ${anyTicket.availableTickets}`);
            }
        }
    } catch (err) {
        console.error('Cleanup Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

runCleanup();
