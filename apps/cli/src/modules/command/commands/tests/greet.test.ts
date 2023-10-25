import { greet } from '../greet'

describe('greet', () => {
    it('should return a greeting', () => {
        const log = jest.spyOn(console, 'log').mockImplementation()
        greet({
            name: 'World',
        })
        expect(log).toHaveBeenCalledWith('Hello World')
    })

    it('should throw an error if no name is provided', () => {
        expect(() => greet({ name: '' })).toThrowError()
    })
})
