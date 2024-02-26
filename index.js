const redis = require('redis');
const express = require('express');
const bodyParser = require('body-parser');

const app = express()
const port = 3000

const client = redis.createClient(6379);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.post('/submit', (req, res) => {
    const joke = req.body.joke;
    const username = req.body.username;
    if (client.get(joke) == null) {
        client.setex(username, 60, JSON.stringify(joke))
        res.send(joke);

    } else {
        res.send('Tenias el chiste' + joke + 'en cache');
    }



});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})