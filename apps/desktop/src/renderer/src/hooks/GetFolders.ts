import {useQuery} from "@tanstack/react-query";

export function useGetFolders() {
  return useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      return new Promise(resolve => {
        return resolve(['folder1', 'folder2', 'folder3'])
      })
     }
    })
}
