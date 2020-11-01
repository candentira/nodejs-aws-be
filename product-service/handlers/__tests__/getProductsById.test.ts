import { APIGatewayProxyEvent } from 'aws-lambda';
import getProductsById from '../getProductsById';

describe('getProductsById', () => {
    it('should return product when correct id is passed', async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: { id: '7567ec4b-b10c-45c5-9345-fc73c48a80a5' }
        } as any
        const result = await getProductsById(event)
        const { title } = JSON.parse(result.body)
        expect(title).toEqual('ProductLast');
    });

    it('should return 404 status when wrong id was provided', async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: { id: '7567ec4b-b10c-45c5-9345-fc73c48a80a9' }
        } as any
        const result = await getProductsById(event)
        expect(result.statusCode).toEqual(404)
        expect(result.body).toEqual(JSON.stringify('Product not found'))
    });

    it('should return 400 status when no id was provided', async () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: {}
        } as any
        const result = await getProductsById(event)
        expect(result.statusCode).toEqual(400)
        expect(result.body).toEqual(JSON.stringify('Invalid ID provided'))
    });
});