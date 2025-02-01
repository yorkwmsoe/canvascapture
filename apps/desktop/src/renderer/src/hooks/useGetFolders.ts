/**
 * Defines the useGetFolders react hook
 *
 * See the definition below for more details
 */
import { getDocumentsPath } from '@renderer/utils/config'
import { useQuery } from '@tanstack/react-query'
import { readdirSync } from 'fs'

export function useGetFolders() {
    return useQuery({
        queryKey: ['folders'],
        queryFn: async () => {
            return new Promise<string[]>((resolve) => {
                return resolve(
                    readdirSync(getDocumentsPath(), { withFileTypes: true })
                        .filter((dirent) => dirent.isDirectory())
                        .map((dirent) => dirent.name)
                )
            })
        },
    })
}
