// Routes that require authentication
export const PROTECTED_ROUTES = ["/profile", "/plans", "/admin"];

// Routes that are only accessible to non-authenticated users
export const AUTH_ROUTES = ["/auth/signin", "/auth/register", "/auth/error"];

// Admin routes that require isAdmin = true
export const ADMIN_ROUTES = ["/admin"];

// Helper function to check if a path starts with any of the protected routes
export const isProtectedRoute = (path) => {
  return PROTECTED_ROUTES.some((route) => path.startsWith(route));
};

// Helper function to check if a path starts with any of the auth routes
export const isAuthRoute = (path) => {
  return AUTH_ROUTES.some((route) => path.startsWith(route));
};

// Helper function to check if a path is an admin route
export const isAdminRoute = (path) => {
  return ADMIN_ROUTES.some((route) => path.startsWith(route));
};
