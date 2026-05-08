"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/ui-forge/ui/card";
import { Badge } from "@/ui-forge/ui/badge";
import { ArrowLeft, LineChart, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { LinearRegressionSandbox } from "./_components/linear-regression-sandbox";
import { NatureMethodsLinearFig1 } from "./_components/nature-methods-linear-fig1";
import { NatureMethodsLinearFig2 } from "./_components/nature-methods-linear-fig2";
import { NatureMethodsLinearFig3 } from "./_components/nature-methods-linear-fig3";
import { useProgress } from "@/hooks/use-progress";
import { QuizSection } from "../_components/quiz-section";

export default function LinearRegressionLesson() {
  const { markInProgress, markCompleted, status } = useProgress();

  useEffect(() => {
    markInProgress("linear-regression");
  }, [markInProgress]);
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
      {/* ---------- Header ---------- */}
      <div className="flex items-center gap-4">
        <Link href="/nexus/journeys" className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:shadow-md transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <Badge variant="secondary" className="mb-2 bg-blue-500/10 text-blue-600 uppercase tracking-widest text-[10px] font-bold">Módulo I · Fundamentos</Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-slate-900">Regressão Linear Simples</h1>
        </div>
      </div>

      {/* ---------- Content ---------- */}
      <div className="prose prose-slate max-w-none text-lg text-slate-600 font-body leading-relaxed space-y-8 md:text-justify">

        {/* ---------- Reference ---------- */}
        <p className="text-sm text-slate-400 border-l-4 border-slate-200 pl-4 leading-relaxed max-w-3xl">
          Este módulo fundamenta-se em:<br />
          <strong>Altman, N. & Krzywinski, M.</strong> <em>Simple linear regression.</em> Nature Methods <strong>12</strong>, 999–1000 (2015).<br />
          As figuras interativas reproduzem as ilustrações originais, estendidas com controles para experimentação.
        </p>

        {/* ---------- Hook ---------- */}
        <p>
          Imagine que você quer estimar o peso de um paciente conhecendo apenas sua altura. Não existe uma resposta exata — duas pessoas com 175 cm terão pesos diferentes. Mas existe uma <b>tendência na média</b>: em geral, pessoas mais altas pesam mais. A questão é: como capturar essa tendência de forma rigorosa, e até onde ela nos permite predizer?
        </p>

        {/* ---------- Definition ---------- */}
        <p>
          Dizemos que uma variável <b>Y possui uma regressão sobre X</b> quando a expectativa condicional E(Y|X) — a média de Y para cada valor fixo de X — varia com X. Esta é a definição que estrutura toda a teoria da regressão: não basta que X e Y estejam associados; é preciso que a <b>média condicional</b> se desloque sistematicamente.
        </p>

        <p>
          Na <b>regressão linear simples</b>, há uma única variável independente X e a média condicional é uma função afim:
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-serif text-slate-700 text-center my-6 text-xl shadow-inner">
          E(Y|X) = μ(X) = β₀ + β₁X
        </div>

        <p>
          O intercepto β₀ é o valor esperado de Y quando X = 0; a inclinação β₁ é a variação esperada em Y por unidade adicional de X. O desvio entre o valor observado e a média condicional, ε = Y − μ(X), é chamado de <b>erro</b> — termo que não denota engano, mas o fato de que Y possui uma <b>distribuição</b> para cada valor de X. Na expressão Y = μ(X) + ε, a função μ(X) especifica a posição da distribuição e ε captura sua forma. Para predizer Y em valores não observados de X, basta substituir o valor desejado na equação estimada.
        </p>

        {/* ---------- Section 1: Definition by Contrast ---------- */}
        <h2 className="text-3xl font-headline font-bold text-slate-900 mt-16 mb-6">1. Associação não Basta — é Preciso que a Média se Desloque</h2>

        <p>
          A definição de regressão torna-se mais nítida por contraste. O painel abaixo apresenta quatro cenários. Em cada um, a linha escura é a <b>expectativa condicional</b> E(Y|X). Navegue entre eles para observar quando há — e quando não há — regressão.
        </p>

        <NatureMethodsLinearFig1 />

        <p>
          Nos cenários A e B, E(Y|X) é constante — portanto <b>não há regressão</b>. Em B, a variância cresce com X (heterocedasticidade): há associação, mas a média condicional não se altera. Já em C e D, E(Y|X) varia com X — em C linearmente, em D de forma não-linear. Ambos são regressões legítimas. A consequência prática é direta: se há regressão, X carrega informação sobre Y que pode ser usada para predição; sem regressão, o melhor preditor de Y é simplesmente a média marginal Ȳ, qualquer que seja X.
        </p>

        <div className="bg-slate-50 border border-l-4 border-slate-300 rounded-r-2xl px-6 py-5 my-6 text-sm text-slate-600 leading-relaxed">
          <p className="font-bold text-slate-800 mb-2">Nota: o que é um modelo "linear"?</p>
          <p>
            O termo "linear" refere-se aos <b>parâmetros</b> β₀ e β₁, não necessariamente à forma de X. Os modelos β₀ + β₁X² e β₀ + β₁sen(X) são regressões lineares — os valores preditos são funções lineares dos parâmetros. Já exp(β₀ + β₁X) é não-linear, porque os parâmetros aparecem dentro da exponencial. A ANOVA clássica, em que cada média de grupo é estimada pela média amostral correspondente, é um caso particular de modelo linear com variáveis indicadoras — o cenário D do painel acima (não-linear em X, mas ainda linear nos parâmetros) também entra nessa família.
          </p>
        </div>

        {/* ---------- Section 2: LSE ---------- */}
        <div className="my-12 border-t border-slate-200" />

        <h2 className="text-3xl font-headline font-bold text-slate-900 mt-8 mb-6">2. Encontrando a Melhor Reta: O Estimador de Mínimos Quadrados</h2>

        <p>
          Dados <em>n</em> pares observados (xᵢ, yᵢ), o problema é encontrar estimativas β̂₀ e β̂₁ que produzam a melhor reta possível. O método mais utilizado — por suas propriedades estatísticas favoráveis para distribuições de erro muito gerais — é o <b>Estimador de Mínimos Quadrados</b> (LSE, do inglês <i>Least-Squares Estimator</i>).
        </p>

        <Card className="bg-slate-900 text-slate-300 border-none rounded-[2rem] overflow-hidden my-8 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full" />
          <CardContent className="p-8 md:p-12 relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                <LineChart className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-headline font-bold text-white mb-0">A Ideia Central</h3>
            </div>
            <p className="mb-6 leading-relaxed">
              O LSE escolhe β̂₀ e β̂₁ que minimizam a <b>Soma dos Quadrados dos Erros</b> (SSE, ou soma dos resíduos ao quadrado):
            </p>
            <div className="bg-slate-950/50 rounded-2xl p-8 font-serif text-blue-400 text-center my-8 text-3xl tracking-wider shadow-inner">
              SSE = <span className="text-2xl">Σ</span> (yᵢ − ŷᵢ)²
            </div>
            <p className="leading-relaxed">
              onde ŷᵢ = β̂₀ + β̂₁xᵢ são os <b>valores ajustados</b> — os pontos sobre a reta estimada. Elevar ao quadrado penaliza erros grandes mais que proporcionalmente e impede que desvios de sinais opostos se cancelem. Igualando as derivadas parciais a zero, obtêm-se as soluções analíticas:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="bg-slate-950/50 rounded-xl p-6 text-center font-serif">
                <p className="text-sm text-slate-400 mb-2 uppercase tracking-widest">Inclinação</p>
                <p className="text-2xl text-blue-400">β̂₁ = r · (s<sub>Y</sub> / s<sub>X</sub>)</p>
              </div>
              <div className="bg-slate-950/50 rounded-xl p-6 text-center font-serif">
                <p className="text-sm text-slate-400 mb-2 uppercase tracking-widest">Intercepto</p>
                <p className="text-2xl text-blue-400">β̂₀ = Ȳ − β̂₁ · X̄</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              onde r é o coeficiente de correlação de Pearson, s<sub>X</sub> e s<sub>Y</sub> são os desvios-padrão amostrais, e X̄ e Ȳ são as médias. A segunda equação revela que a reta de mínimos quadrados sempre passa pelo centroide (X̄, Ȳ).
            </p>
          </CardContent>
        </Card>

        <p>
          O simulador abaixo concretiza essa ideia. Os doze pontos representam medições de Altura (cm) × Peso (kg). Os <b>quadrados coloridos</b> ao redor de cada ponto têm área proporcional ao erro absoluto |εᵢ| daquele indivíduo; quanto maior o quadrado, mais longe esse ponto está da reta. As linhas tracejadas vermelhas são os resíduos εᵢ que o LSE busca minimizar coletivamente.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-6 py-4 my-2 text-sm text-blue-800 leading-relaxed">
          <b>Experimento:</b> antes de clicar em <em>Otimizar (LSE)</em>, mova os sliders de β₁ e β₀ manualmente e observe o SSE mudar. Tente encontrar a combinação que minimiza o SSE. Depois clique em <em>Otimizar</em> para ver a solução analítica — ela coincide com o mínimo global que você está procurando.
        </div>

        <LinearRegressionSandbox />

        <div className="bg-violet-50 border border-violet-200 rounded-3xl p-8 my-6">
          <h4 className="font-headline font-bold text-lg text-violet-900 mb-3">R² — Qual fração da variação de Y a reta explica?</h4>
          <p className="text-sm text-violet-800 leading-relaxed mb-4">
            O SSE mede o quanto sobrou <em>depois</em> do ajuste. Mas quanto havia para explicar? A variação total de Y é medida pelo <b>SST</b> (soma total dos quadrados):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-center font-serif text-sm">
            <div className="bg-white rounded-xl p-4 border border-violet-100">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">SST</p>
              <p className="text-violet-700 font-bold">Σ (yᵢ − ȳ)²</p>
              <p className="text-xs text-slate-500 mt-1">Variação total de Y</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-violet-100">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">SSR</p>
              <p className="text-violet-700 font-bold">Σ (ŷᵢ − ȳ)²</p>
              <p className="text-xs text-slate-500 mt-1">Variação explicada pela reta</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-violet-100">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">SSE</p>
              <p className="text-violet-700 font-bold">Σ (yᵢ − ŷᵢ)²</p>
              <p className="text-xs text-slate-500 mt-1">Variação residual (não explicada)</p>
            </div>
          </div>
          <p className="text-sm text-violet-800 leading-relaxed">
            Estas três quantidades satisfazem <b>SST = SSR + SSE</b>. O coeficiente de determinação <b>R² = SSR/SST = 1 − SSE/SST</b> é a proporção da variância de Y explicada pelo modelo — um número entre 0 e 1. Quando a reta é perfeita (SSE = 0), R² = 1; quando a reta é inútil (reta horizontal), R² = 0. O valor R² coincide exatamente com o quadrado do coeficiente de correlação de Pearson r² — que já aparece na fórmula de β̂₁ acima. No simulador, observe como R² cresce conforme você aproxima a reta do ótimo LSE.
          </p>
        </div>

        <p className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50 rounded-r-xl">
          <b>Propriedade fundamental:</b> quando os erros têm média zero, β̂₀ e β̂₁ são <b>não-viesados</b> — em amostras repetidas, não sistematicamente superestimam nem subestimam os verdadeiros β₀ e β₁. Esta propriedade <b>não requer normalidade</b> dos erros. Entretanto, o LSE é sensível a valores extremos: um único ponto com X muito distante (alta alavancagem) ou com Y muito atípico (outlier) pode distorcer substancialmente as estimativas. Uma análise diagnóstica de outliers é recomendável antes de interpretar os coeficientes.
        </p>

        {/* ---------- Section 3: Uncertainty ---------- */}
        <div className="my-12 border-t border-slate-200" />

        <h2 className="text-3xl font-headline font-bold text-slate-900 mt-8 mb-6">3. Duas Incertezas, Duas Perguntas Diferentes</h2>

        <p>
          A reta estimada ŷ(x) = β̂₀ + β̂₁x modela a <b>média condicional</b>, não os valores individuais. Uma vez que temos a reta, surgem duas perguntas naturais e muito diferentes entre si:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 text-sm">
          <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
            <p className="font-bold text-indigo-800 mb-1">Pergunta 1 — sobre a reta</p>
            <p className="text-indigo-700 leading-relaxed">
              Se repetíssemos o estudo muitas vezes, onde estaria a reta verdadeira μ(x)? Essa é uma incerteza sobre os <b>parâmetros estimados</b> — e diminui com mais dados.
            </p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
            <p className="font-bold text-amber-800 mb-1">Pergunta 2 — sobre um novo indivíduo</p>
            <p className="text-amber-700 leading-relaxed">
              Se chegasse um novo paciente com altura x, onde cairia seu peso? Essa é uma incerteza sobre a <b>variabilidade biológica</b> — e não desaparece mesmo com amostras enormes.
            </p>
          </div>
        </div>

        <p>
          Quando os erros têm variância constante σ², é possível quantificar cada uma dessas incertezas com um intervalo formal:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <Card className="border border-slate-100 rounded-[2rem] shadow-lg bg-indigo-50/30">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 text-lg font-bold">μ</div>
              <h4 className="text-xl font-headline font-bold text-slate-900 mb-3">Intervalo de Confiança (CI) 95%</h4>
              <p className="text-sm leading-relaxed text-slate-600 mb-4">
                <b>Onde está a reta média?</b> O IC estima a faixa em que μ(x) = E(Y|X) se encontra, para um valor fixo x.
              </p>
              <div className="bg-white rounded-xl p-4 font-serif text-sm text-indigo-700 text-center shadow-sm">
                β̂₀ + β̂₁x ± t₀.₉₇₅ · SE(ŷ(x))
              </div>
              <p className="text-xs leading-relaxed text-slate-500 mt-3">
                SE(ŷ(x)) = √(MSE · (1/n + (x − X̄)²/sXX)). A cobertura de 95% é <b>pontual</b>: válida para cada x individualmente, não para a reta inteira simultaneamente.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-100 rounded-[2rem] shadow-lg bg-amber-50/30">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6 text-lg font-bold">Y</div>
              <h4 className="text-xl font-headline font-bold text-slate-900 mb-3">Intervalo de Predição (PI) 95%</h4>
              <p className="text-sm leading-relaxed text-slate-600 mb-4">
                <b>Onde estará um novo indivíduo?</b> O PI estima a faixa em que uma nova observação Y cairá, para um valor fixo x.
              </p>
              <div className="bg-white rounded-xl p-4 font-serif text-sm text-amber-700 text-center shadow-sm">
                β̂₀ + β̂₁x ± t₀.₉₇₅ · √(MSE · (1 + 1/n + (x − X̄)²/sXX))
              </div>
              <p className="text-xs leading-relaxed text-slate-500 mt-3">
                O termo adicional "1 + " sob a raiz incorpora a variância populacional σ². São três fontes de incerteza somadas: σ², a incerteza nos parâmetros, e a incerteza por estimar σ² via MSE.
              </p>
            </CardContent>
          </Card>
        </div>

        <p>
          A diferença crucial entre os dois intervalos revela-se no comportamento assintótico. O painel abaixo permite verificar experimentalmente:
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 my-2 text-sm text-slate-700 leading-relaxed space-y-2">
          <p className="font-bold text-slate-800 mb-1">Experimentos guiados no painel:</p>
          <p><span className="font-bold text-indigo-600">①</span> Comece com <b>n = 5</b> e σ = 3. Observe como ambas as faixas são largas.</p>
          <p><span className="font-bold text-indigo-600">②</span> Aumente <b>n para 100</b>. O IC (azul) encolhe drasticamente; o PI (cinza) mal se move.</p>
          <p><span className="font-bold text-indigo-600">③</span> Com n = 100, reduza <b>σ para 0,5</b>. Agora <em>ambos</em> encolhem — mas o PI continua maior que o IC.</p>
          <p><span className="font-bold text-slate-500 text-xs">O IC depende de n; o PI depende de σ. São duas incertezas independentes.</span></p>
        </div>

        <NatureMethodsLinearFig2 />

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 my-10">
          <h4 className="font-headline font-bold text-lg text-slate-900 mb-4">Comportamento quando n → ∞</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-relaxed">
            <div>
              <p className="font-bold text-indigo-700 mb-1">Intervalo de Confiança</p>
              <p className="text-slate-600">
                O erro-padrão SE(ŷ(x)) tende a zero — o termo 1/n desaparece e sXX cresce com n. <b>O IC colapsa sobre a reta verdadeira.</b> A incerteza sobre a média se extingue com dados suficientes. A validade do IC para grandes amostras é resgatada pelo Teorema Central do Limite, mesmo sem normalidade dos erros.
              </p>
            </div>
            <div>
              <p className="font-bold text-amber-700 mb-1">Intervalo de Predição</p>
              <p className="text-slate-600">
                O termo "1" sob a raiz permanece. <b>O PI converge para μ(x) ± 1,96σ</b> — inteiramente determinado pela variabilidade biológica. Nem amostras infinitas o reduzem além desse piso. Além disso, a validade do PI <b>não melhora com n maior</b>: ele exige normalidade aproximada dos erros, e essa exigência é independente do tamanho amostral.
              </p>
            </div>
          </div>
        </div>

        <p>
          Ambos os intervalos são mais estreitos em x = X̄ e se alargam nas extremidades — consequência do termo (x − X̄)² em todas as expressões de erro-padrão. Predições para valores distantes da média são intrinsecamente mais incertas, mesmo com parâmetros perfeitamente estimados.
        </p>

        {/* ---------- Section 4: Regression to the Mean ---------- */}
        <div className="my-12 border-t border-slate-200" />

        <h2 className="text-3xl font-headline font-bold text-slate-900 mt-8 mb-6">4. A Falácia da Regressão à Média</h2>

        <p>
          Uma consequência matemática do LSE que há séculos é confundida com causalidade é a <b>regressão à média</b>. O termo "regressão" em estatística vem exatamente daqui: Francis Galton, no século XIX, observou que filhos de pais muito altos tendiam a ser mais altos que a média — mas <em>menos</em> altos que seus pais. Ele chamou o fenômeno de <em>regression to mediocrity</em> (regressão à mediocridade), e a palavra ficou.
        </p>

        <p>
          O experimento abaixo ilustra o mesmo fenômeno numa população com altura média de 170 cm, peso médio de 70 kg e correlação ρ = 0,64 entre as duas variáveis.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-serif text-slate-700 my-6 text-base shadow-inner space-y-2">
          <p><b>1.</b> Tome uma altura H afastada da média — por exemplo, H = 175 cm.</p>
          <p><b>2.</b> A regressão Y~X prediz um peso W a partir de H.</p>
          <p><b>3.</b> Inverta: a regressão X~Y prediz uma nova altura H′ a partir de W.</p>
          <p className="font-bold text-slate-900">Resultado: |H′ − média| &lt; |H − média|. A predição reversa está sempre mais próxima da média.</p>
        </div>

        <p>
          O fenômeno é simétrico: pontos abaixo da média geram predições de retorno acima do ponto de partida. A <b>falácia</b> consiste em atribuir a isso uma causa substantiva — "os extremos regridem", "a natureza se equilibra" — quando se trata de um artefato inevitável do método de estimação sempre que |ρ| &lt; 1.
        </p>

        <NatureMethodsLinearFig3 />

        <p>
          A raiz geométrica está na <b>assimetria das duas retas</b>: Y~X (azul) minimiza os quadrados dos erros verticais; X~Y (verde) minimiza os quadrados dos erros horizontais. Elas só coincidem quando |ρ| = 1. O ciclo X → Y → X′ alterna entre as duas, produzindo um movimento em direção ao centroide. O fator de contração a cada ciclo completo é exatamente ρ² = 0,41: a distância à média é multiplicada por 0,41 a cada ida-e-volta.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 my-8">
          <p className="text-sm text-amber-800 leading-relaxed">
            <b>Implicação prática:</b> a regressão à média é onipresente em estudos que selecionam indivíduos por um critério extremo e os remedem. Se medirmos a pressão arterial de uma população, isolarmos o decil superior e os remedirmos algum tempo depois, a média do grupo <em>necessariamente</em> terá diminuído — mesmo sem tratamento algum. Atribuir a redução a uma intervenção sem grupo-controle é a manifestação mais comum e perigosa da falácia.
          </p>
        </div>

        {/* ---------- Quiz ---------- */}
        <div className="my-12 border-t border-slate-200" />
        <QuizSection moduleId="linear-regression" />

        {/* ---------- Closing ---------- */}
        <div className="my-12 border-t border-slate-200" />

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 text-center mt-16">
          {status("linear-regression") === "completed" ? (
            <>
              <Badge className="mb-6 bg-emerald-500 text-white">Módulo Concluído</Badge>
              <h3 className="text-2xl font-headline font-bold text-slate-900 mb-4">Regressão Linear — Dominada</h3>
              <p className="text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                Você concluiu este módulo. Os conceitos de LSE, intervalos de confiança e predição, e a falácia da regressão à média estão registrados no seu progresso.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/nexus/journeys/logistic-regression" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
                  Avançar para o Módulo II — Regressão Logística
                </Link>
                <Link href="/nexus/trophies" className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                  Ver Progresso
                </Link>
              </div>
            </>
          ) : (
            <>
              <Badge className="mb-6 bg-slate-900 text-white">Próximos Passos</Badge>
              <h3 className="text-2xl font-headline font-bold text-slate-900 mb-4">O Modelo Linear Tem Limites</h3>
              <p className="text-slate-600 max-w-2xl mx-auto mb-4 leading-relaxed">
                O LSE é robusto à não-normalidade dos erros para estimação de parâmetros, mas é sensível a pontos de alta alavancagem e outliers. Quando a variável resposta é <b>categórica binária</b> — aprovado/reprovado, sobrevivente/não-sobrevivente — a regressão linear produz predições fora do intervalo [0, 1] e sua fronteira de decisão é facilmente deslocada por anomalias.
              </p>
              <p className="text-slate-500 max-w-2xl mx-auto mb-6 text-sm">
                O Módulo II introduz a <b>Regressão Logística</b>, que resolve essas limitações substituindo a reta pela função sigmoide e estimando os parâmetros por Máxima Verossimilhança.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                  onClick={() => markCompleted("linear-regression")}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Concluir Módulo
                </button>
                <Link href="/nexus/journeys/logistic-regression" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
                  Avançar para o Módulo II
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
