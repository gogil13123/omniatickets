const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');

// @route   GET api/security/verify/:code
// @desc    Verify ticket code
// @access  Public (Used by security staff)
router.get('/verify/:code', async (req, res) => {
    try {
        const purchase = await Purchase.findOne({ confirmationCode: req.params.code });
        if (!purchase) return res.status(404).json({ message: 'ბილეთი ვერ მოიძებნა' });
        res.json(purchase);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/security/use/:code
// @desc    Mark ticket as used
// @access  Public (Used by security staff)
router.post('/use/:code', async (req, res) => {
    try {
        const purchase = await Purchase.findOne({ confirmationCode: req.params.code });
        if (!purchase) return res.status(404).json({ message: 'ბილეთი ვერ მოიძებნა' });

        if (purchase.status === 'used') {
            return res.status(400).json({ message: 'ბილეთი უკვე გამოყენებულია' });
        }

        if (purchase.status !== 'confirmed') {
            return res.status(400).json({ message: 'ბილეთი ჯერ არ არის დადასტურებული' });
        }

        purchase.status = 'used';
        purchase.usedAt = Date.now();
        await purchase.save();
        res.json(purchase);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
