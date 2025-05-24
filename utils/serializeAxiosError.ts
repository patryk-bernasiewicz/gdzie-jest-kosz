import axios from 'axios';

export function serializeAxiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return {
      message: error.message,
      code: error.code,
      config: error.config,
      response: error.response
        ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        }
        : undefined,
      isAxiosError: true,
      stack: error.stack,
    };
  }
  // Fallback for non-Axios errors
  return {
    message: (error as any)?.message || String(error),
    stack: (error as any)?.stack,
    isAxiosError: false,
  };
} 