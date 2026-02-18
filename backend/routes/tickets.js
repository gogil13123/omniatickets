const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const auth = require('../middleware/auth');

// @route   GET api/tickets
// @desc    Get active ticket details
// @access  Public
router.get('/', async (req, res) => {
    try {
        let ticket = await Ticket.findOne({ isActive: true });
        if (!ticket) {
            ticket = await Ticket.findOne({}); // Try to find ANY ticket
        }

        // Return default object if still none found
        const responseData = ticket ? ticket.toObject() : {
            totalTickets: 500,
            availableTickets: 500,
            price: 30,
            locationTitle: 'ლოკაცია და დრო',
            locationText: 'თბილისი, ექსკლუზიური ტერიტორია. 24 მაისი, 22:00-დან გვიანობამდე.',
            lineupTitle: 'ლაინაფი',
            lineupText: 'საუკეთესო DJ-ები და დაუვიწყარი ვიზუალური ეფექტები.',
            promoText: 'ბილეთების რაოდენობა მკაცრად შეზღუდულია. იჩქარე და დაიკავე ადგილი წლის მთავარ მოვლენაზე.'
        };

        res.json(responseData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/tickets/update
// @desc    Update ticket settings
// @access  Private (Admin)
router.post('/update', auth, async (req, res) => {
    let {
        totalTickets,
        price,
        locationTitle,
        locationText,
        lineupTitle,
        lineupText,
        promoText
    } = req.body;

    console.log('Update Ticket Request Received:', { totalTickets, price, locationTitle });

    // Convert to numbers and handle empty strings or invalid values
    totalTickets = (totalTickets === '' || isNaN(Number(totalTickets))) ? 0 : Number(totalTickets);
    price = (price === '' || isNaN(Number(price))) ? 0 : Number(price);

    try {
        let ticket = await Ticket.findOne({ isActive: true });
        if (!ticket) {
            console.log('No active ticket found, searching for ANY ticket...');
            ticket = await Ticket.findOne({});
        }

        if (!ticket) {
            console.log('No ticket exists, creating new one...');
            ticket = new Ticket({
                totalTickets,
                availableTickets: totalTickets,
                price,
                locationTitle,
                locationText,
                lineupTitle,
                lineupText,
                promoText
            });
        } else {
            console.log('Updating existing ticket:', ticket._id);
            // Sync available tickets if totalTickets changed
            const diff = totalTickets - ticket.totalTickets;
            ticket.availableTickets += diff;

            // Safety cap: available should not exceed total
            if (ticket.availableTickets > totalTickets) {
                ticket.availableTickets = totalTickets;
            }
            // Floor at zero
            if (ticket.availableTickets < 0) {
                ticket.availableTickets = 0;
            }

            ticket.totalTickets = totalTickets;
            ticket.price = price;
            ticket.isActive = true; // Ensure it becomes/stays active

            if (locationTitle !== undefined) ticket.locationTitle = locationTitle;
            if (locationText !== undefined) ticket.locationText = locationText;
            if (lineupTitle !== undefined) ticket.lineupTitle = lineupTitle;
            if (lineupText !== undefined) ticket.lineupText = lineupText;
            if (promoText !== undefined) ticket.promoText = promoText;
        }

        const savedTicket = await ticket.save();
        console.log('Ticket Saved Successfully:', savedTicket._id);
        res.json(savedTicket);
    } catch (err) {
        console.error('Ticket Update Error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
