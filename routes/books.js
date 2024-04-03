const express = require('express');
const router = express.Router();
const Book = require('../Schemas/book');
const { body, validationResult } = require('express-validator');
var fetchuser = require('../middleware/fetchUser');

// ROUTE 1: Get All the books using: GET "http://localhost:5000/books/booklist". Login required
router.get("/booklist", async (req, res) => {
    try{
    const booklist = await Book.find({status: 1});
    if (booklist.length > 0) {
        res.send(booklist)
    } else {
        res.send({ result: "No Book found" })
    }
}catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// ROUTE 2: Add a new book using: POST "http://localhost:5000/books/addbook". Login required

router.post('/addbook',  [
    body('bookname', 'Enter a valid bookname').isLength({ min: 3 }),
    body('author', 'Enter a valid book author name').isLength({ min: 4 }),], async (req, res) => {
        try {
            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const book = new Book(req.body);
            const savedBook = await book.save()

            res.json(savedBook)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

// ROUTE 3: Search a book using: GET "http://localhost:5000/books/book/:id". Login required
    router.get("/book/:id", async (req, resp) => {
        let result = await Book.findOne({ _id: req.params.id })
        if (result) {
            resp.send(result)
        } else {
            resp.send({ "result": "No Record Found." })
        }
    })

    // ROUTE 4: Update an existing book using: PUT "http://localhost:5000/books/updatebook/:id". Login required
router.put('/updatebook/:id', async (req, res) => {
    const { bookname, author } = req.body;
    try {
        // Create a newNote object
        const newBook = {};
        if (bookname) { newBook.bookname = bookname };
        if (author) { newBook.author = author };
        // if (tag) { newNote.tag = tag };

        // Find the note to be updated and update it
        let book = await Book.findById(req.params.id);
        if (!book) { return res.status(404).send("Not Found") }

        // if (book.user.toString() !== req.user.id) {
        //     return res.status(401).send("Not Allowed");
        // }
        book = await Book.findByIdAndUpdate(req.params.id, { $set: newBook }, { new: true })
        res.json({ book });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
// ROUTE 5: Delete an existing Book using: DELETE "http://localhost:5000/books//deletebook/:id". Login required
router.delete('/deletebook/:id',  async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let book = await Book.findById(req.params.id);
        if (!book) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Note
        // if (book.user.toString() !== req.user.id) {
        //     return res.status(401).send("Not Allowed");
        // }

        book = await Book.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", book: book });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;