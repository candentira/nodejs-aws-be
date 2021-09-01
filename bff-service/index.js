const express = require('express')
require('dotenv').config()
const axios = require('axios').default
var cache = require('memory-cache');

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

const CACHE_EXPIRATION = 120000
const REQUESTS_TO_BE_CACHED = ['products']

app.all('/*', (req, res) => {
    console.log(req.originalUrl, 'original URL')
    console.log(req.method, 'method')
    console.log(req.body, 'body')

    const recipient = req.originalUrl.split('/')[1]
    console.log(recipient, 'recipient')

    const isRequestedCached = REQUESTS_TO_BE_CACHED.includes(recipient)
    if (isRequestedCached) {
        const cached = cache.get(recipient)
        if(cached) {
            console.log(cached, 'cached value was used')
            res.json(cached)
            return
        }
    }

    const recipientURL = process.env[recipient]
    console.log(recipientURL, 'recipient URL')
    if (recipientURL) {
        const axiosConfig = {
            method: req.method,
            url: `${recipientURL}${req.originalUrl}`,
            ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
        };

        console.log(axiosConfig, 'axios config');

        axios(axiosConfig)
            .then((response) => {
                console.log(response.data, 'response from recipient');
                res.json(response.data);
                if (isRequestedCached) {
                    cache.put(recipient, response.data, CACHE_EXPIRATION)
                }
            })
            .catch((error) => {
                console.log('recipient error: ', JSON.stringify(error));

                if (error.response) {
                    const { status, data } = error.response;
                    res.status(status).json(data);
                } else {
                    res.status(500).json({error: error.message});
                }
            });
    } else {
        res.status(502).json({error: 'Cannot process request'});
    }
})

app.listen(port, () => {
  console.log(`BFF service listening at PORT:${port}`)
})