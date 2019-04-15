const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment-timezone');

const uvaSchema = new mongoose.Schema({
  date: {
    type: Number,
    required: true,
    unique: true,
    validate: value => validator.isInt(`${value}`),
  },
  value: {
    type: Number,
    required: true,
    validate: value => validator.isFloat(`${value}`),
  },
});

uvaSchema.virtual('dateFormatted').get(function() {
  return moment(this.date)
    .tz('America/Argentina/Buenos_Aires')
    .format('LLLL')
    .toString();
});

uvaSchema.statics.getUnique = async function() {
  return this.find({}, { _id: 0, __v: 0 }).sort({ date: 1 });
};
module.exports = mongoose.model('Uva', uvaSchema);
