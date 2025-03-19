import AuthPage from "@/pages/auth/AuthPage";
import LoginPage from "@/pages/auth/forms/login";
import RegisterPage from "@/pages/auth/forms/register";
import HomePage from "@/pages/home-page";
import { checkAuthentication } from "@/services/user";
import { createRoute, createRootRoute, createRouter, RouterProvider, redirect } from "@tanstack/react-router";
export { RouterProvider };
export { Link } from "@tanstack/react-router";
export { useRouter } from "@tanstack/react-router";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: HomePage,
    beforeLoad: () => checkAuthentication().then((auth) => {
        if (!auth.isAuthenticated) {
            return redirect({ to: "/auth" });
        }
    }),
});

const authRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/auth",
    component: AuthPage,
});

const loginRoute = createRoute({
    getParentRoute: () => authRoute,
    path: "/login",
    component: LoginPage,
});

const registerRoute = createRoute({
    getParentRoute: () => authRoute,
    path: "/register",
    component: RegisterPage,
});

const routeTree = rootRoute.addChildren([indexRoute, authRoute.addChildren([loginRoute, registerRoute])]);

export const router = createRouter({ routeTree });
