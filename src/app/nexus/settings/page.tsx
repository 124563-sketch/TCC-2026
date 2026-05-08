"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui-forge/ui/card";
import { Button } from "@/ui-forge/ui/button";
import { Input } from "@/ui-forge/ui/input";
import { Label } from "@/ui-forge/ui/label";
import { Separator } from "@/ui-forge/ui/separator";
import { User, LogOut, Shield, Clock, Key, Trash2 } from "lucide-react";
import { useToast } from "@/synapses/use-toast";
import { useSession, signOut } from "next-auth/react";

function useCurrentSessionSeconds() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let startStr = sessionStorage.getItem("ml_ascent_session_start");
    const start = startStr ? parseInt(startStr, 10) : Date.now();

    if (!startStr) {
      sessionStorage.setItem("ml_ascent_session_start", start.toString());
    }

    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return elapsed;
}

function formatTime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return `${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m`;
}

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const { toast } = useToast();

  // ── Personal info ────────────────────────────────────────────────────
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.name) setDisplayName(session.user.name);
  }, [session?.user?.name]);

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: displayName }),
      });
      if (!res.ok) throw new Error(await res.text());
      await update({ name: displayName });
      toast({ title: "Perfil atualizado", description: "Seu nome foi salvo." });
    } catch {
      toast({ title: "Erro", description: "Não foi possível salvar.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // ── Password change ──────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPw, setIsChangingPw] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "A nova senha deve ter ao menos 6 caracteres", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "As senhas não conferem", variant: "destructive" });
      return;
    }

    setIsChangingPw(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast({ title: "Senha alterada com sucesso" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast({ title: "Erro", description: "Senha atual incorreta ou requisição inválida.", variant: "destructive" });
    } finally {
      setIsChangingPw(false);
    }
  };

  // ── Account deletion ─────────────────────────────────────────────────
  const [deleteEmail, setDeleteEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteEmail.trim() !== session?.user?.email) {
      toast({ title: "E-mail incorreto", description: "Digite seu e-mail exato para confirmar.", variant: "destructive" });
      return;
    }
    setIsDeleting(true);
    try {
      const res = await fetch("/api/profile", { method: "DELETE" });
      if (!res.ok) throw new Error();
      await signOut({ callbackUrl: "/" });
    } catch {
      toast({ title: "Erro", description: "Não foi possível excluir a conta.", variant: "destructive" });
      setIsDeleting(false);
    }
  };

  // ── Logout ───────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // ── Practice time ────────────────────────────────────────────────────
  const [dbSeconds, setDbSeconds] = useState(0);
  const currentSessionSeconds = useCurrentSessionSeconds();

  useEffect(() => {
    fetch("/api/session")
      .then((r) => r.json())
      .then((d) => setDbSeconds(d.totalPracticeSeconds ?? 0))
      .catch(() => {});
  }, []);

  const totalSeconds = dbSeconds + currentSessionSeconds;

  if (status === "loading") {
    return <div className="p-8 animate-pulse text-slate-400">Carregando configurações...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h2 className="text-3xl font-headline font-bold text-slate-900 tracking-tight">Configurações de Conta</h2>
        <p className="text-slate-500 font-medium">Gerencie seu perfil, segurança e preferências.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ── Left column (2/3) ───────────────────────────────────────── */}
        <div className="md:col-span-2 space-y-8">

          {/* Personal info */}
          <Card className="rounded-[2rem] border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-xl">Informações Pessoais</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" defaultValue={session?.user?.email || ""} disabled className="rounded-xl h-11 bg-slate-50" />
                </div>
              </div>
              <Button onClick={handleUpdateProfile} disabled={isSaving || !displayName.trim()} className="rounded-xl font-bold px-8">
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardContent>
          </Card>

          {/* Password change */}
          <Card className="rounded-[2rem] border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Key className="w-5 h-5 text-amber-600" />
                </div>
                <CardTitle className="text-xl">Alterar Senha</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="rounded-xl h-11" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="rounded-xl h-11" />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Mínimo de 6 caracteres.</p>
              <Button onClick={handleChangePassword} disabled={isChangingPw} className="rounded-xl font-bold px-8">
                {isChangingPw ? "Alterando..." : "Alterar Senha"}
              </Button>
            </CardContent>
          </Card>

          {/* Account deletion */}
          <Card className="rounded-[2rem] border-2 border-destructive/20 shadow-xl bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                <CardTitle className="text-xl text-destructive">Excluir Conta</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <p className="text-sm text-slate-500">Esta ação é irreversível. Todos os seus dados, progresso e registros de prática serão removidos permanentemente.</p>
              <div className="space-y-2">
                <Label htmlFor="deleteEmail" className="text-destructive">Digite seu e-mail para confirmar</Label>
                <Input
                  id="deleteEmail"
                  value={deleteEmail}
                  onChange={(e) => setDeleteEmail(e.target.value)}
                  placeholder={session?.user?.email || ""}
                  className="rounded-xl h-11 border-destructive/30"
                />
              </div>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteEmail.trim() !== session?.user?.email}
                className="rounded-xl font-bold px-8"
              >
                {isDeleting ? "Excluindo..." : "Excluir Conta Permanentemente"}
              </Button>
            </CardContent>
          </Card>

          {/* Logout */}
          <Card className="rounded-[2rem] border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <LogOut className="w-5 h-5 text-slate-600" />
                </div>
                <CardTitle className="text-xl">Encerrar Sessão</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <p className="text-sm text-slate-500">Ao encerrar sua sessão, você precisará se autenticar novamente para acessar suas trilhas e progresso.</p>
              <Button variant="destructive" onClick={handleLogout} className="rounded-xl font-bold px-8">
                <LogOut className="w-4 h-4 mr-2" />
                Sair da Plataforma
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ── Right column (1/3) ──────────────────────────────────────── */}
        <div className="space-y-8">
          <Card className="rounded-[2rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden sticky top-24">
            <CardContent className="p-8 space-y-6 text-center">
              <div className="w-20 h-20 bg-white/10 rounded-3xl mx-auto flex items-center justify-center">
                <Clock className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold tabular-nums">{formatTime(totalSeconds)}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tempo de Prática Total</p>
              </div>
              <Separator className="bg-white/10" />
              <div className="space-y-3">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sessão Atual</p>
                <p className="text-lg font-bold text-primary tabular-nums">{formatTime(currentSessionSeconds)}</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Ativa</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
