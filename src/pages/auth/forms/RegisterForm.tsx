import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RegisterForm = ({ setIsLoginForm }: { setIsLoginForm: (isLoginForm: boolean) => void }) => {
    return (
        <>
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center text-white">Rejestracja</CardTitle>
                <CardDescription className="text-center text-gray-300">Utwórz nowe konto, aby zacząć zarządzać projektami.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-5">
                    <div>
                        <Label htmlFor="name" className="text-white">
                            Nazwa użytkownika
                        </Label>
                        <Input id="name" placeholder="Nazwa użytkownika" className="mt-1 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-white" />
                    </div>
                    <div>
                        <Label htmlFor="email" className="text-white">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="login@example.com"
                            type="email"
                            className="mt-1 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-white"
                        />
                    </div>
                    <div>
                        <Label htmlFor="password" className="text-white">
                            Hasło
                        </Label>
                        <Input id="password" type="password" className="mt-1 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-white" />
                    </div>
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
