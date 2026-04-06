const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await Admin.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      console.log('ℹ️  Admin already exists: admin@gmail.com');
    } else {
      await Admin.create({ email: 'admin@gmail.com', password: 'admin123' });
      console.log('✅ Default admin created:');
      console.log('   Email: admin@gmail.com');
      console.log('   Password: admin123');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
