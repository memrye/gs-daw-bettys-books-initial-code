const express = require("express")
const router = express.Router();

router.get('/',function(req, res, next){
    res.send('hi')
})

router.get('/books', function (req, res, next) {
let sqlquery = ""
    if(req.query.search_term){
        searchterm = req.query.search_term
        sqlquery = "SELECT * FROM books WHERE name LIKE '%" + searchterm + "%'"
    } else {
        sqlquery = "SELECT * FROM books"
    }

    // Execute the sql query
    db.query(sqlquery, (err, result) => {
        // Return results as a JSON object
        if (err) {
            res.json(err)
            next(err)
        }
        else {
            res.json(result)
        }
    })
})

// Export the router object so index.js can access it
module.exports = router
