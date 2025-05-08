// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get the authentication token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Parse JWT token (without validation)
export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}; 