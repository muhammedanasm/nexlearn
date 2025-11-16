import { useState, useEffect, useCallback } from "react";
import { apiCall } from "../services/apiService";

const useApi = (method, url, initialData = null, params = null) => {
  const [response, setResponse] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // MAIN FETCH FUNCTION
  const fetchData = useCallback(
    async (body = null) => {
      setLoading(true);
      setError(null);

      try {
        // IMPORTANT: params should only contain real query params (never headers)
        const result = await apiCall(method, url, body, params || undefined);

        setResponse(result);
        return result;
      } catch (err) {
        setError(err?.message || "Something went wrong");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [method, url, params]
  );

  // REFETCH FUNCTION
  const refetch = useCallback(
    async (body = null) => {
      return await fetchData(body);
    },
    [fetchData]
  );

  // RESET
  const reset = useCallback(() => {
    setResponse(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  return {
    response,
    loading,
    error,
    refetch,
    reset,
  };
};

export default useApi;
