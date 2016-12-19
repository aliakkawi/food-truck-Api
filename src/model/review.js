import mongoose from 'mongoose';
import Foodtruck from './foodtruck';
let Schema = mongoose.Schema;

let reviewkSchema = new Schema({
  
  title: {

      type: String,
      required: true
  },

  text: String,
  foodtruck: {

      type: Schema.Types.ObjectId,
      ref: 'Foodtruck',
      required: true
  }


});

module.exports = mongoose.model('Review', reviewkSchema);
