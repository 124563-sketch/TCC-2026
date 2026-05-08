
import Link from 'next/link';
import { Button } from '@/ui-forge/ui/button';
import { BrainCircuit, PlayCircle, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen tech-grid">
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-headline font-bold text-primary tracking-tighter">ML Ascent</span>
        </div>
        <nav className="hidden md:flex items-center gap-10">
          <Link href="#features" className="text-sm font-semibold hover:text-primary transition-colors">Recursos</Link>
          <Link href="#how-it-works" className="text-sm font-semibold hover:text-primary transition-colors">Como Funciona</Link>
          <Link href="/nexus" className="text-sm font-semibold hover:text-primary transition-colors">Acessar Painel</Link>
        </nav>
        <Button asChild className="rounded-full px-6 shadow-lg hover:shadow-primary/30 transition-all">
          <Link href="/nexus/journeys/linear-regression">Começar Agora</Link>
        </Button>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-20 md:py-32 max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8 border border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Piloto de Estatística Multivariada Disponível
          </div>
          <h1 className="text-6xl md:text-8xl font-headline font-bold mb-8 leading-[0.9] tracking-tighter">
            Estatística pela <br />
            <span className="text-primary italic">Intuição Visual.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-body leading-relaxed">
            Abandone os tutoriais guiados por fórmulas matemáticas opacas. Aprenda os fundamentos de Machine Learning (LSE, MLE e PCA) através de visualizações interativas inspiradas na Nature Methods.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-2xl shadow-primary/40 group" asChild>
              <Link href="/nexus/journeys">
                Explorar Currículo <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full border-2 hover:bg-slate-50" asChild>
              <Link href="/nexus/journeys/linear-regression">Iniciar Módulo I</Link>
            </Button>
          </div>

          <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-[0_40px_100px_-15px_rgba(0,0,0,0.3)] border-8 border-white bg-slate-900">
            <div className="aspect-[16/9] flex items-center justify-center p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/10" />
              <div className="relative z-10 grid grid-cols-3 gap-8 w-full max-w-2xl">
                {[
                  { label: "Regressão Linear", sub: "LSE · SSR", color: "bg-blue-500/20 border-blue-500/30 text-blue-400" },
                  { label: "Regressão Logística", sub: "MLE · Sigmoide", color: "bg-primary/20 border-primary/30 text-primary" },
                  { label: "Componentes Principais", sub: "PCA · Eigenvectors", color: "bg-purple-500/20 border-purple-500/30 text-purple-400" },
                ].map((item) => (
                  <div key={item.label} className={`rounded-2xl border p-6 text-center space-y-2 ${item.color}`}>
                    <BrainCircuit className="w-8 h-8 mx-auto opacity-80" />
                    <p className="text-sm font-bold text-white leading-tight">{item.label}</p>
                    <p className="text-[10px] font-mono opacity-60">{item.sub}</p>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Visualização Matemática Interativa</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-slate-50 py-32 px-6 border-y relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl font-headline font-bold">Por que aprender com o ML Ascent?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Desenvolvemos uma metodologia baseada em feedback visual e matemático instantâneo.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Gráficos Interativos",
                  desc: "Manipule outliers manualmente e veja o impacto instantâneo nos Resíduos (SSR) e na maximização do Log-Odds iterativo.",
                  icon: PlayCircle,
                  color: "text-blue-600",
                  bg: "bg-blue-50"
                },
                {
                  title: "Cálculo Reativo",
                  desc: "Nossos laboratórios calculam funções de custo e projetam eixos de variância máxima (PCA) em tempo real, mitigando a matemática opaca.",
                  icon: BrainCircuit,
                  color: "text-indigo-600",
                  bg: "bg-indigo-50"
                },
                {
                  title: "Curadoria Nature",
                  desc: "Módulos fundamentais rigorosamente desenhados a partir da série \"Points of Significance\" da renomada revista Nature Methods.",
                  icon: GraduationCap,
                  color: "text-emerald-600",
                  bg: "bg-emerald-50"
                }
              ].map((feat, i) => (
                <div key={i} className="bg-white p-10 rounded-3xl border shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group">
                  <div className={`w-14 h-14 ${feat.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                    <feat.icon className={`w-7 h-7 ${feat.color}`} />
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-4">{feat.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-body">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-32 px-6 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-headline font-bold leading-tight">Um laboratório de Estatística Visual no seu navegador.</h2>
              <div className="space-y-6">
                {[
                  "Manipule pontos de dados e estude regressão linear com o método LSE.",
                  "Enxergue além de anomalias com fronteiras sigmoides robustas.",
                  "Acione o modo Sandbox para forçar Outliers e quebrar retas frágeis.",
                  "Rotacione eixos ortogonais para projetar e comprimir dados no PCA."
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-lg font-medium text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link href="/nexus">Começar Trilha <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
            <div className="relative aspect-square bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-800 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />
              <div className="relative z-10 space-y-6 p-12 w-full">
                <div className="space-y-3">
                  {[85, 62, 91, 48, 73].map((w, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary/60 rounded-full" style={{ width: `${w}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 w-8">{w}%</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">SSR Mínimo</span>
                  <span className="text-xs font-mono text-primary font-bold">0.0312</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-16 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-8 h-8 text-primary" />
              <span className="font-headline font-bold text-2xl tracking-tighter">ML Ascent</span>
            </div>
            <p className="text-slate-400 max-w-sm font-body">
              Capacitando a próxima geração de cientistas de dados através da visualização e experimentação guiada.
            </p>
          </div>
          <div>
            <h4 className="font-headline font-bold mb-6 text-lg">Explorar</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><Link href="/nexus" className="hover:text-primary transition-colors">Painel do Estudante</Link></li>
              <li><Link href="/nexus/journeys" className="hover:text-primary transition-colors">Módulos</Link></li>
              <li><Link href="/nexus/codex" className="hover:text-primary transition-colors">Glossário</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-bold mb-6 text-lg">Conta</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><Link href="/login" className="hover:text-primary transition-colors">Entrar</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Criar Conta</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} ML Ascent. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
