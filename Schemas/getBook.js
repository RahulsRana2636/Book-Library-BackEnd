// const { text } = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const GetBookSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required : true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    bookID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'booklist',
        required : true
    },
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
        default: 0
    },
  });
  const GetBook = mongoose.model('getbook', GetBookSchema);
  module.exports = GetBook;