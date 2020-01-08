/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  let testId;
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", done => {
    chai
      .request(server)
      .get("/api/books")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", () => {
    suite(
      "POST /api/books with title => create book object/expect book object",
      () => {
        test("Test POST /api/books with title", done => {
          chai
            .request(server)
            .post("/api/books")
            .send({
              title: "Chai Test"
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, "_id", "book should contain _id");
              testId = res.body._id;
              assert.property(res.body, "title", "book should contain title");
              assert.equal(
                res.body.title,
                "Chai Test",
                "title should be Chai Test"
              );
              assert.property(
                res.body,
                "comments",
                "book should have comments"
              );
              assert.isArray(res.body.comments, "comments is an array");
              done();
            });
        });

        test("Test POST /api/books with no title given", done => {
          chai
            .request(server)
            .post("/api/books")
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "no title provided");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", () => {
      test("Test GET /api/books", done => {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "body should be an array");
            assert.property(res.body[0], "title", "books should have a title");
            assert.property(res.body[0], "_id", "books should have an _id");
            assert.property(
              res.body[0],
              "comments",
              "books should have comments"
            );
            assert.isArray(res.body[0].comments, "comments should be an array");
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", () => {
      test("Test GET /api/books/[id] with id not in db", done => {
        chai
          .request(server)
          .get("/api/books/eeeeeeeeeeeeeeeeeeeeeeee")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function(done) {
        chai
          .request(server)
          .get("/api/books/" + testId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "_id", "book should have an _id");
            assert.equal(
              res.body._id,
              testId,
              "book _id should match the one requested"
            );
            assert.property(res.body, "title", "book should have a title");
            assert.property(res.body, "comments", "book should have comments");
            assert.isArray(res.body.comments, "comments should be an array");
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      () => {
        test("Test POST /api/books/[id] with comment", done => {
          const testComment = "With great power comes great responsibility";
          chai
            .request(server)
            .post("/api/books/" + testId)
            .send({
              comment: testComment
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, "_id", "book should have an _id");
              assert.equal(
                res.body._id,
                testId,
                "book _id should match the one requested"
              );
              assert.property(res.body, "title", "book should have a title");
              assert.property(
                res.body,
                "comments",
                "book should have comments"
              );
              assert.isArray(res.body.comments, "comments should be an array");
              assert.include(
                res.body.comments,
                testComment,
                "comment should match the one sent"
              );
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book with id", () => {
      test("Test DELETE /api/books/[id] with id not in db", done => {
        chai
          .request(server)
          .delete("/api/books/eeeeeeeeeeeeeeeeeeeeeeee")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test DELETE /api/books/[id] with valid id", done => {
        chai
          .request(server)
          .delete("/api/books/" + testId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "delete successful");
            done();
          });
      });

      test("Test GET /api/books[id] of deleted book id no longer exists", done => {
        chai
          .request(server)
          .get("/api/books/" + testId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
    });
  });
});
