import { Injectable, HttpException, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

require('dotenv').config()
const axios = require('axios').default
var cache = require('memory-cache')

const CACHE_EXPIRATION = 120000
const REQUESTS_TO_BE_CACHED = ['products']

@Injectable()
export class AppService {
  getAny(@Req() req: Request, @Res() res: Response) {
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

        console.log(axiosConfig, 'axios config')

        axios(axiosConfig)
            .then((response) => {
                console.log(response.data, 'response from recipient')
                if (isRequestedCached) {
                  cache.put(recipient, response.data, CACHE_EXPIRATION)
                }
                res.json(response.data)
            })
            .catch((error) => {
                console.log('recipient error: ', JSON.stringify(error))

                if (error.response) {
                    const { status, data } = error.response
                    throw new HttpException(data, status)
                } else {
                    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
                }
            })
    } else {
        throw new HttpException('Cannot process request', HttpStatus.BAD_GATEWAY)
    }
  }
}
