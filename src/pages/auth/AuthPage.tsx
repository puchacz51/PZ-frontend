import Background from "@/components/ui/Background";
import stars from "../../../public/media/stars.webm";
import LoginForm from "./forms/LoginForm";
import { useState } from "react";
import RegisterForm from "./forms/RegisterForm";
import { Card } from "@/components/ui/card";

const AuthPage = () => {
    const [isLoginForm, setIsLoginForm] = useState(true);

    return (
        <div className="relative w-screen h-screen">
            <Background videoSrc={stars} isFixed={true} playbackRate={1.0} />

            <div className="flex justify-center items-center min-h-screen bg-black px-4">
                <Card className="w-full max-w-md bg-white/5 border border-white/20 shadow-2xl backdrop-blur-xl rounded-2xl backdrop-blur-sm">
                    {isLoginForm ? <LoginForm setIsLoginForm={setIsLoginForm} /> : <RegisterForm setIsLoginForm={setIsLoginForm} />}
                </Card>
            </div>
        </div>
    );
};

export default AuthPage;
