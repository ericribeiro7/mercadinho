import { useState } from "react";
import { Lock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginUser, logoutUser } from "@/lib/api/auth.functions";

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
  isAuthenticated: boolean;
  currentUser: string | null;
}

export function AdminLogin({
  onLoginSuccess,
  onLogout,
  isAuthenticated,
  currentUser,
}: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validação de entrada no cliente
      if (!username.trim() || !password.trim()) {
        setError("Usuário e senha são obrigatórios");
        setIsLoading(false);
        return;
      }

      if (username.length > 50 || password.length > 100) {
        setError("Credenciais inválidas");
        setIsLoading(false);
        return;
      }

      // Chamar função de servidor segura
      const result = await loginUser({
        data: {
          username: username.trim(),
          password,
        },
      });

      if (result.success && result.token) {
        // Armazenar token em sessionStorage (mais seguro que localStorage para auth)
        sessionStorage.setItem("admin_token", result.token);
        sessionStorage.setItem("admin_user", username);
        setUsername("");
        setPassword("");
        onLoginSuccess(result.token);
      } else {
        setError(result.message || "Falha no login");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao conectar ao servidor"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = sessionStorage.getItem("admin_token");
    if (token) {
      try {
        await logoutUser({
          data: { token },
        });
      } catch (err) {
        console.error("Erro ao fazer logout:", err);
      }
    }

    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_user");
    setUsername("");
    setPassword("");
    onLogout();
  };

  if (isAuthenticated && currentUser) {
    return (
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900">Admin Autenticado</p>
            <p className="text-xs text-blue-700">Usuário: {currentUser}</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="border-blue-300 hover:bg-blue-200"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-6 max-w-md mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-bold text-gray-900">Acesso Admin</h2>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Usuário
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              disabled={isLoading}
              autoComplete="username"
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              disabled={isLoading}
              autoComplete="current-password"
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Conectando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
