import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IUser } from "@/types/user";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import axiosInstance from "@/config/axios";
import { useForm, SubmitHandler } from "react-hook-form";

interface LoginFormInputs {
    email: string;
    password: string;
}

const LoginForm = ({ setIsLoginForm }: { setIsLoginForm: (isLoginForm: boolean) => void }) => {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [loginError, setLoginError] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const handleLoginSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        setLoginError(null);
        try {
            const response = await axiosInstance.post('/auth/login', {
                login: data.email,
                password: data.password,
            });

            const { accessToken, refreshToken, id, firstName, lastName, email, role } = response.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            
            const loggedInUser: IUser = {
                id: id,
                firstName: firstName,
                lastName: lastName,
                email: email,
                role: role,
                login: email, 
            };

            setUser(loggedInUser);
            navigate({ to: "/" });

        } catch (err: any) {
            console.error("Login failed:", err);
            if (err.response && err.response.data && err.response.data.message) {
                setLoginError(err.response.data.message);
            } else if (err.message) {
                setLoginError(err.message);
            } else {
                setLoginError("Login failed. Please try again.");
            }
        }
    };
    
    return (
        <>
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center text-white">Logowanie</CardTitle>
                <CardDescription className="text-center text-gray-300">Zaloguj się, aby zarządzać projektami.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-5" onSubmit={handleSubmit(handleLoginSubmit)}>
                    <div>
                        <Label htmlFor="email" className="text-white">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="login@example.com"
                            type="email"
                            {...register("email", { required: "Email jest wymagany" })}
                            className="mt-1 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-white"
                        />
                        {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="password" className="text-white">
                            Hasło
                        </Label>
                        <Input 
                            id="password" 
                            type="password" 
                            {...register("password", { required: "Hasło jest wymagane" })}
                            className="mt-1 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-white" />
                        {errors.password && <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>}
                    </div>
                    {loginError && <p className="text-sm text-red-400 text-center">{loginError}</p>}
                    <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200 transition-colors font-semibold">
                        Zaloguj się
                    </Button>
                </form>
                <p className="mt-4 text-sm text-gray-300 text-center">
                    Nie masz konta?{" "}
                    <Button onClick={() => setIsLoginForm(false)} className="text-white font-semibold hover:underline" variant="link">
                        Zarejestruj się
                    </Button>
                </p>
            </CardContent>
        </>
    );
};

export default LoginForm;
