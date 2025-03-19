import { Link, Outlet, useLocation } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AuthPage= () => {
  const location = useLocation();

  const isAuthRoute = location.pathname === '/auth/login' || location.pathname === '/auth/register';
  if (isAuthRoute) {
    return <Outlet />;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <Card className="w-96 backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl rounded-2xl text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-white">
            Autentykacja
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-6">Wybierz akcję:</p>
          <div className="space-x-4">
            <Button asChild className="bg-white text-black hover:bg-white/80 font-semibold transition-colors">
              <Link to="/auth/login">Logowanie</Link>
            </Button>
            <Button asChild className="bg-white text-black hover:bg-white/80 font-semibold transition-colors">
              <Link to="/auth/register">Rejestracja</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;