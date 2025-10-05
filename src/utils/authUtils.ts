// Utility functions for authentication and data persistence

export const clearAllAuthData = () => {
  // Clear localStorage
  localStorage.removeItem("autoToken");
  localStorage.removeItem("authToken"); // Keep for backward compatibility
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("rememberedEmail");
  localStorage.removeItem("rememberMe");
  localStorage.removeItem("userData");

  // Clear sessionStorage
  sessionStorage.removeItem("autoToken");
  sessionStorage.removeItem("authToken"); // Keep for backward compatibility
  sessionStorage.removeItem("refreshToken");
};

export const saveUserData = (userData: any) => {
  localStorage.setItem("userData", JSON.stringify(userData));
};

export const getUserData = () => {
  const savedUserData = localStorage.getItem("userData");
  if (savedUserData) {
    try {
      return JSON.parse(savedUserData);
    } catch (error) {
      console.log("Could not parse saved user data:", error);
      localStorage.removeItem("userData");
      return null;
    }
  }
  return null;
};

export const getAuthToken = () => {
  return (
    localStorage.getItem("autoToken") ||
    localStorage.getItem("authToken") || // Keep for backward compatibility
    sessionStorage.getItem("autoToken") ||
    sessionStorage.getItem("authToken") // Keep for backward compatibility
  );
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
