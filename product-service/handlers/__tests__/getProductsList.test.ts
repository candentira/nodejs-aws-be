import getProductsList from '../getProductsList';

describe('getProductsList', () => {
    it('should return 200 status code', async () => {
        const result = await getProductsList({})
        expect(result.statusCode).toEqual(200);
    });

    it('should return array with object with title ProductFirst at 0 position ', async () => {
        const result = await getProductsList({})
        const { title } = JSON.parse(result.body)[0]
        expect(title).toEqual('ProductFirst');
    });
});