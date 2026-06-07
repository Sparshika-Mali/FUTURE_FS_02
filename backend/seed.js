require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'client'], default: 'client' },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  source: { type: String, default: 'Website Contact Form' },
  status: { type: String, enum: ['New', 'Contacted', 'Converted'], default: 'New' },
  notes: { type: String, default: '' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
const Lead = mongoose.model('Lead', leadSchema);

const demoLeads = [
  { name: 'Rahul Sharma', email: 'rahul.s@techindia.com', source: 'LinkedIn Ads', status: 'New', notes: '' },
  { name: 'Priya Singh', email: 'priya.singh@innovate.in', source: 'Website Contact Form', status: 'Contacted', notes: '[2026-06-03 10:30 AM] Called left voicemail.' },
  { name: 'Amit Patel', email: 'amit.p@globaltrade.in', source: 'Referral', status: 'Converted', notes: '[2026-06-01 14:15 PM] Signed annual contract.' },
  { name: 'Neha Gupta', email: 'ngupta@enterprise.co.in', source: 'Google Ads', status: 'New', notes: '' },
  { name: 'Karan Desai', email: 'kdesai@startupsolutions.in', source: 'Conference Lead', status: 'Contacted', notes: '[2026-06-02 09:00 AM] Sent follow-up email with pricing deck.' },
  { name: 'Anjali Verma', email: 'averma@retailgroup.in', source: 'Website Contact Form', status: 'New', notes: '' },
  { name: 'Rohan Mehta', email: 'rmehta@marketingpro.in', source: 'Webinar Registration', status: 'Converted', notes: '[2026-05-28 11:45 AM] Upgraded to premium tier.' }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Clearing existing data...');
    await Lead.deleteMany({});
    await User.deleteMany({});
    
    console.log('Creating Admin User...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Sparshika@123', salt);
    
    const adminUser = new User({
      name: 'Sparshika Admin',
      email: 'admin@sparshika.com',
      password: hashedPassword,
      role: 'admin'
    });
    await adminUser.save();
    console.log(`Admin User created: ID: admin@sparshika.com | Password: Sparshika@123`);

    console.log('Inserting demo leads...');
    await Lead.insertMany(demoLeads);
    
    console.log('Successfully inserted demo data!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
