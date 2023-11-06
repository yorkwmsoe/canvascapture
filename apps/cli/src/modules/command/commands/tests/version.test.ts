import { VERSION_TEXT } from '@constants/base-info'
import { version } from '../version'

describe('version', () => {
    it('should return the version', () => {
        const log = jest.spyOn(console, 'log').mockImplementation()
        version()
        expect(log).toHaveBeenCalledWith(`v ${VERSION_TEXT}`)
    })
})
