/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

// set up mongoDB schema
const bookSchema = new mongoose.Schema({
  title: String,
  comments: [ String ]
}, { toJSON: { virtuals: true } });
bookSchema.virtual('commentcount').get(function() {
  return this.comments.length;
});
const Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .post(async (req, res) => {
      const title = req.body.title;
      console.log("New book '" + title + "' received");
      const newBook = new Book({title, comments: []});
      
      try {
        const result = await newBook.save();
        console.log("New book saved successfully");
        console.log("Comment count: " + result.commentcount);
        res.json(result);
      } catch (err) {
        console.log(err);
      }
    })
    .get(async (req, res) => {
      try {
        const books = await Book.find({}, {__v: 0 });
        res.json(books);
      } catch(err) {
        console.log(err);
      }
    });
  /*
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });
  */


  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
