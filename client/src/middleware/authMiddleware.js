import { logout } from '../store/slices/authSlice';
import { checkTokenExpiry } from '../utils/auth';

export const authMiddleware = (store) => (next) => (action) => {
  if (action.type !== 'auth/logout' && !checkTokenExpiry()) {
    // Token is invalid or expired
    store.dispatch(logout());
    return;
  }
  return next(action);
}; 