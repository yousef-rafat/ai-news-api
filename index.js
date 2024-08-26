const PORT = process.env.PORT || 8000;
const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');

const app = express();

const articles = [];

const newspapers = [
   
   {
    name: "theguardian",
    address: "https://www.theguardian.com/uk/technology",
    base: "https://www.theguardian.com/"
   },

   {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/artificial-intelligence/",
    base: "https://telegraph.co.uk/"
   },

   {
    name: "thetimes",
    address: "https://www.thetimes.com/topic/artificial-intelligence",
    base: "https://www.thetimes.com/"
   },

   {
    name: "nytimes",
    address: "https://www.nytimes.com/spotlight/artificial-intelligence",
    base: "https://www.nytimes.com/"
   },

   {
    name: "cbsnews",
    address: "https://www.cbsnews.com/tag/artificial-intelligence/",
    base: "https://www.cbsnews.com/"
   },

   {
    name: "cnn",
    address: "https://edition.cnn.com/business/tech",
    base: "https://edition.cnn.com/"
   },

   {
    name: "washingtonpost",
    address: "https://www.washingtonpost.com/technology/innovations/",
    base: "https://www.washingtonpost.com/"
   },

   {
    name: "latimes",
    address: "https://www.latimes.com/topic/artificial-intelligence",
    base: "https://www.latimes.com/"
   },

   {
    name: "techcrunch",
    address: "https://techcrunch.com/category/artificial-intelligence/",
    base: "https://techcrunch.com/"
   },

   {
    name: "wired",
    address: "https://www.wired.com/tag/artificial-intelligence/",
    base: "https://www.wired.com/"
   },

   {
    name: "mit",
    address: "https://news.mit.edu/topic/artificial-intelligence2",
    base: "https://news.mit.edu/"
   }
]

app.get('/', (req, res) => {
    res.json('Welcome to the AI news API! Go to /news to get the latest news on AI.');
})

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("AI")', html).each(function () {
            const title = $(this).text().trim();
            const url = newspaper.base + $(this).attr('href');

            articles.push({
                title,
                url,
                source: newspaper.name
            })
        }) 

        $('a:contains("A.I.")', html).each(function () {
            const title = $(this).text().trim();
            const url = newspaper.base + $(this).attr('href');

            articles.push({
                title,
                url,
                source: newspaper.name
            })
        }) 
}).catch((err) => {console.log(err)})
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {

    const newspaperId = req.params.newspaperId;

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base
    

    axios.get(newspaperAddress)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const specificArticles = [];

        $('a:contains("AI")', html).each(function () {
            const title = $(this).text().trim();
            const url = newspaperBase + $(this).attr('href');

            specificArticles.push({
                title,
                url,
                source: newspaperId
            })
        }) 

        $('a:contains("A.I.")', html).each(function () {
            const title = $(this).text().trim();
            const url = newspaperBase + $(this).attr('href');

            specificArticles.push({
                title,
                url,
                source: newspaperId
            })
        }) 
        res.json(specificArticles)
}).catch(err => console.log(err))
})

app.listen(PORT, () => {console.log(`Server Running on ${PORT}`)})
