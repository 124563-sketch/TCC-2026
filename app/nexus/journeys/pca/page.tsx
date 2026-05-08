"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/ui-forge/ui/card";
import { Badge } from "@/ui-forge/ui/badge";
import { ArrowLeft, Cuboid, BookOpen, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { NatureMethodsPcaFig1 } from "./_components/nature-methods-pca-fig1";
import { NatureMethodsPcaFig2 } from "./_components/nature-methods-pca-fig2";
import { NatureMethodsPcaFig3 } from "./_components/nature-methods-pca-fig3";
import { NatureMethodsPcaFig4 } from "./_components/nature-methods-pca-fig4";
import { useProgress } from "@/hooks/use-progress";
import { QuizSection } from "../_components/quiz-section";

export default function PcaLesson() {
  const { markInProgress, markCompleted, status } = useProgress();

  useEffect(() => {
    markInProgress("pca");
  }, [markInProgress]);
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
      {/* Back link + title */}
      <div className="flex items-center gap-4">
        <Link href="/nexus/journeys" className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:shadow-md transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <Badge variant="secondary" className="mb-2 bg-purple-500/10 text-purple-600 uppercase tracking-widest text-[10px] font-bold">Módulo III · Estatística Multivariada</Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-slate-900">Análise de Componentes Principais</h1>
        </div>
      </div>

      {/* Formal citation */}
      <div className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
          <BookOpen className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700 mb-1">Artigo de Referência</p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Lever, J., Krzywinski, M. &amp; Altman, N.{' '}
            <a href="https://www.nature.com/articles/nmeth.4346" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-medium">
              <em>Principal component analysis.</em>
            </a>{' '}
            <em>Nature Methods</em> <b>14</b>, 641–642 (2017). Este módulo interativo reproduz os principais conceitos, figuras e advertências do artigo.
          </p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none text-lg text-slate-600 font-body leading-relaxed space-y-8 md:text-justify">
        <div className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl text-left">
          O PCA simplifica dados de alta dimensão preservando tendências e padrões — mas não encontrará sempre os padrões mais relevantes.
        </div>

        <p>
          Imagine que você mediu a expressão de 20.000 genes em 100 amostras de tumor. Você suspeita que existem subtipos biologicamente distintos, mas não sabe quais genes os definem — nem mesmo quantos subtipos existem. Não há um Y para prever. O que fazer? O PCA permite enxergar a estrutura interna de um conjunto de dados de alta dimensão sem nenhum rótulo ou variável resposta.
        </p>

        <p>
          Nos módulos anteriores, tanto a regressão linear quanto a logística requerem a definição explícita de um preditor X e de uma variável resposta Y. Em contextos de alta dimensionalidade — por exemplo, expressão de dezenas de genes medida em múltiplas amostras — frequentemente não existe um alvo Y claro, e o objetivo é descobrir a estrutura interna dos dados. A <b>Análise de Componentes Principais</b> (PCA) é um método de aprendizado não-supervisionado que encontra padrões sem referência a conhecimento prévio sobre grupos ou tratamentos.
        </p>

        <p>
          O PCA reduz a dimensionalidade dos dados projetando-os geometricamente sobre um conjunto menor de eixos — os <b>Componentes Principais</b> (PCs) — com o objetivo de reter o máximo de informação possível em um número limitado de dimensões. O número máximo de PCs é o menor entre o número de amostras e o número de variáveis.
        </p>

        <h2 className="text-3xl font-headline font-bold text-slate-900 mt-16 mb-6">1. A Geometria da Projeção</h2>

        <p>
          O PCA projeta cada ponto sobre um eixo, perpendicularmente a ele. A qualidade da projeção é medida pela <b>variância σ² dos pontos projetados</b>: quanto maior a variância, mais informação o eixo retém sobre a estrutura dos dados. O PC1 é o eixo que maximiza σ² — e equivalentemente minimiza as distâncias perpendiculares de cada ponto ao eixo. Uma distinção importante: enquanto a regressão linear minimiza distâncias <em>verticais</em> (residuais em Y), o PCA minimiza distâncias <em>perpendiculares</em> — por isso PC1 não é a reta de regressão y~x nem x~y.
        </p>

        <div className="bg-purple-50 border border-purple-200 rounded-2xl px-6 py-5 my-2 text-sm text-slate-700 leading-relaxed space-y-2">
          <p className="font-bold text-slate-800 mb-1">Experimentos guiados no painel:</p>
          <p><span className="font-bold text-purple-600">①</span> Comece com o ângulo em <b>0°</b>. A variância σ² é baixa — o eixo cruza a nuvem de pontos transversalmente.</p>
          <p><span className="font-bold text-purple-600">②</span> Gire lentamente até cerca de <b>40°</b>. Observe σ² crescer conforme o eixo se alinha à direção principal da elipse de dados.</p>
          <p><span className="font-bold text-purple-600">③</span> Continue girando até encontrar o <b>máximo de σ²</b>. O indicador ficará verde — esse é o PC1.</p>
          <p><span className="font-bold text-purple-600">④</span> Note que as linhas tracejadas (distâncias perpendiculares) são mais curtas no PC1 do que em qualquer outro ângulo.</p>
        </div>

        <NatureMethodsPcaFig1 />

        <Card className="bg-slate-900 text-slate-300 border-none rounded-[2rem] overflow-hidden my-12 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full" />
          <CardContent className="p-8 md:p-12 relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                <Cuboid className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-headline font-bold text-white mb-0">Projeção, Variância e Autodecomposição</h3>
            </div>
            <p className="mb-6">
              O <b>primeiro componente principal (PC1)</b> é a direção que minimiza a soma das distâncias perpendiculares entre os dados e suas projeções — o que equivale a <b>maximizar a variância σ² dos pontos projetados</b>. Os PCs subsequentes são selecionados com a restrição de serem não-correlacionados com todos os PCs anteriores — geometricamente, ortogonais entre si.
            </p>
            <p className="mb-6">
              Uma distinção fundamental: o PCA minimiza a <b>distância perpendicular</b> entre cada ponto e o componente, enquanto a regressão linear minimiza a distância vertical entre a resposta observada e o valor predito. Essa diferença implica que PC1 <em>não</em> é a reta de regressão.
            </p>
            <p className="mb-6">
              Matematicamente, os PCs são os <b>autovetores</b> da matriz de covariância dos dados. O autovalor associado a cada autovetor mede a variância capturada por aquele PC. A matriz de covariância Σ é decomposta como Σ = V Λ V<sup>T</sup>, onde as colunas de V são os autovetores (PCs) e Λ é a matriz diagonal dos autovalores.
            </p>
            <p>
              Os componentes são combinações lineares das variáveis originais — seus coeficientes formam a <b>matriz de cargas</b> (<i>loading matrix</i>), interpretável como uma rotação que realinha os dados sobre os eixos de maior variância.
            </p>
          </CardContent>
        </Card>

        <div className="bg-slate-50 border-l-4 border-slate-300 rounded-r-2xl px-6 py-5 my-4 text-sm text-slate-600 leading-relaxed">
          <p className="font-bold text-slate-800 mb-2">O que os loadings significam?</p>
          <p>
            Os coeficientes da matriz de cargas indicam quanto cada variável original contribui para cada PC. Um loading alto do gene X em PC1 significa que a expressão desse gene é uma das principais fontes da variação capturada por aquela componente. Loadings próximos de zero indicam pouca influência naquele PC. Ao interpretar PCs biologicamente, os loadings são tão importantes quanto a variância explicada — eles respondem à pergunta: <em>"variação em quê?"</em>
          </p>
        </div>

        <div className="my-12 border-t border-slate-200" />

        <h2 className="text-3xl font-headline font-bold text-slate-900 mt-8 mb-6">2. Compressão Dimensional e o Scree Plot</h2>

        <p>
          O PCA é fundamentalmente uma técnica de compressão. No exemplo abaixo, 6 amostras × 6 genes foram gerados a partir de apenas 2 fatores latentes — nível de expressão global e contraste tecidual. O PCA deve recuperar esses fatores: os dois primeiros PCs deveriam capturar quase toda a variância estruturada, enquanto os PCs restantes refletem apenas ruído.
        </p>

        <div className="bg-purple-50 border border-purple-200 rounded-2xl px-6 py-5 my-2 text-sm text-slate-700 leading-relaxed space-y-2">
          <p className="font-bold text-slate-800 mb-1">Experimentos guiados no painel:</p>
          <p><span className="font-bold text-purple-600">①</span> Selecione <b>1 PC</b>. Observe o erro RMS alto — apenas a tendência média de expressão é capturada.</p>
          <p><span className="font-bold text-purple-600">②</span> Selecione <b>2 PCs</b>. O erro despenca — os dois fatores latentes foram recuperados.</p>
          <p><span className="font-bold text-purple-600">③</span> Selecione <b>3 PCs</b>. A melhora é marginal — PC3 explica pouca variância adicional além do ruído.</p>
          <p><span className="font-bold text-purple-600">④</span> Selecione <b>6 PCs</b>. Reconstrução exata — mas sem compressão alguma: os dados foram apenas reexpressos.</p>
        </div>

        <NatureMethodsPcaFig2 />

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 my-8">
          <h4 className="font-headline font-bold text-lg text-slate-900 mb-4">Como ler o scree plot — e quando parar</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-relaxed">
            <div>
              <p className="font-bold text-purple-700 mb-1">O que é o scree plot</p>
              <p className="text-slate-600">
                O gráfico de barras à esquerda da figura mostra a variância explicada por cada PC. A variância acumulada pelos primeiros k PCs é exatamente o <b>R²</b> que você obteria se usasse esses k PCs em uma regressão múltipla sobre as variáveis originais — uma ponte direta com o Módulo I.
              </p>
            </div>
            <div>
              <p className="font-bold text-purple-700 mb-1">A regra do cotovelo</p>
              <p className="text-slate-600">
                Procure o ponto em que a curva "dobra" — o cotovelo. PCs antes do cotovelo capturam variância estruturada; PCs depois do cotovelo modelam ruído. No exemplo acima, o cotovelo está entre PC2 e PC3: 2 PCs são suficientes. Retenha sempre o menor número de PCs que explique uma proporção satisfatória da variância total.
              </p>
            </div>
          </div>
        </div>

        <div className="my-16 border-t border-slate-200" />

        <h2 className="text-3xl font-headline font-bold text-slate-900 mt-8 mb-6">3. Sensibilidade de Escala</h2>
        <p className="text-lg text-slate-600 mb-4">
          O PCA <b>não é invariante à escala</b>. Quando um subconjunto de variáveis apresenta magnitude muito maior que as demais — por exemplo, porque foram medidas com técnicas ou unidades diferentes — os PCs passam a refletir quase exclusivamente essas variáveis dominantes, e padrões de agrupamento presentes nas variáveis de menor magnitude são suprimidos. No exemplo abaixo, o Gene 2 tem variância ~300², enquanto o Gene 1 tem variância ~1. Sem padronização, o PC1 se alinha ao ruído vertical, e os dois grupos (vermelho e azul) ficam invisíveis na primeira componente.
        </p>
        <p className="text-lg text-slate-600 mb-4">
          Quando isso ocorre, pode ser apropriado <b>padronizar</b> as variáveis para variância unitária antes de aplicar o PCA. Contudo, a padronização nem sempre é adequada: se as variáveis já estão na mesma escala, padronizá-las pode distorcer os dados — equiparando a variação biologicamente significativa de um gene à variação devida a ruído técnico de outro.
        </p>

        <div className="bg-purple-50 border border-purple-200 rounded-2xl px-6 py-5 my-2 text-sm text-slate-700 leading-relaxed space-y-2">
          <p className="font-bold text-slate-800 mb-1">Experimento guiado no painel:</p>
          <p><span className="font-bold text-purple-600">①</span> Com a padronização <b>desativada</b>, observe que o PC1 (vermelho) alinha-se verticalmente ao Gene 2 — os grupos A e B (separados horizontalmente) são invisíveis.</p>
          <p><span className="font-bold text-purple-600">②</span> <b>Ative a padronização</b>. Os dois genes ficam na mesma escala e PC1 captura a separação entre os grupos.</p>
          <p><span className="font-bold text-purple-600">③</span> Observe a variância explicada mudar — sem padronização PC1 domina com ~100%; com padronização a distribuição é mais equilibrada.</p>
        </div>

        <NatureMethodsPcaFig3 />

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 my-6">
          <p className="text-sm text-amber-800 leading-relaxed">
            <b>Advertência sobre má utilização:</b> é tentador experimentar diferentes escalas até que os grupos desejados apareçam no PCA. Isso é uma forma de <em>p-hacking</em> visual — os grupos revelados podem ser artefatos da escala, não estrutura real dos dados. A decisão de padronizar deve ser tomada com base em critérios técnicos (variâncias heterogêneas por diferenças de unidade ou técnica de medição), antes de inspecionar os resultados, e deve ser reportada explicitamente na metodologia.
          </p>
        </div>

        <div className="my-16 border-t border-slate-200" />

        <h2 className="text-3xl font-headline font-bold text-slate-900 mt-8 mb-6">4. As Três Limitações Estruturais</h2>
        <p className="text-lg text-slate-600 mb-4">
          Por ser um operador linear e ortogonal que maximiza variância, o PCA possui três limitações estruturais. Compreendê-las é essencial para saber quando confiar nos resultados — e quando buscar métodos alternativos como t-SNE, UMAP ou análise de fatores.
        </p>

        <div className="bg-purple-50 border border-purple-200 rounded-2xl px-6 py-5 my-2 text-sm text-slate-700 leading-relaxed space-y-2">
          <p className="font-bold text-slate-800 mb-1">Explore cada limitação no painel:</p>
          <p><span className="font-bold text-purple-600">①</span> <b>Padrões Não-Lineares</b> — observe que PC1 atravessa horizontalmente os dois braços da parábola. O PCA trata a curvatura como ruído e não captura a estrutura real.</p>
          <p><span className="font-bold text-purple-600">②</span> <b>Não-Ortogonais</b> — os dois braços do V não são perpendiculares. PC1 é forçado a se posicionar entre eles; PC2, perpendicular a PC1, não coincide com nenhum dos braços.</p>
          <p><span className="font-bold text-purple-600">③</span> <b>Clusters Ocultos</b> — os dois grupos diferem horizontalmente, mas o ruído vertical domina a variância. PC1 vai para o eixo vertical e os clusters ficam invisíveis na primeira componente.</p>
        </div>

        <NatureMethodsPcaFig4 />

        <p className="text-lg text-slate-600 mt-6">
          A primeira limitação é que a estrutura subjacente deve ser linear — padrões curvos não são capturados. A segunda é que padrões não-ortogonais — eixos de variação que não são perpendiculares — não podem ser representados independentemente, pois todos os PCs são forçados a ser mutualmente ortogonais. A terceira é que o PCA otimiza variância, não separação de grupos — quando a maior fonte de variância não coincide com o eixo de separação entre clusters, os agrupamentos permanecem ocultos nas primeiras componentes. Nesse cenário, alternativas como t-SNE ou UMAP, que otimizam a separação local, são mais apropriadas.
        </p>

        {/* ---------- Quiz ---------- */}
        <QuizSection moduleId="pca" />

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 text-center mt-16">
          {status("pca") === "completed" ? (
            <>
              <Badge className="mb-6 bg-emerald-500 text-white">Currículo Concluído</Badge>
              <h3 className="text-2xl font-headline font-bold text-slate-900 mb-4">Três Pilares da Estatística Aplicada</h3>
              <p className="text-slate-600 max-w-2xl mx-auto mb-8">
                Este currículo piloto cobriu os fundamentos de estimação supervisionada — regressão linear (LSE) e regressão logística (MLE) — e da análise exploratória não-supervisionada (PCA), todos baseados diretamente na série <em>Points of Significance</em> da <em>Nature Methods</em>. O Glossário Técnico reúne as definições formais dos conceitos abordados, e as Referências indicam os artigos originais para aprofundamento.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/nexus/trophies" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
                  Ver Progresso
                </Link>
                <Link href="/nexus/journeys" className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                  Retornar às Trilhas Curriculares
                </Link>
              </div>
            </>
          ) : (
            <>
              <Badge className="mb-6 bg-slate-900 text-white">Finalizar Currículo</Badge>
              <h3 className="text-2xl font-headline font-bold text-slate-900 mb-4">Três Pilares da Estatística Aplicada</h3>
              <p className="text-slate-600 max-w-2xl mx-auto mb-6">
                Este currículo piloto cobriu os fundamentos de estimação supervisionada — regressão linear (LSE) e regressão logística (MLE) — e da análise exploratória não-supervisionada (PCA), todos baseados diretamente na série <em>Points of Significance</em> da <em>Nature Methods</em>. O Glossário Técnico reúne as definições formais dos conceitos abordados, e as Referências indicam os artigos originais para aprofundamento.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                  onClick={() => markCompleted("pca")}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Concluir Módulo
                </button>
                <Link href="/nexus/journeys" className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                  Retornar às Trilhas Curriculares
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
