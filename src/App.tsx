import { Suspense } from "react";
import { UserProvider, useUser } from "./context/UserContext";
import { RouterProvider } from "./router/router";
import { router } from "./router/router";
import Loading from "./components/ui/Loading";
import { ChatProvider } from "./context/ChatContext";
import ChatNotifications from "./components/ui/ChatNotifications";

const InnerApp = () => {
    const userContext = useUser();
    return <RouterProvider router={router} context={userContext}></RouterProvider>;
};

function App() {
    return (
        <UserProvider>
            <ChatProvider>
                <Suspense fallback={<Loading />}>
                    <InnerApp />
                </Suspense>
                <ChatNotifications />
            </ChatProvider>
        </UserProvider>
    );
}

export default App;
