import { exit } from '../exit'

describe('exit', () => {
    test('exit', () => {
        const processExit = jest.spyOn(process, 'exit').mockImplementation()
        exit()
        expect(processExit).toBeCalledTimes(1)
        expect(processExit).toBeCalledWith(0)
    })
})
