// Create a new router
const express = require("express")
const router = express.Router()

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}


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
        // saving data in database
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
                                                                             
})

router.get('/list', redirectLogin, function (req, res, next) {
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

router.post('/loggedin', function (req, res, next) {
    const bcrypt = require('bcrypt')
    let sqlquery = "SELECT hashedPassword FROM users WHERE username = ?;"
    const attemptusername = req.body.username    
    db.query(sqlquery, attemptusername, (err, result) => {
        if (err) {
            next(err)
        }
        else{
            if(result.length > 0){
                let hashedPassword = result[0].hashedPassword
                // Compare the password supplied with the password in the database
                bcrypt.compare(req.body.password, hashedPassword, function(err, bcryptresult) {
                if (err) {
                    next(err)
                }
                else if (bcryptresult == true) {
                    req.session.userId = req.body.username;
                    res.send('You are now logged in :) <a href='+'/'+'>Home</a>')
                }
                else {
                    res.send('Sorry, the password you have given is incorrect <a href='+'./login'+'>Try again</a>')
                }
                })
            }
            else{
                res.send('Sorry, user not found <a href='+'./login'+'>Try again</a>')
            }
        }
    
                                             
})   
}) 

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
      return res.redirect('/')
    }
    res.send('You are now logged out. <a href='+'/'+'>Home</a>');
    })
})


// Export the router object so index.js can access it
module.exports = router