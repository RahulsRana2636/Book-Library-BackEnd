const { text } = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookSchema = new Schema({
    bookname:{
        type: String,
        required: true
    },
   author:{
        type: String,
        required: true
   },
    date:{
        type: Date,
        default: Date.now
    },
    status:{
        type: Number,
        default: 1
    },
  });
  const Book = mongoose.model('booklist', BookSchema);
  module.exports = Book;