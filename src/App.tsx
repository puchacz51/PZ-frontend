import { Suspense } from "react";
import { UserProvider, useUser } from "./context/UserContext";
import { RouterProvider } from "./router/router";
import { router } from "./router/router";
import Loading from "./components/ui/Loading";

const InnerApp = () => {
    const userContext = useUser();
    return <RouterProvider router={router} context={userContext}></RouterProvider>
}

function App() {
    return (
        <UserProvider>
            <Suspense fallback={<Loading />}>
                <InnerApp />
            </Suspense>
        </UserProvider>
    );
}

export default App;
