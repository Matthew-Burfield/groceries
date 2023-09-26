import {
  useQuery,
  UseQueryOptions,
  useQueryClient,
} from '@tanstack/react-query';

function useGetData<TReturnType, TErrorType = unknown>(
  queryOptions: UseQueryOptions<TReturnType, TErrorType>
) {
  const queryClient = useQueryClient();
  const result = useQuery(queryOptions);

  const updateCache = (
    updateFn: (oldItems: TReturnType | undefined) => TReturnType
  ) => {
    if (queryOptions.queryKey) {
      queryClient.setQueryData(queryOptions.queryKey, updateFn);
    }
  };

  return {
    status: result.status,
    data: result.data,
    error: result.error,
    updateCache,
  };
}

export { useGetData };
