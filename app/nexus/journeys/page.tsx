import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui-forge/ui/card";
import { Badge } from "@/ui-forge/ui/badge";
import { Button } from "@/ui-forge/ui/button";
import { LineChart, Layers, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";

const modules = [
  {
    id: "linear-regression",
    title: "Módulo I: Regressão Linear",
    description: "Análise quantitativa com Sum of Squared Residuals (SSR). A base predictiva de valores contínuos.",
    icon: LineChart,
    level: "Fundamentos",
    count: 3,
    status: "Concluído",
  },
  {
    id: "logistic-regression",
    title: "Módulo II: Regressão Logística",
    description: "Classificação binária, função sigmoide e Maximum Likelihood Estimation. Descubra a matemática por trás da probabilidade.",
    icon: Activity,
    level: "Fundamentos",
    count: 3,
    status: "Concluído",
  },
  {
    id: "pca",
    title: "Módulo III: Componentes Principais",
    description: "Aprenda redução de dimensionalidade. Sintetize dezenas de variáveis biológicas ruidosas nos eixos primordiais do PCA.",
    icon: Layers,
    level: "Avançado",
    count: 1,
    status: "Em Progresso",
  }
];

export default function LearningPaths() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="space-y-4">
        <h2 className="text-4xl font-headline font-bold tracking-tight">Trilhas Curriculares</h2>
        <p className="text-slate-500 text-lg max-w-2xl font-medium">Cronograma técnico estruturado para a formação em engenharia de Machine Learning.</p>
      </div>

      <div className="grid gap-8">
        {modules.map((module) => (
          <Card key={module.id} className={`rounded-[2rem] border-slate-100 shadow-xl overflow-hidden transition-all ${module.status === 'Bloqueado' ? 'opacity-60 grayscale' : 'hover:border-primary/30 hover:shadow-2xl'}`}>
            <div className="flex flex-col md:flex-row">
              <div className={`w-full md:w-56 bg-slate-50 flex items-center justify-center p-12 border-r border-slate-100`}>
                <module.icon className={`w-14 h-14 ${module.status === 'Bloqueado' ? 'text-slate-300' : 'text-primary'}`} />
              </div>
              <div className="flex-1 p-10 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-headline font-bold text-slate-900">{module.title}</h3>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-slate-50">
                        {module.level}
                      </Badge>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">{module.count} Unidades Técnicas</Badge>
                  </div>
                  <p className="text-slate-600 font-body text-base leading-relaxed mb-8">{module.description}</p>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${module.status === 'Concluído' ? 'bg-emerald-500' : module.status === 'Bloqueado' ? 'bg-slate-300' : 'bg-primary animate-pulse'}`} />
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{module.status}</span>
                  </div>
                  
                  <Button 
                    disabled={module.status === 'Bloqueado'} 
                    asChild={module.status !== 'Bloqueado'}
                    className="h-12 rounded-xl px-8 font-bold"
                  >
                    {module.status === 'Bloqueado' ? (
                      "Acesso Restrito"
                    ) : (
                      <Link href={`/nexus/journeys/${module.id}`} className="flex items-center gap-2">
                        {module.status === 'Concluído' ? 'Revisar Aula' : 'Acessar Laboratório'}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
