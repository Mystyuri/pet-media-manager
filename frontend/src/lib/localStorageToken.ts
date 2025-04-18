export const localStorageToken = () => {
  try {
    return typeof window === 'undefined'
      ? ''
      : `Bearer ${JSON.parse(localStorage.getItem('auth-storage') || '').state?.token || ''}`;
  } catch {
    return '';
  }
};
