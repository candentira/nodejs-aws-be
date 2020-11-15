import * as awsMock from 'aws-sdk-mock'
import importProductsFile from '../importProductsFile'

describe('importProductsFile', () => {
    it('should return signed url', async () => {
        const mockedUrl = '/mockTest'
        awsMock.mock('S3', 'getSignedUrl', mockedUrl)

        const event = { queryStringParameters: {name: 'temp'} }

        const response = await importProductsFile(event)

        expect(response).toEqual({
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: mockedUrl
        })
        awsMock.restore('S3');
    })

    it('should reject Promise if error happens', () => {
        const mockError = 'error'
        awsMock.mock("S3", "getSignedUrl", (operation, params, callback) => {
            return callback(mockError, null);
        });

        const event = { queryStringParameters: {name: 'temp'} }

        expect(importProductsFile(event)).rejects.toEqual(mockError)

        awsMock.restore('S3');
    })
})