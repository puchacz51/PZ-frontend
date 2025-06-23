import MainLayout from "@/components/common/MainLayout";
import Loading from "@/components/ui/Loading";
import { IUserContextType } from "@/context/UserContext";
import HomePage from "@/pages/HomePage";
import { createRoute, createRootRoute, createRouter, RouterProvider, redirect } from "@tanstack/react-router";
import { lazy } from "react";
import { Context } from "vm";

export { RouterProvider };
export { Link } from "@tanstack/react-router";
export { useRouter } from "@tanstack/react-router";

const AuthPage = lazy(() => import('@/pages/auth/AuthPage'));
const ProjectsPage = lazy(() => import('@/pages/projects/ProjectsPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const ChatPage = lazy(() => import('@/pages/chat/ChatPage'));
const ProjectDetailsPage = lazy(() => import('@/pages/projects/ProjectDetailsPage'));
const MyFilesPage = lazy(() => import('@/pages/files/MyFilesPage'));

const checkAuth = async (ctx: Context) => {    
    const context = ctx.context as IUserContextType;
    if (!await context.authenticateUser()) {
        return redirect({ to: "/auth" });
    }
}

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
    pendingComponent: Loading
});

const projectsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/projects",
    component: ProjectsPage,
    beforeLoad: checkAuth,
    pendingComponent: Loading
});

const projectDetailsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/projects/$projectId",
    component: ProjectDetailsPage,
    beforeLoad: checkAuth,
    pendingComponent: Loading

});

const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/settings",
    component: SettingsPage,
    beforeLoad: checkAuth,
    pendingComponent: Loading
});

const chatRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/chat",
    component: ChatPage,
    beforeLoad: checkAuth,
    pendingComponent: Loading
});

const myFilesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/files",
    component: MyFilesPage,
    beforeLoad: checkAuth,
    pendingComponent: Loading
});

const routeTree = rootRoute.addChildren([
    indexRoute, 
    authRoute, 
    projectsRoute, 
    projectDetailsRoute, 
    settingsRoute, 
    chatRoute,
    myFilesRoute
]);

export const router = createRouter({ 
    routeTree,
    context: {
        user: null,
        setUser: () => {},
        logout: () => {},
        authenticateUser: async () => false,
    }
});