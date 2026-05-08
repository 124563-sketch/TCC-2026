"use client";

import { useState, useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/ui-forge/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui-forge/ui/card";
import { BookMarked, Search, Info, Link2, Library, BookOpen } from "lucide-react";
import { Input } from "@/ui-forge/ui/input";

const mlTerms = [
  {
    category: "Regressão Linear · Lever, Krzywinski & Altman (2015)",
    terms: [
      {
        term: "Regressão Linear",
        definition: "Modelo que assume uma relação linear Y = β₀ + β₁X + ε entre uma variável resposta contínua Y e um preditor X. Os coeficientes β₀ (intercepto) e β₁ (inclinação) são estimados por mínimos quadrados (LSE)."
      },
      {
        term: "Mínimos Quadrados (LSE)",
        definition: "Método de estimação que escolhe β₀ e β₁ minimizando a soma dos quadrados dos resíduos (SSR). É a solução analítica padrão para regressão linear — não requer iteração."
      },
      {
        term: "SSR (Sum of Squared Residuals)",
        definition: "Soma dos quadrados das diferenças entre cada valor observado yᵢ e o valor predito pela reta de regressão ŷᵢ. O LSE minimiza exatamente esta quantidade."
      },
      {
        term: "R-Quadrado (R²)",
        definition: "Coeficiente de determinação: a proporção da variância total de Y que é explicada pelo modelo. Varia entre 0 e 1; quanto mais próximo de 1, melhor o ajuste."
      },
      {
        term: "Homoscedasticidade",
        definition: "Premissa da regressão linear de que a variância dos resíduos é constante ao longo de todos os valores do preditor X. Sua violação compromete a confiabilidade dos intervalos de confiança."
      },
      {
        term: "Falácia da Regressão (à Média)",
        definition: "Fenômeno estatístico em que valores extremos de uma medição tendem a ser seguidos por valores mais próximos da média na medição seguinte. Não é um efeito causal — é uma consequência matemática da correlação imperfeita."
      },
      {
        term: "MSE (Mean Squared Error)",
        definition: "SSR dividido pelo número de observações. Mede o erro quadrático médio da predição e está na mesma família do desvio-padrão dos resíduos."
      }
    ]
  },
  {
    category: "Regressão Logística · Lever, Krzywinski & Altman (2016)",
    terms: [
      {
        term: "Regressão Logística",
        definition: "Modelo de classificação binária que estima a probabilidade P(Y=1|X) de uma observação pertencer à classe positiva. Transforma preditores lineares em probabilidades via função sigmoide."
      },
      {
        term: "Função Sigmoide",
        definition: "Função σ(t) = 1/(1 + e⁻ᵗ) que comprime qualquer valor real t para o intervalo (0,1). Na regressão logística, t = β₀ + β₁X, produzindo uma curva suave em forma de S entre as classes."
      },
      {
        term: "Log-Odds (Logit)",
        definition: "O logaritmo da razão de chances: ln(P/(1−P)). A regressão logística modela o log-odds como uma função linear dos preditores — logit(P) = β₀ + β₁X."
      },
      {
        term: "MLE (Maximum Likelihood Estimation)",
        definition: "Método de estimação dos coeficientes β que maximiza a probabilidade conjunta de observar exatamente os rótulos presentes nos dados. Na regressão logística, não possui solução fechada e requer otimização iterativa."
      },
      {
        term: "Log-Verossimilhança Negativa (NLL)",
        definition: "Função de custo da regressão logística: −Σ[yᵢ log(pᵢ) + (1−yᵢ) log(1−pᵢ)]. Minimizar o NLL equivale a maximizar a verossimilhança. O artigo refere-se a esta quantidade como deviance."
      }
    ]
  },
  {
    category: "Análise de Componentes Principais · Lever, Krzywinski & Altman (2017)",
    terms: [
      {
        term: "PCA (Análise de Componentes Principais)",
        definition: "Método não-supervisionado de redução de dimensionalidade que encontra eixos ortogonais (componentes principais) ordenados pela quantidade de variância que capturam. PC1 é a direção de máxima variância; PC2 é a direção ortogonal a PC1 com a segunda maior variância, e assim por diante."
      },
      {
        term: "Matriz de Covariância",
        definition: "Matriz p×p cujo elemento (i,j) é a covariância entre as variáveis i e j. Os autovetores desta matriz definem os componentes principais, e os autovalores definem a variância capturada por cada um."
      },
      {
        term: "Autovetores (Eigenvectors)",
        definition: "Vetores v que satisfazem Σv = λv, onde Σ é a matriz de covariância. No PCA, cada autovetor é um componente principal — uma direção no espaço das variáveis originais."
      },
      {
        term: "Autovalores (Eigenvalues)",
        definition: "Escalares λ associados a cada autovetor. No PCA, λᵢ é a variância dos dados ao longo do i-ésimo componente principal. A fração λᵢ/Σλ indica a proporção da variância total explicada por PCᵢ."
      },
      {
        term: "Variância Projetada (σ²)",
        definition: "A variância dos pontos após projeção sobre um eixo. PC1 é o eixo que maximiza esta quantidade — o que é geometricamente equivalente a minimizar a soma das distâncias perpendiculares entre os pontos e o eixo."
      },
      {
        term: "Redução de Dimensionalidade",
        definition: "Estratégia de reter apenas os k primeiros PCs (k < p) e descartar os demais. A perda de informação é quantificada pela variância acumulada nos PCs descartados e pelo erro RMS de reconstrução."
      },
      {
        term: "Padronização (Unit Variance)",
        definition: "Transformação que subtrai a média e divide pelo desvio-padrão de cada variável, conferindo-lhes variância unitária. Essencial quando as variáveis são medidas em escalas diferentes — sem ela, o PCA reflete a magnitude das variáveis, não a estrutura de correlação."
      }
    ]
  }
];

const recommendedReadings = [
  {
    title: "An Introduction to Statistical Learning",
    author: "Gareth James, Daniela Witten, Trevor Hastie e Robert Tibshirani",
    description: "Um dos livros mais aclamados e acessíveis sobre modelagem e machine learning. Essencial para entender os fundamentos estatísticos e intuições matemáticas de regressão e classificação.",
    link: "https://www.statlearning.com/"
  },
  {
    title: "Points of Significance (Nature Methods)",
    author: "Martin Krzywinski & Naomi Altman",
    description: "Série lendária de artigos científicos que inspirou as visualizações deste projeto. Explica estatística de forma brilhante e altamente visual para pesquisadores de biologia funcional.",
    link: "https://www.nature.com/collections/qghhqm"
  },
  {
    title: "Pattern Recognition and Machine Learning",
    author: "Christopher M. Bishop",
    description: "O 'livro definitivo' sobre a perspectiva bayesiana. Para estudantes que querem ir além da intuição e dominar profundamente os preceitos matemáticos formais por trás dos modelos.",
    link: "https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf"
  }
];

export default function GlossaryPage() {
  const [query, setQuery] = useState("");

  const filteredTerms = useMemo(() => {
    if (!query.trim()) return mlTerms;
    const q = query.toLowerCase().trim();
    return mlTerms.map((section) => ({
      ...section,
      terms: section.terms.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q),
      ),
    })).filter((section) => section.terms.length > 0);
  }, [query]);

  const noResults = query.trim() && filteredTerms.length === 0;

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
            <BookMarked className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-4xl font-headline font-bold tracking-tight text-slate-900">Glossário Técnico</h2>
            <p className="text-slate-500 font-medium">Conceitos fundamentais e terminologias de Machine Learning.</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar termo ou conceito..."
          className="h-14 pl-12 rounded-[1.25rem] border-slate-200 shadow-sm focus:ring-primary/20"
        />
      </div>

      {noResults && (
        <div className="text-center py-16 space-y-4">
          <p className="text-slate-400 text-lg">Nenhum termo corresponde a <b>&ldquo;{query}&rdquo;</b>.</p>
          <button onClick={() => setQuery("")} className="text-sm font-bold text-primary hover:underline">
            Limpar busca
          </button>
        </div>
      )}

      <div className="space-y-12">
        {filteredTerms.map((section) => (
          <section key={section.category} className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 px-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {section.category}
            </h3>
            
            <Card className="rounded-[2rem] border-none shadow-xl bg-white overflow-hidden">
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {section.terms.map((item, index) => (
                    <AccordionItem key={item.term} value={item.term} className={`px-8 border-slate-50 ${index === section.terms.length - 1 ? 'border-b-0' : ''}`}>
                      <AccordionTrigger className="hover:no-underline py-6">
                        <span className="font-headline font-bold text-lg text-slate-800 text-left">{item.term}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-8 pt-2">
                        <div className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <p className="text-slate-600 leading-relaxed font-body text-base">
                            {item.definition}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>
        ))}
      </div>

      <div className="space-y-6 pt-12 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center shadow-inner">
            <Library className="w-5 h-5 text-indigo-500" />
          </div>
          <h3 className="text-3xl font-headline font-bold text-slate-800">Referências e Aprofundamento</h3>
        </div>
        <p className="text-slate-500 font-medium pb-4">
          Nossa curadoria oficial de bibliografias vitais para quem deseja expandir suas fronteiras de conhecimento além da intuição visual rumo ao formalismo absoluto.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedReadings.map((book) => (
            <Card key={book.title} className="rounded-3xl border border-slate-200 shadow-sm bg-white hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col group overflow-hidden">
              <div className="h-2 w-full bg-slate-100 group-hover:bg-indigo-500 transition-colors" />
              <CardHeader className="p-6 pb-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>
                <CardTitle className="text-xl font-headline font-bold text-slate-800 leading-tight mt-4">
                  {book.title}
                </CardTitle>
                <CardDescription className="text-sm font-bold text-indigo-500 pt-1">
                  {book.author}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex-1 flex flex-col justify-between space-y-6">
                <p className="text-slate-500 text-sm leading-relaxed">
                  {book.description}
                </p>
                <a 
                  href={book.link} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors group/link mt-auto"
                >
                  <Link2 className="w-4 h-4 mr-2 text-slate-400 group-hover/link:text-indigo-500" />
                  Acessar Referência
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-10 mt-16 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-xl">
          <h4 className="text-2xl font-headline font-bold">Não encontrou o que procurava?</h4>
          <p className="text-slate-400 font-medium">
            Nossos módulos curriculares detalham esses conceitos com visualizações matemáticas e práticas. Explore as trilhas técnicas para um mergulho profundo.
          </p>
        </div>
        <BookMarked className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 -rotate-12" />
      </div>
    </div>
  );
}
