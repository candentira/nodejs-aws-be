import * as awsMock from 'aws-sdk-mock'
import catalogBatchProcess from '../catalogBatchProcess'
import { isValidProduct, getProductsByTitle, createProduct } from '../services/productsService'

const mockProductCreated = { title: 'product', description: 'productDescr', price: 42, count:2 }
jest.mock('../services/productsService', () => ({
    isValidProduct: jest.fn().mockReturnValue(true).mockReturnValueOnce(true).mockReturnValueOnce(false),
    getProductsByTitle: jest.fn().mockResolvedValue([]).mockResolvedValueOnce([]).mockResolvedValueOnce([{}]),
    createProduct: jest.fn().mockResolvedValue({})
  })
)
describe('catalogBatchProcess', () => {

    it('should create SNS message if product is valid and wasn\'t created before', async () => {
        const spy = jest.fn();
        awsMock.mock('SNS', 'publish', (params, callback) => {
            spy()
        })
        const mockProducts = { title: 'product', description: 'productDescr', price: 42, count:2 }
        const mockEvent = { Records: [{ body: JSON.stringify(mockProducts) }] }
        await catalogBatchProcess(mockEvent)
        expect(spy.mock.calls.length).toBe(1)
        awsMock.restore('SNS')
    })

    it('should not create SNS message if product is not valid', async () => {
        const spy = jest.fn();
        awsMock.mock('SNS', 'publish', (params, callback) => {
            spy()
        })
        const mockProducts = { title: 'product', description: 'productDescr', price: 42, count:2 }
        const mockEvent = { Records: [{ body: JSON.stringify(mockProducts) }] }
        await catalogBatchProcess(mockEvent)
        expect(spy.mock.calls.length).toBe(0)
        awsMock.restore('SNS')
    })

    it('should not create SNS message if product already exists', async () => {
        const spy = jest.fn();
        awsMock.mock('SNS', 'publish', (params, callback) => {
            spy()
        })
        const mockProducts = { title: 'product', description: 'productDescr', price: 42, count:2 }
        const mockEvent = { Records: [{ body: JSON.stringify(mockProducts) }] }
        await catalogBatchProcess(mockEvent)
        expect(spy.mock.calls.length).toBe(0)
        awsMock.restore('SNS')
    })
})