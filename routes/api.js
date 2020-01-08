/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const expect = require("chai").expect;
const mongoose = require("mongoose");

// custom transform function to hide the __v field
const omitPrivate = (doc, obj) => {
  delete obj.__v;
  return obj;
};

const bookSchema = new mongoose.Schema(
  {
    title: String,
    comments: [String]
  },
  { toJSON: { virtuals: true, transform: omitPrivate }, id: false }
);

// add a virtual commentcount field
bookSchema.virtual("commentcount").get(function() {
  return this.comments.length;
});

const Book = mongoose.model("Book", bookSchema);

module.exports = (app) => {
  app
    .route("/api/books")
  
    // POST a new title to /api/books to create a new book
    .post(async (req, res) => {
      const title = req.body.title;

      if (!title) {
        res.send("no title provided");
        return;
      }
    
      const newBook = new Book({ title, comments: [] });

      try {
        const result = await newBook.save();
        res.json(result);
      } catch (err) {
        console.log(err);
        res.send("error adding new book");
      }
    })
  
    // GET /api/books to receive an array of all books in db
    .get(async (req, res) => {
      try {
        const books = await Book.find({});
        res.json(books);
      } catch (err) {
        console.log(err);
        res.send("error retrieving books");
      }
    })
  
    // DELETE to /api/books to delete all books in the db
    .delete(async (req, res) => {
      try {
        const results = await Book.deleteMany({});
        if (results.ok) {
          res.send("complete delete successful");
        } else {
          res.send("no books deleted");
        }
      } catch (err) {
        console.log(err);
        res.send("error deleting books");
      }
    });

  app
    .route("/api/books/:id")
  
    // GET /api/books/:id to receive the details of book with id
    .get(async (req, res) => {
      const _id = req.params.id;
      try {
        const book = await Book.findById(_id);
        if (book) {
          res.json(book);
        } else {
          res.send("no book exists");
        }
      } catch (err) {
        console.log(err);
        res.send("error finding book");
      }
    })
  
    // POST comment to /api/books/:id to add comment to book with id
    .post(async (req, res) => {
      const _id = req.params.id;
      const comment = req.body.comment;
      
    if (!comment) {
        res.send('no comment provided');
        return;
      }

      try {
        const bookToUpdate = await Book.findById(_id);
        bookToUpdate.comments.push(comment);
        await bookToUpdate.save();
        res.json(bookToUpdate);
      } catch (err) {
        console.log(err);
        res.send("error adding comment");
      }
    })
  
    // DELETE to /api/books/:id to delete the book with id
    .delete(async (req, res) => {
      const _id = req.params.id;
      try {
        const removedBook = await Book.findByIdAndDelete(_id);
        if (removedBook) {
          res.send("delete successful");
        } else {
          res.send("no book exists");
        }
      } catch (err) {
        console.log(err);
        res.send("error deleting book");
      }
    });

};
