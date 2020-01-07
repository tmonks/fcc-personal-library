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
const omitPrivate = (doc, obj) => {
  delete obj.__v;
  return obj;
}
const bookSchema = new mongoose.Schema({
  title: String,
  comments: [ String ]
}, { toJSON: { virtuals: true, transform: omitPrivate }, id: false });
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
        res.send("error adding new book");
      }
    })
    .get(async (req, res) => {
      try {
        const books = await Book.find({});
        res.json(books);
      } catch(err) {
        console.log(err);
        res.send("error retrieving books");
      }
    })
    .delete(async (req, res) => {
      try {
        const results = await Book.deleteMany({});
        console.log(results);
        if(results) {
          res.send("complete delete successful");
        } else {
          res.send("no books deleted");
        }
      } catch (err) {
        console.log(err);
        res.send("error deleting books");
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
    .get(async (req, res) => {
      const _id = req.params.id;
      try {
        const book = await Book.findById(_id)
        if(book) {
          res.json(book);
        } else {
          res.send("no book exists");
        }
      } catch(err) {
        console.log(err);
        res.send("error finding book");
      }
    })
    .post(async (req, res) => {
      console.log(req.body);
      const _id = req.params.id;
      const comment = req.body.comment;
      
      try {
        const bookToUpdate = await Book.findById(_id);
        console.log("before update", bookToUpdate);
        bookToUpdate.comments.push(comment);
        await bookToUpdate.save();
        console.log("after update", bookToUpdate);
        res.json(bookToUpdate);
      } catch(err) {
        console.log(err);
        res.send("error adding comment");
      }  
    })
    .delete(async (req, res) => {
      const _id = req.params.id;
      try {
        const removedBook = await Book.findByIdAndDelete(_id);
        console.log("Book removed: ", removedBook);
        if (removedBook) {
          res.send("delete successful");
        } else {
          res.send("book not found");
        }
      } catch (err) {
        console.log(err);
        res.send("error deleting book");
      }
    });
  
/*
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

*/  
};
