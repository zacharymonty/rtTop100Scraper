const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

app.get('/scrape', function (req, res) {


    url = 'https://www.rottentomatoes.com/top/bestofrt/';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function (error, response, html) {

        // First we'll check to make sure no errors occurred when making the request

        if (!error) {
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture

            var json = {
                top100: []
            };



            // In examining the DOM we notice that the title rests within the first child element of the header tag. 
            // Utilizing jQuery we can easily navigate and get the text by writing the following code:

            $('#top_movies_main > .content_body > .table > tbody > tr').each(function (index, obj) {
                var data = $(this);
                var movie = {}
                movie.rank = data.find('.bold').text()
                movie.title = data.find('td > a').text().trim()
                movie.rtScore = data.find('.tMeterScore').text()
                movie.movieUrl = data.find('td > a').attr('href')
                json.top100.push(movie);

            });


        }

        fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
            console.log('HA! HA! SUCCESS! - Check your output.json file');
        })

        // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
        res.send(json)

    })
});

const port = process.env.PORT || 8080

app.listen(8080, () => {
    console.log(`The party has started at ${port}`);
})

exports = module.exports = app;