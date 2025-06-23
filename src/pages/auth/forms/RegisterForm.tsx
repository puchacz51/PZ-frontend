import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import axiosInstance from "@/config/axios";

interface RegisterFormInputs {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

const RegisterForm = ({ setIsLoginForm }: { setIsLoginForm: (isLoginForm: boolean) => void }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
    const [registrationError, setRegistrationError] = useState<string | null>(null);
    const [registrationSuccess, setRegistrationSuccess] = useState<string | null>(null);

    const handleRegisterSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
        setRegistrationError(null);
        setRegistrationSuccess(null);
        try {
            await axiosInstance.post('/auth/register', {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
            });
            setRegistrationSuccess("Rejestracja zakończona sukcesem! Możesz się teraz zalogować.");
            setTimeout(() => {
                setIsLoginForm(true);
            }, 2000); 
        } catch (err: any) {
            console.error("Registration failed:", err);
            if (err.response && err.response.data && err.response.data.message) {
                setRegistrationError(err.response.data.message);
            } else if (err.message) {
                setRegistrationError(err.message);
            } else {
                setRegistrationError("Rejestracja nie powiodła się. Spróbuj ponownie.");
            }
        }
    };

    return (
        <>
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center text-white">Rejestracja</CardTitle>
                <CardDescription className="text-center text-gray-300">Utwórz nowe konto, aby zacząć zarządzać projektami.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-5" onSubmit={handleSubmit(handleRegisterSubmit)}>
                    <div>
                        <Label htmlFor="firstName" className="text-white">
                            Imię
                        </Label>
                        <Input 
                            id="firstName" 
                            placeholder="Imię" 
                            {...register("firstName", { required: "Imię jest wymagane" })}
                            className="mt-1 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-white" />
                        {errors.firstName && <p className="text-sm text-red-400 mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="lastName" className="text-white">
                            Nazwisko
                        </Label>
                        <Input 
                            id="lastName" 
                            placeholder="Nazwisko" 
                            {...register("lastName", { required: "Nazwisko jest wymagane" })}
                            className="mt-1 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-white" />
                        {errors.lastName && <p className="text-sm text-red-400 mt-1">{errors.lastName.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="email" className="text-white">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="login@example.com"
                            type="email"
                            {...register("email", { 
                                required: "Email jest wymagany",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Nieprawidłowy format email"
                                }
                            })}
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
                            {...register("password", { 
                                required: "Hasło jest wymagane",
                                minLength: {
                                    value: 6,
                                    message: "Hasło musi mieć co najmniej 6 znaków"
                                }
                            })}
                            className="mt-1 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-white" />
                        {errors.password && <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>}
                    </div>
                    {registrationError && <p className="text-sm text-red-400 text-center">{registrationError}</p>}
                    {registrationSuccess && <p className="text-sm text-green-400 text-center">{registrationSuccess}</p>}
                    <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200 transition-colors font-semibold">
                        Zarejestruj się
                    </Button>
                </form>
                <p className="mt-4 text-sm text-gray-300 text-center">
                    Masz już konto?{" "}
                    <Button onClick={() => setIsLoginForm(true)} className="text-white font-semibold hover:underline" variant="link">
                        Zaloguj się
                    </Button>
                </p>
            </CardContent>
        </>
    );
};

export default RegisterForm;
