// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request');

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
})

router.get('/about',function(req, res, next){
    res.render('about.ejs')
})

router.get('/weather',function(req, res, next){
    res.render('weather.ejs')
});

router.post('/postweather',function(req, res, next){
    let apiKey = 'a0c29423aedc3a7d64acd944dcb507d8'
    let city = req.body.usercity
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
                     
    request(url, function (err, response, body) {
        if(err){
            next(err)
        } else {
            //res.send(body)
            var weather = JSON.parse(body)
            if (weather!==undefined && weather.main!==undefined) {
            var wmsg = 'It is '+ weather.main.temp + 
                ' degrees in '+ weather.name +
                '! <br> The humidity now is: ' + 
                weather.main.humidity;
            res.send (wmsg);
            }
            else {
                res.send ("No data found");
            }
        } 
    })
});
// Export the router object so index.js can access it
module.exports = router