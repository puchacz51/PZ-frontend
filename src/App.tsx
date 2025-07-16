import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider, useUser } from "./context/UserContext";
import { RouterProvider } from "./router/router";
import { router } from "./router/router";
import Loading from "./components/ui/Loading";
import { ChatProvider } from "./context/ChatContext";
import ChatNotifications from "./components/ui/ChatNotifications";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const InnerApp = () => {
    const userContext = useUser();
    return <RouterProvider router={router} context={userContext}></RouterProvider>;
};

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <ChatProvider>
                        <Suspense fallback={<Loading />}>
                            <InnerApp />
                        </Suspense>
                        <ChatNotifications />
                </ChatProvider>
            </UserProvider>
        </QueryClientProvider>
    );
}

export default App;
