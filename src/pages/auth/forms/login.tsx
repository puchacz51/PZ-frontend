import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <Card className="w-96 backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-white">
            Logowanie
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            Zaloguj się, aby zarządzać projektami.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                placeholder="login@example.com"
                type="email"
                className="bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-md focus-visible:ring-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Hasło
              </Label>
              <Input
                id="password"
                type="password"
                className="bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-md focus-visible:ring-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-white/80 transition-colors font-semibold"
            >
              Zaloguj się
            </Button>
          </form>
          <div className="mt-4 text-sm text-gray-300 text-center">
            Nie masz konta?{' '}
            <Link to="/auth/register" className="text-white font-semibold hover:underline">
              Zarejestruj się
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;