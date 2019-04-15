const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment-timezone');

const usdSchema = new mongoose.Schema({
  date: {
    type: Number,
    required: true,
    unique: true,
    validate: value => validator.isInt(`${value}`),
  },
  comprador: {
    type: Number,
    required: true,
    validate: value => validator.isFloat(`${value}`),
  },
  vendedor: {
    type: Number,
    required: true,
    validate: value => validator.isFloat(`${value}`),
  },
});

usdSchema.virtual('dateFormatted').get(function() {
  return moment(this.date)
    .tz('America/Argentina/Buenos_Aires')
    .format('LLLL')
    .toString();
});

usdSchema.statics.getUnique = async function() {
  return this.find({}, { _id: 0, __v: 0 }).sort({ date: 1 });
};

module.exports = mongoose.model('Usd', usdSchema);
