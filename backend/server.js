const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🚀 Smoothly connected to CRM'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- Schemas ---

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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional link to User
  createdAt: { type: Date, default: Date.now }
});
const Lead = mongoose.model('Lead', leadSchema);

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

// --- Auth Endpoints ---

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required.' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Make the first user an admin, otherwise client
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'client';

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    // If client, check if there is an existing lead with this email to link, or create one
    if (role === 'client') {
      let lead = await Lead.findOne({ email });
      if (!lead) {
        lead = new Lead({ name, email, source: 'Self Registered', status: 'New', userId: newUser._id });
      } else {
        lead.userId = newUser._id;
      }
      await lead.save();
    }

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get Current User
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- Lead Endpoints ---

// GET /api/leads/me -> Client fetches their own lead profile
app.get('/api/leads/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const lead = await Lead.findOne({ email: user.email });
    if (!lead) return res.status(404).json({ message: 'Lead profile not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/leads -> Pulls all leads (ADMIN ONLY)
app.get('/api/leads', authenticateToken, isAdmin, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/leads -> Saves a new lead (ADMIN ONLY)
app.post('/api/leads', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, source, status, notes } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });

    const newLead = new Lead({ name, email, source: source || 'Website Contact Form', status: status || 'New', notes: notes || '' });
    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/leads/:id -> Updates a lead (ADMIN ONLY)
app.put('/api/leads/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    if (status) lead.status = status;
    if (notes) {
      const timestamp = new Date().toLocaleString();
      const newNoteEntry = `[${timestamp}] ${notes}`;
      lead.notes = lead.notes ? `${lead.notes}\n${newNoteEntry}` : newNoteEntry;
    }

    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE /api/leads/:id -> Deletes a lead (ADMIN ONLY)
app.delete('/api/leads/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    
    // Optional: If lead has a userId, we might want to also delete the user or handle it, 
    // but for now just deleting the lead profile is fine.
    
    res.json({ message: 'Lead successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
