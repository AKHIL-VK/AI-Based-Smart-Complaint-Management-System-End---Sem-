const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  title: { 
    type: String, 
    required: [true, 'Title is required'] 
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'] 
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'] 
  },
  location: { 
    type: String, 
    required: [true, 'Location is required'] 
  },
  status: { 
    type: String, 
    default: 'Pending',
    enum: ['Pending', 'In Progress', 'Resolved']
  },
  priority: {
    type: String,
    default: 'Low',
    enum: ['Low', 'Medium', 'High']
  },
  department: {
    type: String,
    default: 'General'
  },
  summary: {
    type: String,
    default: ''
  },
  autoResponse: {
    type: String,
    default: ''
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
