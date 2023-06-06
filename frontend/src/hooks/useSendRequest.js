import { useCallback } from "react";

const useSendRequest = () => {
  const sendRequest = useCallback(async (url, options) => {
    const method = options?.method || "GET";
    const headers = options?.headers || {
      "Content-Type": "application/json",
    };
    const body = options?.body;
    const response = await fetch(url, {
      method,
      headers,
      body,
      credentials: "include",
    });
    const responseBody = await response.json();

    responseBody.statusCode = response.status;

    return responseBody;
  }, []);

  return {
    sendRequest,
  };
};

export default useSendRequest;
