const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchUser");
const GetBook = require("../Schemas/getBook");
const Book = require('../Schemas/book');

// ROUTE 1: Get All the get books for user using: GET "http://localhost:5000/getbook/getbooklist/:userId". Login required
router.get("/getbooklist/:userId", fetchuser, async (req, res) => {
  try {
    const booklist = await GetBook.find({ status: 1, user: req.params.userId });
    if (booklist.length > 0) {
      res.send(booklist);
    } else {
      res.send({ result: "No Book found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
// ROUTE 2: Get All the getbooks where (status 0 and 1) using: GET "http://localhost:5000/getbook/getbooklists". Login required
router.get("/getbooklists", fetchuser, async (req, res) => {
  try {
    let status = req.query.status;
    let query = {};
    if (status !== undefined) {
      query = { status: Number(status) };
    } else {
      res.send({ result: "No Book found" });
    }
    const booklist = await GetBook.find(query);
    if (booklist.length > 0) {
      res.send(booklist);
    } else {
      res.send({ result: "No Book found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 3: get a new book using: POST "http://localhost:5000/getbook/addgetbook". Login required

router.post("/addgetbook",fetchuser, async (req, res) => {
  try {
    const book = new GetBook(req.body);
    const savedBook = await book.save();

    res.json(savedBook);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: Search a get book using: GET "http://localhost:5000/getbook/searchgetbook/:id". Login required
router.get("/searchgetbook/:id", async (req, resp) => {
  let result = await GetBook.findOne({ _id: req.params.id });
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "No Record Found." });
  }
});

// ROUTE 4: Approve/submit an existing book using: PUT "http://localhost:5000/getbook/approvegetbook/:id". Login required
router.put("/approvegetbook/:id", fetchuser, async (req, res) => {
  const { status } = req.body;
  try {
    const approveBook = {};
      approveBook.status = status;
    let getbook = await GetBook.findById(req.params.id);
    if (!getbook) {
      return res.status(404).send("Not Found");
    }

    getbook = await GetBook.findByIdAndUpdate( req.params.id, { $set: approveBook }, { new: true } );
    res.json({ getbook });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 5: Remove an existing book  from booklist using: PUT "http://localhost:5000/getbook/removebook/:id". Login required
router.put("/removebook/:id", fetchuser, async (req, res) => {
  const { status } = req.body;
  try {
    const removeBook = {};
      removeBook.status = status;
    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send("Not Found");
    }

    book = await Book.findByIdAndUpdate( req.params.id, { $set: removeBook }, { new: true } );
    res.json({ book });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 6: fetch requested book for  Submit : GET "http://localhost:5000/getbook/submitbooks". Login required
router.get("/submitbooks", fetchuser, async (req, res) => {
    try {
        const reqbooklist = await GetBook.find({ status: { $in: [2, -1] } });
      if (reqbooklist.length > 0) {
        res.send(reqbooklist);
      } else {
        res.send({ result: "No Book found" });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });

  // ROUTE 7: fetch  All the submit books for user using: GET "http://localhost:5000/getbook/submitbooklist/:userId". Login required
router.get("/submitbooklist/:userId", fetchuser, async (req, res) => {
    try {
      const booklist = await GetBook.find({ status: -1, user: req.params.userId });
      if (booklist.length > 0) {
        res.send(booklist);
      } else {
        res.send({ result: "No Book found" });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
module.exports = router;
