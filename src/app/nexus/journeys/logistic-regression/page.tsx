"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/ui-forge/ui/card";
import { Badge } from "@/ui-forge/ui/badge";
import { ArrowLeft, Network, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { NatureMethodsLogisticFig1 } from "./_components/nature-methods-logistic-fig1";
import { NatureMethodsLogisticFig2 } from "./_components/nature-methods-logistic-fig2";
import { NatureMethodsLogisticFig3 } from "./_components/nature-methods-logistic-fig3";
import { useProgress } from "@/hooks/use-progress";
import { QuizSection } from "../_components/quiz-section";

export default function LogisticRegressionLesson() {
  const { markInProgress, markCompleted, status } = useProgress();

  useEffect(() => {
    markInProgress("logistic-regression");
  }, [markInProgress]);
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
      {/* ---------- Header ---------- */}
      <div className="flex items-center gap-4">
        <Link href="/nexus/journeys" className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:shadow-md transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary uppercase tracking-widest text-[10px] font-bold">Módulo II · Fundamentos</Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-slate-900">Regressão Logística</h1>
        </div>
      </div>

      {/* ---------- Content ---------- */}
      <div className="prose prose-slate max-w-none text-lg text-slate-600 font-body leading-relaxed space-y-8 md:text-justify">

        {/* ---------- Reference ---------- */}
        <p className="text-sm text-slate-400 border-l-4 border-slate-200 pl-4 leading-relaxed max-w-3xl">
          Este módulo fundamenta-se em:<br />
          <strong>Lever, J., Krzywinski, M. & Altman, N.</strong> <em>Logistic regression.</em> Nature Methods <strong>13</strong>, 541–542 (2016).<br />
          As figuras interativas reproduzem as ilustrações originais, estendidas com controles para experimentação.
        </p>

        {/* ---------- Hook ---------- */}
        <p>
          Imagine que você é oncologista: um novo protocolo de quimioterapia está em avaliação e, para cada paciente, a decisão é binária — administrar ou não. A variável resposta também é binária: o paciente respondeu ao tratamento (Y = 1) ou não (Y = 0). Como estimar a <b>probabilidade de resposta</b> a partir de covariáveis como peso, dosagem e biomarcadores? E como, a partir dessa probabilidade, tomar uma decisão de classificação?
        </p>

        {/* ---------- Motivation ---------- */}
        <p>
          No Módulo I, a variável dependente Y era contínua — peso em quilogramas. Quando Y é <b>categórica binária</b>, a regressão linear encontra dois obstáculos. Primeiro, a reta inevitavelmente cruza os limites [0, 1], produzindo probabilidades preditas negativas ou superiores a 100% — valores sem interpretação. Segundo, a reta de mínimos quadrados é extremamente sensível a pontos de alta alavancagem, que podem deslocar substancialmente o limiar de decisão.
        </p>

        {/* ---------- Section 1 ---------- */}
        <h2 className="text-3xl font-headline font-bold text-slate-900 mt-16 mb-6">1. Três Modelos para Classificação Binária</h2>

        <p>
          Para tornar o problema concreto: prever se um indivíduo é jogador profissional de basquete com base em sua altura. Jogadores profissionais têm altura média de 200 cm; não-profissionais, 170 cm — ambos com desvio-padrão de aproximadamente 15 cm. Os dados são rotulados: Y = 1 para profissionais, Y = 0 para não-profissionais. O painel abaixo permite explorar três abordagens para este problema de classificação.
        </p>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl px-6 py-5 my-2 text-sm text-slate-700 leading-relaxed space-y-2">
          <p className="font-bold text-slate-800 mb-1">Experimentos guiados no painel:</p>
          <p><span className="font-bold text-primary">①</span> Deixe apenas a <b>Regressão Linear</b> ativa. Observe onde a curva cruza 0% e 100% — valores impossíveis para uma probabilidade.</p>
          <p><span className="font-bold text-primary">②</span> Ative a <b>Sigmoide</b>. Ela permanece entre 0% e 100% para qualquer altura — e expressa graus de certeza na região intermediária.</p>
          <p><span className="font-bold text-primary">③</span> Mova o <b>limiar</b> de 50% para 25%. Observe como surgem mais falsos positivos e menos falsos negativos — estratégia útil quando o custo de um diagnóstico perdido é alto.</p>
          <p><span className="font-bold text-primary">④</span> Clique em <b>+ Não-Pro</b> várias vezes. A sigmoide reajusta suavemente; a reta linear desvia mais a cada ponto adicionado.</p>
        </div>

        <NatureMethodsLogisticFig1 />

        <p>
          A <b>reta de regressão linear</b> (tracejada) cruza o intervalo [0, 1] — para alturas extremas, as predições saem do domínio probabilístico. A <b>função degrau</b> (amarela) elimina esse problema com um corte abrupto, mas é incapaz de expressar incerteza: um jogador de 191 cm recebe probabilidade 0% de ser profissional, enquanto um de 195 cm recebe 100%, sem gradação. Além disso, a função degrau não é diferenciável, o que impede o uso de otimização por gradiente.
        </p>

        <p>
          A <b>curva sigmoide logística</b> (roxa) resolve ambos os problemas. Ela mapeia qualquer valor real para o intervalo (0, 1), é infinitamente diferenciável, e suas predições intermediárias — como 30% ou 70% — refletem a incerteza genuína da classificação.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-5 my-4 text-sm text-amber-800 leading-relaxed">
          <p className="font-bold mb-2">A escolha do limiar não é neutra</p>
          <p>
            Por padrão, classificamos como positivo qualquer indivíduo com probabilidade predita ≥ 50%. Mas esse corte implica que os custos de um falso positivo e de um falso negativo são iguais — o que raramente é verdade na prática. No diagnóstico de uma doença grave mas tratável, um falso negativo (deixar de tratar quem precisa) pode ser fatal, enquanto um falso positivo (tratar quem não precisa) causa custo e desconforto. Nesse caso, reduzir o limiar para 25% aumenta a sensibilidade: mais pacientes são encaminhados ao tratamento, ao custo de mais alarmes falsos. A escolha do limiar ideal é uma decisão clínica, não estatística.
          </p>
        </div>

        {/* ---------- Dark Math Card ---------- */}
        <Card className="bg-slate-900 text-slate-300 border-none rounded-[2rem] overflow-hidden my-12 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
          <CardContent className="p-8 md:p-12 relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Network className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-headline font-bold text-white mb-0">Do Logit à Sigmoide: a Construção Passo a Passo</h3>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Passo 1 — Probabilidade p ∈ [0, 1]</p>
                <p className="leading-relaxed">
                  Se p é a probabilidade de pertencer à classe positiva, ela está confinada ao intervalo [0, 1]. Modelar p diretamente como β₀ + β₁X produziria predições fora desse intervalo — o mesmo problema da regressão linear.
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Passo 2 — Odds p/(1−p) ∈ (0, +∞)</p>
                <p className="leading-relaxed">
                  A <b>razão de chances</b> (<i>odds</i>) p/(1−p) remove o limite superior: vai de 0 a +∞. Uma odds de 3 significa "três vezes mais provável de pertencer que de não pertencer". Mas ainda é assimétrica — a diferença entre p = 0,01 e p = 0,50 é muito maior em odds do que entre p = 0,50 e p = 0,99.
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Passo 3 — Log-odds ln(p/(1−p)) ∈ (−∞, +∞)</p>
                <p className="mb-4 leading-relaxed">
                  O logaritmo natural resolve a assimetria: ln(p/(1−p)) vai de −∞ a +∞ e é simétrico em torno de 0 (equivalente a p = 0,5). Agora podemos modelar esse <b>logit</b> como uma combinação linear:
                </p>
                <div className="bg-black/40 rounded-xl p-6 font-mono text-primary text-center text-xl tracking-wider">
                  ln(p / (1 − p)) = β₀ + β₁ · X
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Passo 4 — Invertendo: a função logística</p>
                <p className="mb-4 leading-relaxed">
                  Isolando p na equação acima, obtém-se a curva em "S" — a <b>sigmoide logística</b>:
                </p>
                <div className="bg-black/40 rounded-xl p-6 font-mono text-primary text-center text-xl tracking-wider">
                  p(X) = 1 / (1 + e<sup className="text-sm">−(β₀ + β₁X)</sup>)
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Passo 5 — Estimando β via Máxima Verossimilhança</p>
                <p className="mb-4 leading-relaxed">
                  Os parâmetros β₀ e β₁ são encontrados por <b>Máxima Verossimilhança</b> (MLE): maximiza-se a probabilidade conjunta de observar exatamente os rótulos que ocorreram. Equivalentemente, minimiza-se o <b>negativo da log-verossimilhança</b> (NLL):
                </p>
                <div className="bg-black/40 rounded-xl p-6 font-mono text-primary text-center text-lg tracking-wider">
                  NLL = − Σ [yᵢ · ln(pᵢ) + (1 − yᵢ) · ln(1 − pᵢ)]
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mt-4">
                  O NLL penaliza <b>predições confiantes e erradas</b> de forma severa: se o modelo prediz p = 0,99 para um caso que de fato é negativo (y = 0), a contribuição é −ln(1 − 0,99) = −ln(0,01) ≈ 4,6 — enorme. Se o modelo prediz p = 0,6, a contribuição é −ln(0,4) ≈ 0,9. O otimizador não tolera certeza equivocada.
                </p>
                <p className="text-sm text-slate-400 leading-relaxed mt-2">
                  Diferentemente da regressão linear, não existe solução analítica fechada. A estimação exige otimização numérica iterativa — tipicamente Newton-Raphson ou, como nas figuras interativas deste módulo, o gradiente descendente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-slate-50 border border-l-4 border-slate-300 rounded-r-2xl px-6 py-5 my-4 text-sm text-slate-600 leading-relaxed">
          <p className="font-bold text-slate-800 mb-2">β₁ afeta o log-odds — não a probabilidade diretamente</p>
          <p>
            Um aumento unitário em X incrementa o <b>log-odds</b> em β₁ — constante em todo o domínio. Mas a variação correspondente em <em>probabilidade</em> depende de onde você está na curva. Próximo ao limiar de 50% (região mais íngreme da sigmoide), uma pequena variação em X produz uma grande variação em p. Nos extremos (p ≈ 0 ou p ≈ 1), a curva é plana — variações grandes em X produzem mudanças mínimas em p. Por isso, relatar apenas β₁ sem acompanhá-lo da probabilidade predita em valores de X de interesse é insuficiente para interpretar o efeito prático do preditor.
          </p>
        </div>

        {/* ---------- Section 2: Robustness ---------- */}
        <div className="my-12 border-t border-slate-200" />

        <h2 className="text-3xl font-headline font-bold text-slate-900 mt-8 mb-6">2. Robustez a Outliers: A Vantagem Decisiva da Sigmoide</h2>

        <p>
          A regressão linear é frágil diante de outliers. Um único ponto com X extremo — uma criança de 100 cm no conjunto de treinamento de alturas — exerce alavancagem desproporcional sobre a reta de mínimos quadrados e pode deslocar substancialmente o limiar de classificação.
        </p>

        <p>
          A regressão logística, por outro lado, é <b>intrinsecamente robusta</b> a esse tipo de anomalia. Como a sigmoide converge assintoticamente a 0 e 1 nos extremos, pontos muito distantes do limiar de decisão contribuem pouco para o gradiente da log-verossimilhança. A criança de 100 cm, já classificada como não-profissional com altíssima confiança, mal influencia a posição da curva na região crítica próxima a 190 cm.
        </p>

        <p>
          O painel abaixo permite verificar experimentalmente. A tabela de comparação exibe os limiares de decisão com e sem o outlier — observe a magnitude do deslocamento em cada método.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 my-2 text-sm text-slate-700 leading-relaxed space-y-2">
          <p className="font-bold text-slate-800 mb-1">Experimento guiado no painel:</p>
          <p><span className="font-bold text-indigo-600">①</span> Com o outlier <b>desativado</b>, anote os limiares linear e logístico na tabela abaixo do gráfico.</p>
          <p><span className="font-bold text-indigo-600">②</span> <b>Ative o outlier</b> (criança de 100 cm). Observe o deslocamento do limiar linear — quantos centímetros ele move?</p>
          <p><span className="font-bold text-indigo-600">③</span> Desative a Regressão Linear e deixe apenas a Logística. Note que a curva sigmoide praticamente não muda — a criança de 100 cm já está classificada com quase 0% e não influencia a região crítica próxima a 190 cm.</p>
        </div>

        <NatureMethodsLogisticFig2 />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <Card className="border border-slate-100 rounded-[2rem] shadow-lg bg-blue-50/30">
            <CardContent className="p-8">
              <h4 className="text-xl font-headline font-bold text-slate-900 mb-3">Regressão Linear: Vulnerável</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                A reta de mínimos quadrados atribui peso igual a todos os pontos. Uma observação extrema em X — mesmo que corretamente classificada — desloca a reta inteira, potencialmente alterando o limiar em vários centímetros e gerando novos erros de classificação entre os profissionais de menor estatura.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-100 rounded-[2rem] shadow-lg bg-emerald-50/30">
            <CardContent className="p-8">
              <h4 className="text-xl font-headline font-bold text-slate-900 mb-3">Regressão Logística: Robusta</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                A sigmoide concede baixa alavancagem a pontos distantes do limiar. O gradiente da log-verossimilhança para um ponto em X = 100 cm é quase nulo — a curva já o classificou com probabilidade virtualmente 0. O limiar permanece estável, preservando as classificações corretas próximas à fronteira de decisão.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ---------- Section 3: Perfect Separation ---------- */}
        <div className="my-12 border-t border-slate-200" />

        <h2 className="text-3xl font-headline font-bold text-slate-900 mt-8 mb-6">3. O Colapso da Separação Perfeita</h2>

        <p>
          O MLE da regressão logística possui uma <b>limitação fundamental</b>: ele exige sobreposição entre as classes para produzir uma solução finita. Quando as duas classes são perfeitamente separáveis — não há um único valor de X em que coexistam Y = 0 e Y = 1 — o estimador de máxima verossimilhança <b>não converge</b>.
        </p>

        <p>
          A razão é que, com separação perfeita, qualquer sigmoide suficientemente íngreme classificará corretamente todos os pontos de treinamento. A verossimilhança cresce monotonicamente com β₁: curvas mais íngremes se aproximam de uma função degrau, atribuindo probabilidades cada vez mais próximas de exatamente 0% ou 100%. Mas a verossimilhança nunca atinge seu máximo, porque as probabilidades nunca chegam a exatamente 1 para os profissionais nem a exatamente 0 para os não-profissionais. O gradiente descendente prossegue indefinidamente, com β₁ → ∞ e NLL → 0.
        </p>

        <NatureMethodsLogisticFig3 />

        <p>
          A consequência prática é que, nesse cenário, <b>não é possível estimar os parâmetros de regressão nem atribuir probabilidades calibradas</b> de pertencimento à classe. A curva convergida é essencialmente uma função degrau — ela classifica, mas não quantifica incerteza. A separação perfeita é um sinal de que o preditor é forte demais para o tamanho da amostra, e as soluções incluem regularização ou coleta de mais dados próximos à fronteira de decisão.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 my-8">
          <p className="text-sm text-amber-800 leading-relaxed">
            <b>Diagnóstico prático:</b> se o gradiente descendente produz coeficientes que crescem sem parar a cada época, se o NLL não estabiliza após milhares de iterações, e se a sigmoide se torna vertical no gráfico — o modelo está diante de um caso de separação perfeita (ou quase-perfeita). A solução mais comum é a <b>regularização L2</b>, que adiciona um termo de penalidade λ(β₀² + β₁²) ao NLL, forçando os coeficientes a permanecerem finitos.
          </p>
        </div>

        {/* ---------- Multicollinearity Note ---------- */}
        <div className="bg-slate-50 border border-l-4 border-slate-300 rounded-r-2xl px-6 py-5 my-6 text-sm text-slate-600 leading-relaxed">
          <p className="font-bold text-slate-800 mb-2">Nota: multicolinearidade entre preditores</p>
          <p>
            O modelo logístico, como o linear, é sensível à <b>multicolinearidade</b> — correlação alta entre variáveis independentes. Se utilizarmos altura e envergadura de braços para prever jogadores profissionais, essas variáveis são altamente correlacionadas: qualquer combinação linear que explique igualmente os dados satisfaz o MLE. Os coeficientes individuais perdem interpretabilidade — podem ser grandes e de sinais opostos quando, isoladamente, cada variável já explica bem o desfecho. A solução usual é identificar e remover redundâncias antes do ajuste, ou usar regularização L2 que também controla esse problema.
          </p>
        </div>

        {/* ---------- Quiz ---------- */}
        <div className="my-12 border-t border-slate-200" />
        <QuizSection moduleId="logistic-regression" />

        {/* ---------- Closing ---------- */}
        <div className="my-12 border-t border-slate-200" />

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 text-center mt-16">
          {status("logistic-regression") === "completed" ? (
            <>
              <Badge className="mb-6 bg-emerald-500 text-white">Módulo Concluído</Badge>
              <h3 className="text-2xl font-headline font-bold text-slate-900 mb-4">Classificação Binária — Dominada</h3>
              <p className="text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                Você concluiu este módulo. Os conceitos de função sigmoide, log-odds, MLE e separação perfeita estão registrados no seu progresso.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/nexus/journeys/pca" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
                  Avançar para o Módulo III — PCA
                </Link>
                <Link href="/nexus/trophies" className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                  Ver Progresso
                </Link>
              </div>
            </>
          ) : (
            <>
              <Badge className="mb-6 bg-slate-900 text-white">Próximos Passos</Badge>
              <h3 className="text-2xl font-headline font-bold text-slate-900 mb-4">Classificação Binária Dominada</h3>
              <p className="text-slate-600 max-w-2xl mx-auto mb-4 leading-relaxed">
                A regressão logística é o método padrão para estimar probabilidades de classe e realizar classificação supervisionada binária. Sua robustez natural a outliers e sua capacidade de produzir probabilidades calibradas a tornam preferível à regressão linear sempre que a variável resposta for categórica.
              </p>
              <p className="text-slate-500 max-w-2xl mx-auto mb-6 text-sm">
                Tanto a regressão linear quanto a logística pressupõem a existência de um alvo Y definido. O Módulo III aborda o <b>PCA (Principal Component Analysis)</b> — uma técnica não-supervisionada que, sem rótulos, revela a estrutura interna de dados de alta dimensão.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                  onClick={() => markCompleted("logistic-regression")}
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
