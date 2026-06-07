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
  { name: 'Rahul Sharma', email: 'rahul.s@techindia.com', source: 'LinkedIn', status: 'New', notes: '' },
  { name: 'Priya Singh', email: 'priya.singh@innovate.in', source: 'Website', status: 'Contacted', notes: 'Called left voicemail.' },
  { name: 'Amit Patel', email: 'amit.p@globaltrade.in', source: 'Referral', status: 'Converted', notes: 'Signed annual contract.' },
  { name: 'Neha Gupta', email: 'ngupta@enterprise.co.in', source: 'Google Ads', status: 'New', notes: '' },
  { name: 'Karan Desai', email: 'kdesai@startupsolutions.in', source: 'Conference', status: 'Contacted', notes: 'Sent follow-up email.' },
  { name: 'Anjali Verma', email: 'averma@retailgroup.in', source: 'Website', status: 'New', notes: '' },
  { name: 'Rohan Mehta', email: 'rmehta@marketingpro.in', source: 'Webinar', status: 'Converted', notes: 'Upgraded to premium tier.' },
  { name: 'Sneha Kapoor', email: 'sneha.k@designco.in', source: 'Social Media', status: 'New', notes: '' },
  { name: 'Vikram Singh', email: 'vsingh@logistics.com', source: 'Referral', status: 'Contacted', notes: 'Scheduled demo for next Tuesday.' },
  { name: 'Aditi Rao', email: 'arao@financehub.in', source: 'Google Ads', status: 'New', notes: '' },
  { name: 'Deepak Kumar', email: 'deepak.k@builderpro.in', source: 'Cold Call', status: 'Converted', notes: 'Closed deal for Q3.' },
  { name: 'Meera Reddy', email: 'mreddy@healthcare.in', source: 'Website', status: 'Contacted', notes: 'Requested pricing sheet.' },
  { name: 'Sanjay Dutt', email: 'sdutt@manufacture.in', source: 'LinkedIn', status: 'New', notes: '' },
  { name: 'Pooja Joshi', email: 'pjoshi@education.in', source: 'Conference', status: 'Converted', notes: 'Signed 2-year agreement.' },
  { name: 'Tarun Bajaj', email: 'tbajaj@autoindia.in', source: 'Google Ads', status: 'Contacted', notes: 'Interested in enterprise features.' },
  { name: 'Kavita Iyer', email: 'kiyer@software.in', source: 'Webinar', status: 'New', notes: '' },
  { name: 'Rajiv Menon', email: 'rmenon@consulting.in', source: 'Referral', status: 'Contacted', notes: 'Needs approval from board.' },
  { name: 'Simran Kaur', email: 'skaur@travelco.in', source: 'Website', status: 'Converted', notes: 'Payment received.' },
  { name: 'Arjun Nair', email: 'anair@mediahouse.in', source: 'Social Media', status: 'New', notes: '' },
  { name: 'Divya Prakash', email: 'dprakash@energy.in', source: 'LinkedIn', status: 'Contacted', notes: 'Follow up next month.' },
  { name: 'Manish Tiwari', email: 'mtiwari@realestate.in', source: 'Google Ads', status: 'Converted', notes: 'Onboarding completed.' },
  { name: 'Nisha Sharma', email: 'nsharma@hospitality.in', source: 'Cold Call', status: 'New', notes: '' },
  { name: 'Gaurav Jain', email: 'gjain@retailer.in', source: 'Website', status: 'Contacted', notes: 'Evaluating against competitor.' },
  { name: 'Ritu Agarwal', email: 'ragarwal@ecommerce.in', source: 'Referral', status: 'Converted', notes: 'Signed up for basic plan.' },
  { name: 'Anil Chopra', email: 'achopra@pharma.in', source: 'Conference', status: 'New', notes: '' }
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
