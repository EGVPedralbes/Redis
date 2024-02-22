const redis = require('redis');
const express = require('express');

const app = express()
const port = 3000

const client = redis.createClient(6379);

setResponse = (username, joke) => {
    return `<h2>El chiste de ${username} es: ${joke}</h2>`;
}

function checkCache(req, res, next) {
    const { username } = req.params;
    console.log(username);
    client.get(username, (err, data) => {
        if (data !== null) {
            res.send(setResponse(username, data));
        } else {
            console.log('no data');
            next();
        }
    });
}

async function getJoke(req, res, next) {
    try {
        const { username } = req.params;
        const response = await fetch(`https://api.chucknorris.io/jokes/random`);
        const data = await response.json();
        res.send(setResponse(username, JSON.stringify(data.value)));
        console.log(data.value);
        client.setex(username, 60, JSON.stringify(data.value));
    } catch (err) {
        console.log(err);
    }
}

app.get('/joke/:username', checkCache, getJoke);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})