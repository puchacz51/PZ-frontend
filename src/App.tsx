import { UserProvider, useUser } from "./context/UserContext";
import { RouterProvider } from "./router/router";
import { router } from "./router/router";

const InnerApp = () => {
    const userContext = useUser();
    return <RouterProvider router={router} context={userContext}></RouterProvider>
}

function App() {
    
    
    return (
        <UserProvider>
            <InnerApp />
        </UserProvider>
    );
}

export default App;
