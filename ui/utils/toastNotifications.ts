import { isClerkAPIResponseError, isClerkRuntimeError } from '@clerk/clerk-expo';
import Toast from 'react-native-toast-message';

interface HandleApiErrorOptions {
  context?: string;
  defaultErrorTitle?: string;
  defaultErrorMessage?: string;
}

export function showErrorToast(title: string, message?: string) {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 4000,
  });
}

export function showSuccessToast(title: string, message?: string) {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 3000,
  });
}

export function showInfoToast(title: string, message?: string) {
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 3000,
  });
}

export function handleApiError(error: unknown, options?: HandleApiErrorOptions) {
  console.error('[API Error]', options?.context ? `Context: ${options.context}` : '', error);

  let title = options?.defaultErrorTitle || 'Wystąpił błąd';
  let message = options?.defaultErrorMessage || 'Spróbuj ponownie później.';

  if (isClerkAPIResponseError(error)) {
    title = options?.context ? `Błąd ${options.context} (Clerk)` : 'Błąd API Clerk';
    const firstError = Array.isArray(error.errors) && error.errors[0];
    if (firstError) {
      message = firstError.longMessage || firstError.message || message;
      if (
        firstError.code === 'network_error' ||
        firstError.meta?.paramName === '__clerk_form_error_code_network_error' ||
        error.message?.toLowerCase().includes('network')
      ) {
        title = 'Błąd sieci Clerk';
        message = 'Nie udało się połączyć z serwerem Clerk. Sprawdź połączenie internetowe.';
      }
    } else if (error.message) {
      message = error.message;
    }
  } else if (isClerkRuntimeError(error)) {
    title = options?.context ? `Błąd ${options.context} (Clerk)` : 'Błąd działania Clerk';
    message = error.message || message;
    if (error.message?.toLowerCase().includes('network')) {
      title = 'Błąd sieci Clerk';
      message = 'Problem z połączeniem podczas operacji Clerk. Sprawdź połączenie internetowe.';
    }
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    const err = error as { message: string; code?: string };
    if (err.code === 'ECONNABORTED' || err.message.toLowerCase().includes('network')) {
      title = 'Błąd sieci';
      message = 'Przekroczono czas oczekiwania na odpowiedź lub problem z siecią.';
    } else {
      message = err.message;
    }
  }

  showErrorToast(title, message);
}
