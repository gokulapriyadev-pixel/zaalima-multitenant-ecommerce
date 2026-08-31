const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
  token: { 
    type: String, 
    required: true, 
    unique: true 
  },
  // The 'expires' property creates a TTL index. 
  // MongoDB will automatically delete this document 30 days after it is created, 
  // which matches the natural expiration of our JWTs!
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: '30d' 
  }
});

module.exports = mongoose.model('BlacklistToken', blacklistTokenSchema);