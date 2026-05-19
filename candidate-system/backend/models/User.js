const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', UserSchema);
