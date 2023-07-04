const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileSize: {
    type: String,
    required: [true, 'Please enter the file size'],
    trim: true,
  },
  fileName: {
    type: String,
    required: [true, 'Please enter the file name'],
    trim: true,
  },
  fileType: {
    type: String,
    required: [true, 'Please enter the file type'],
    trim: true,
  },
  fileUrl: {
    type: String,
    required: [true, 'Please enter the file URL'],
    trim: true,
  },
},
{ timestamps: true }  
);

module.exports = mongoose.model('Media', fileSchema);
