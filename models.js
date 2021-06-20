const mongoose = require('mongoose');

// Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/Dairy';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

// Get the default connection
var db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const DairySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    openTime: {
        type: Date,
        required: true
    },
    closeTime: {
        type: Date,
        required: true
    },
    loc: {
        type: { type: String ,
        enum: ['Point'],
        required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    }
  },
  {
    timestamps: true,
  }
);
DairySchema.index({ "loc": "2dsphere" });

const Dairy = mongoose.model('Dairy', DairySchema);

module.exports = Dairy;
