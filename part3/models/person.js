const mongoose = require('mongoose')

// define the schema for a person and the matching model
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: (v) => /^\d{2,3}-\d{1,}$/.test(v),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // the _id property of Mongoose objects is an object
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
