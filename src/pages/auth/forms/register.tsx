import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const RegisterPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black px-4">
      <Card className="w-full max-w-md bg-white/10 border border-white/20 shadow-2xl backdrop-blur-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-white">
            Rejestracja
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            Utwórz nowe konto, aby zacząć zarządzać projektami.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-white">
                Nazwa użytkownika
              </Label>
              <Input
                id="name"
                placeholder="Nazwa użytkownika"
                className="mt-1 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-white"
              />
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
              <Input
                id="password"
                type="password"
                className="mt-1 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-gray-200 transition-colors font-semibold"
            >
              Zarejestruj się
            </Button>
          </form>
          <p className="mt-4 text-sm text-gray-300 text-center">
            Masz już konto?{' '}
            <Link
              to="/auth/login"
              className="text-white font-semibold hover:underline"
            >
              Zaloguj się
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;