import MainLayout from "@/components/common/MainLayout";
import { IUserContextType } from "@/context/UserContext";
import HomePage from "@/pages/HomePage";
import { createRoute, createRootRoute, createRouter, RouterProvider, redirect } from "@tanstack/react-router";
import { lazy } from "react";

export { RouterProvider };
export { Link } from "@tanstack/react-router";
export { useRouter } from "@tanstack/react-router";

const AuthPage = lazy(() => import('@/pages/auth/AuthPage'));
const ProjectsPage = lazy(() => import('@/pages/projects/ProjectsPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const ChatPage = lazy(() => import('@/pages/chat/ChatPage'));


const rootRoute = createRootRoute({
    component: MainLayout,
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: HomePage,
});

const authRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/auth",
    component: AuthPage,
    beforeLoad: async (ctx) => {
        const context = ctx.context as IUserContextType;
        if (await context.authenticateUser()) {
            return redirect({ to: "/" });
        }
    },
});

const projectsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/projects",
    component: ProjectsPage,
    beforeLoad: async (ctx) => {
        const context = ctx.context as IUserContextType;
        if (!await context.authenticateUser()) {
            return redirect({ to: "/auth" });
        }
    },
});

const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/settings",
    component: SettingsPage,
    beforeLoad: async (ctx) => {
        const context = ctx.context as IUserContextType;
        if (!await context.authenticateUser()) {
            return redirect({ to: "/auth" });
        }
    },
});

const chatRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/chat",
    component: ChatPage,
    beforeLoad: async (ctx) => {
        const context = ctx.context as IUserContextType;
        if (!await context.authenticateUser()) {
            return redirect({ to: "/auth" });
        }
    },
});

const routeTree = rootRoute.addChildren([indexRoute, authRoute, projectsRoute, settingsRoute, chatRoute]);

export const router = createRouter({ 
    routeTree,
    context: {
        user: null,
        setUser: () => {},
        logout: () => {},
        authenticateUser: async () => false,
    }
});