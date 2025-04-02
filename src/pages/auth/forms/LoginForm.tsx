import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IUser } from "@/types/user";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "@tanstack/react-router";

const exampleUser: IUser = {
    id: 'a1b2c3d4-e5f6-7890-gh12-ijk345lmn678',
    firstName: 'Władysław',
    lastName: 'Zamoyski',
    email: 'wladyslaw.zamoyski@example.com',
};

const LoginForm = ({ setIsLoginForm }: { setIsLoginForm: (isLoginForm: boolean) => void }) => {
    const navigate = useNavigate();
    const { setUser } = useUser();

    const onSubmitTest = (e: React.FormEvent) => {
        e.preventDefault();
        sessionStorage.setItem("user", JSON.stringify(exampleUser));
        setUser(exampleUser);
        
        navigate({ to: "/" });
    }
    
    return (
        <>
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center text-white">Logowanie</CardTitle>
                <CardDescription className="text-center text-gray-300">Zaloguj się, aby zarządzać projektami.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-5" onSubmit={onSubmitTest}>
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
