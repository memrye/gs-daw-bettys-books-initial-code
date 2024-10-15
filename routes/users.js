// Create a new router
const express = require("express")
const router = express.Router()


router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
})    

router.post('/registered', function (req, res, next) {
    const bcrypt = require('bcrypt')
    const saltRounds = 10
    const plainPassword = req.body.password
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword){
        // store hashed password in db
        let sqlquery = "INSERT INTO users (username, firstName, lastName, email, hashedPassword) VALUES (?,?,?,?,?);"
        let newrecord = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword]
        console.log(req.body.first)
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err)
            }
            else
                result = 'Hello '+ req.body.first + ' ' + req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email
                result += ' Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                res.send(result)
        })
        
    })
    // saving data in database                                                                         
})

router.get('/list', function (req, res, next) {
    let sqlquery = "SELECT id, username, firstName, lastName, email FROM users;"
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("listusers.ejs", {registeredUsers:result})
     })                                                         
}) 

router.get('/login', function (req, res, next) {
    res.render('login.ejs')
})

// Export the router object so index.js can access it
module.exports = router