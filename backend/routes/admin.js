const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Purchase = require('../models/Purchase');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const Ticket = require('../models/Ticket');

// @route   POST api/admin/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        let admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { admin: { id: admin.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/admin/confirm/:id
// @desc    Confirm purchase and send email
// @access  Private
router.post('/confirm/:id', auth, async (req, res) => {
    try {
        console.log(`Attempting to confirm purchase ID: ${req.params.id}`);
        const purchase = await Purchase.findById(req.params.id);
        if (!purchase) {
            console.warn(`Purchase NOT FOUND in DB: ${req.params.id}`);
            return res.status(404).json({ msg: 'Purchase not found' });
        }
        console.log(`Found purchase: ${purchase.fullName} (Status: ${purchase.status})`);

        const prevStatus = purchase.status;
        purchase.status = 'confirmed';
        await purchase.save();

        // If it was rejected, we need to decrement stock again
        if (prevStatus === 'rejected') {
            const ticketSettings = await Ticket.findOne({ isActive: true });
            if (ticketSettings) {
                const quantity = purchase.ticketQuantity || 1; // Fallback for old records
                ticketSettings.availableTickets -= quantity;
                await ticketSettings.save();
                console.log(`Decremented stock by ${quantity} for purchase ${purchase._id}`);
            }
        }

        let emailSent = false;
        try {
            // Send confirmation email
            const subject = 'Omnia Tickets - Payment Confirmed';
            const text = `Hello ${purchase.fullName},\n\nYour payment for ${purchase.ticketQuantity} ticket(s) has been confirmed!\n\nYour Confirmation Code: ${purchase.confirmationCode}\n\nPlease present this code at the entrance.\n\nEnjoy the party!`;
            const html = `
      <div style="font-family: Arial, sans-serif; background-color: #1a0033; color: white; padding: 40px; border-radius: 20px;">
        <h1 style="color: #c77dff;">Payment Confirmed!</h1>
        <p>Hello <strong>${purchase.fullName}</strong>,</p>
        <p>Your payment for ${purchase.ticketQuantity} ticket(s) has been verified.</p>
        <div style="background: #2d1b4e; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #9d4edd;">
          <p style="margin: 0; color: #c77dff; font-size: 12px; text-transform: uppercase;">Your Confirmation Code:</p>
          <p style="margin: 5px 0 0 0; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ffd700;">${purchase.confirmationCode}</p>
        </div>
        <p>Please present this code at the entrance for verification.</p>
        <p style="color: #c77dff; font-size: 14px;">© OmniaTickets</p>
      </div>
    `;
            await sendEmail(purchase.email, subject, text, html);
            emailSent = true;
        } catch (emailErr) {
            console.error('Email sending failed:', emailErr.message);
        }

        res.json({
            msg: emailSent ? 'Purchase confirmed and email sent' : 'Purchase confirmed, but email sending failed',
            emailSent,
            purchase
        });
    } catch (err) {
        console.error('CONFIRM ERROR:', err);
        res.status(500).send('Server Error: ' + err.message);
    }
});

// @route   POST api/admin/reject/:id
// @desc    Reject purchase
// @access  Private
router.post('/reject/:id', auth, async (req, res) => {
    try {
        console.log(`Attempting to reject purchase ID: ${req.params.id}`);
        const purchase = await Purchase.findById(req.params.id);
        if (!purchase) {
            console.warn(`Purchase NOT FOUND in DB: ${req.params.id}`);
            return res.status(404).json({ msg: 'Purchase not found' });
        }
        console.log(`Found purchase to reject: ${purchase.fullName}`);

        const prevStatus = purchase.status;
        purchase.status = 'rejected';
        await purchase.save();

        // Increment stock back only if it hasn't been rejected already
        if (prevStatus !== 'rejected') {
            const ticketSettings = await Ticket.findOne({ isActive: true });
            if (ticketSettings) {
                const quantity = purchase.ticketQuantity || 1; // Fallback for old records
                ticketSettings.availableTickets += quantity;
                await ticketSettings.save();
                console.log(`Restored stock by ${quantity} for purchase ${purchase._id}`);
            }
        }

        res.json({ msg: 'Purchase rejected', purchase });
    } catch (err) {
        console.error('REJECT ERROR:', err);
        res.status(500).send('Server Error: ' + err.message);
    }
});

module.exports = router;
