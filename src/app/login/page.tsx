"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BrainCircuit, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/ui-forge/ui/button";
import { Input } from "@/ui-forge/ui/input";
import { Label } from "@/ui-forge/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("E-mail ou senha incorretos. Verifique seus dados e tente novamente.");
      } else {
        router.push("/nexus");
        router.refresh();
      }
    } catch {
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Left panel — branding */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-primary text-white p-12 relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
              <BrainCircuit className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-headline font-bold tracking-tight">
              ML Ascent
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <blockquote className="text-3xl font-headline font-bold leading-tight">
            "A intuição visual é o caminho mais curto entre a fórmula e a compreensão."
          </blockquote>
          <p className="text-blue-200/70 text-sm font-medium">
            Plataforma interativa de aprendizado de Machine Learning — estatística pela intuição visual.
          </p>
        </div>

        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-700/40 blur-3xl" />
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-800/60 blur-2xl" />
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="md:hidden flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-headline font-bold text-primary">ML Ascent</span>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold text-slate-900 tracking-tight">
              Entrar na Plataforma
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Entre com suas credenciais para continuar sua jornada.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-12 rounded-xl border-slate-200 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-12 rounded-xl border-slate-200 bg-white pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full h-12 rounded-xl font-bold text-sm"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Autenticando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Entrar
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Não tem uma conta?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
