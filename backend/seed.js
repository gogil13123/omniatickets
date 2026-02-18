const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Check if admin exists
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
        const newAdmin = new Admin({
            username: 'admin',
            password: hashedPassword
        });

        await newAdmin.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
