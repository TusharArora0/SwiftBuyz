export const checkTokenExpiry = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  // Add your token validation logic here if needed
  return true;
}; 