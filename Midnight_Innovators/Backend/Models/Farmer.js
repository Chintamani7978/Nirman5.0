const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true
  },
  dob: { 
    type: Date, 
    required: [true, 'Date of birth is required']
  },
  aadhaar: { 
    type: String, 
    required: [true, 'Aadhaar number is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{12}$/.test(v);
      },
      message: props => `${props.value} is not a valid 12-digit Aadhaar number!`
    },
    trim: true
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    validate: {
      validator: function(v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid Indian mobile number!`
    },
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  presentAddress: { 
    type: String, 
    required: [true, 'Present address is required'],
    trim: true
  },
  permanentAddress: { 
    type: String, 
    required: [true, 'Permanent address is required'],
    trim: true
  },
  state: { 
    type: String, 
    required: [true, 'State is required'],
    trim: true
  },
  district: { 
    type: String, 
    required: [true, 'District is required'],
    trim: true
  },
  pincode: { 
    type: String, 
    required: [true, 'Pincode is required'],
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v);
      },
      message: props => `${props.value} is not a valid 6-digit pincode!`
    },
    trim: true
  },
  documents: {
    aadhaarCard: { 
      type: String, 
      required: [true, 'Aadhaar card document is required']
    },
    ror: { 
      type: String, 
      required: [true, 'RoR document is required']
    },
    bankPassbook: { 
      type: String, 
      required: [true, 'Bank passbook document is required']
    },
    profilePhoto: { 
      type: String, 
      required: [true, 'Profile photo is required']
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Indexes for better performance
farmerSchema.index({ aadhaar: 1 });
farmerSchema.index({ mobile: 1 });
farmerSchema.index({ email: 1 });

module.exports = mongoose.model('Farmer', farmerSchema);