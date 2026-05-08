export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type QuizData = {
  moduleId: string;
  moduleLabel: string;
  questions: QuizQuestion[];
};

export const QUIZ_DATA: Record<string, QuizData> = {
  "linear-regression": {
    moduleId: "linear-regression",
    moduleLabel: "Regressão Linear Simples",
    questions: [
      {
        id: 1,
        question:
          "O que representa o coeficiente β₁ em um modelo de regressão linear simples y = β₀ + β₁x?",
        options: [
          "O valor de y quando x = 0",
          "A variação esperada em y para um aumento de uma unidade em x",
          "O erro médio do modelo",
          "A correlação entre x e y",
        ],
        correctIndex: 1,
        explanation:
          "β₁ é a inclinação da reta — representa quanto y varia, em média, quando x aumenta em 1 unidade. β₀ é o intercepto (valor de y quando x = 0).",
      },
      {
        id: 2,
        question: "O método dos Mínimos Quadrados Ordinários (OLS) define a reta de regressão minimizando:",
        options: [
          "A soma dos resíduos (Σ eᵢ)",
          "A soma dos valores absolutos dos resíduos (Σ |eᵢ|)",
          "A soma dos quadrados dos resíduos (SSE = Σ eᵢ²)",
          "A soma dos quadrados das variáveis preditoras",
        ],
        correctIndex: 2,
        explanation:
          "O OLS minimiza a SSE — soma dos quadrados dos erros verticais entre os pontos observados e a reta ajustada. Isso produz estimativas de β₀ e β₁ que têm propriedades estatísticas desejáveis (BLUE — melhores estimativas lineares não-viesadas).",
      },
      {
        id: 3,
        question: "Um modelo de regressão linear apresenta R² = 0,87. A interpretação correta é:",
        options: [
          "87% dos dados estão acima da linha de regressão",
          "87% da variância total da variável resposta é explicada pelo modelo",
          "O coeficiente de inclinação é igual a 0,87",
          "O modelo erra em 13% das predições",
        ],
        correctIndex: 1,
        explanation:
          "R² = 1 − SSE/SST mede a proporção da variância total (SST) que o modelo consegue explicar. R² = 0,87 significa que 87% da variabilidade de y é capturada pela relação linear com x.",
      },
      {
        id: 4,
        question: "Qual é a principal diferença entre um Intervalo de Confiança (IC) e um Intervalo de Predição (IP) na regressão linear?",
        options: [
          "O IC é sempre mais largo que o IP",
          "O IC estima a média de y para um dado x; o IP estima um novo valor individual de y",
          "O IC usa 95% de confiança e o IP usa 99%",
          "Não há diferença — ambos medem a incerteza da reta ajustada",
        ],
        correctIndex: 1,
        explanation:
          "O IC captura a incerteza sobre a média populacional de y para um dado x. O IP captura, adicionalmente, a variabilidade individual dos pontos — por isso é sempre mais largo que o IC.",
      },
      {
        id: 5,
        question:
          "A regressão linear é 'linear nos parâmetros'. Isso significa que um modelo como y = β₀ + β₁x² é:",
        options: [
          "Inválido, pois x² torna o modelo não-linear",
          "Válido, pois os parâmetros β₀ e β₁ entram de forma linear na equação",
          "Válido apenas se β₁ < 1",
          "Inválido, pois a relação entre y e x original não é linear",
        ],
        correctIndex: 1,
        explanation:
          "Linearidade nos parâmetros significa que β₀ e β₁ aparecem com expoente 1 e não são multiplicados entre si. Pode-se transformar x em x² — isso define uma relação linear nos parâmetros, embora curvilínea na variável original x.",
      },
      {
        id: 6,
        question: "Qual das seguintes afirmações sobre o valor-p do coeficiente β₁ é CORRETA?",
        options: [
          "Um valor-p pequeno (< 0,05) indica que β₁ é clinicamente relevante",
          "Um valor-p pequeno indica evidência contra a hipótese nula H₀: β₁ = 0",
          "O valor-p mede a probabilidade de β₁ ser o valor verdadeiro",
          "Um valor-p grande confirma que não há relação entre x e y",
        ],
        correctIndex: 1,
        explanation:
          "O valor-p testa H₀: β₁ = 0. Um valor-p < 0,05 indica que os dados são improváveis sob H₀, sugerindo que há associação linear. Mas significância estatística não implica relevância clínica ou prática.",
      },
      {
        id: 7,
        question: "A diferença entre a regressão linear e a linha de regressão de y em x é:",
        options: [
          "A reta de regressão minimiza distâncias perpendiculares; a regressão linear minimiza distâncias verticais",
          "São idênticas — apenas nomenclaturas diferentes",
          "A reta de regressão minimiza distâncias verticais; o PCA minimiza distâncias perpendiculares",
          "A regressão linear é bivariada; a reta de regressão é multivariada",
        ],
        correctIndex: 2,
        explanation:
          "A regressão linear OLS minimiza os erros verticais (residuos em y) — assume que x é medido sem erro. Já o PCA (PC1) minimiza as distâncias perpendiculares aos pontos. Essa diferença é fundamental: as duas retas não são iguais.",
      },
      {
        id: 8,
        question: "Qual é a relação matemática entre R² e o coeficiente de correlação de Pearson r?",
        options: [
          "R² = 2r",
          "R² = r²  (apenas na regressão linear simples)",
          "R² = |r|",
          "Não há relação algébrica entre R² e r",
        ],
        correctIndex: 1,
        explanation:
          "Na regressão linear simples, R² = r². Por isso R² é chamado de 'coeficiente de determinação'. Em regressão múltipla essa equivalência não se mantém da mesma forma.",
      },
      {
        id: 9,
        question: "Um gráfico de resíduos versus valores ajustados mostra um padrão em forma de funil (variância crescente). Isso indica:",
        options: [
          "Linearidade — o modelo está bem ajustado",
          "Heterocedasticidade — a variância dos erros não é constante",
          "Multicolinearidade entre preditores",
          "Que o modelo precisa de mais observações",
        ],
        correctIndex: 1,
        explanation:
          "O padrão em funil indica heterocedasticidade: a variância dos resíduos aumenta com os valores ajustados. Isso viola a premissa OLS de variância constante (homocedasticidade), tornando os intervalos de confiança imprecisos.",
      },
      {
        id: 10,
        question: "Francis Galton introduziu o conceito de 'regressão à média'. O que isso descreve?",
        options: [
          "Que os resíduos do modelo convergem para zero com mais dados",
          "Que valores extremos de pais tendem a ter filhos com valores mais próximos da média populacional",
          "Que a reta de regressão sempre passa pela média de y",
          "Que o modelo subestima os valores extremos da variável resposta",
        ],
        correctIndex: 1,
        explanation:
          "Galton observou que filhos de pais muito altos tendiam a ser mais baixos que seus pais, e filhos de pais muito baixos tendiam a ser mais altos — ambos se 'regredindo' em direção à média. A reta de regressão captura essa tendência estatística.",
      },
    ],
  },

  "logistic-regression": {
    moduleId: "logistic-regression",
    moduleLabel: "Regressão Logística",
    questions: [
      {
        id: 1,
        question: "Por que a regressão linear não é adequada para modelar probabilidades binárias (0/1)?",
        options: [
          "Porque ela não tem coeficiente de determinação R²",
          "Porque ela pode produzir predições fora do intervalo [0, 1] e viola premissas de normalidade dos erros",
          "Porque ela não aceita variáveis categóricas como preditores",
          "Porque ela exige muito mais dados que a regressão logística",
        ],
        correctIndex: 1,
        explanation:
          "Com uma variável resposta binária (0/1), a regressão linear pode predizer probabilidades negativas ou maiores que 1, o que é incoerente. Além disso, os erros são binários — não normais — violando as premissas OLS.",
      },
      {
        id: 2,
        question: "Na regressão logística, o 'log-odds' (ou logit) é definido como:",
        options: [
          "log(p × (1 − p))",
          "log(p / (1 − p))",
          "p / (1 − p)",
          "log(β₀ + β₁x)",
        ],
        correctIndex: 1,
        explanation:
          "O logit transforma uma probabilidade p em log-odds: logit(p) = ln(p / (1 − p)). Esse valor varia de −∞ a +∞, tornando possível modelá-lo como combinação linear de preditores.",
      },
      {
        id: 3,
        question: "A função sigmóide σ(z) = 1 / (1 + e^−z) tem qual propriedade fundamental para a regressão logística?",
        options: [
          "Ela transforma qualquer valor real em uma probabilidade entre 0 e 1",
          "Ela garante que os coeficientes sejam não-negativos",
          "Ela lineariza a relação entre x e y",
          "Ela minimiza a soma dos quadrados dos erros",
        ],
        correctIndex: 0,
        explanation:
          "A sigmóide mapeia qualquer número real (−∞ a +∞) para o intervalo aberto (0, 1), o que é essencial para que a saída seja interpretável como probabilidade.",
      },
      {
        id: 4,
        question: "Na estimação por Máxima Verossimilhança (MLE), os parâmetros são encontrados minimizando:",
        options: [
          "A soma dos quadrados dos resíduos (SSE)",
          "A log-verossimilhança negativa (NLL = −ln L)",
          "A distância entre a curva ajustada e os dados",
          "O valor-p dos coeficientes",
        ],
        correctIndex: 1,
        explanation:
          "O MLE maximiza a verossimilhança L (produto das probabilidades de cada observação). Na prática, minimiza a NLL (negative log-likelihood) — matematicamente equivalente — porque logaritmos facilitam os cálculos e a soma é numericamente mais estável que o produto.",
      },
      {
        id: 5,
        question: "O coeficiente β₁ na regressão logística é interpretado como:",
        options: [
          "A mudança absoluta na probabilidade de evento quando x aumenta 1 unidade",
          "A mudança no log-odds do evento para um aumento de 1 unidade em x",
          "A correlação entre x e a variável resposta binária",
          "A taxa de acerto do modelo quando x aumenta 1 unidade",
        ],
        correctIndex: 1,
        explanation:
          "β₁ representa a mudança no log-odds para um aumento de 1 unidade em x. Exponenciando: e^β₁ é o odds ratio — razão pela qual os odds do evento se multiplicam a cada unidade de x.",
      },
      {
        id: 6,
        question: "Em um modelo logístico com limiar de decisão 0,5, um paciente com probabilidade predita de 0,42 seria classificado como:",
        options: [
          "Evento (positivo)",
          "Não-evento (negativo)",
          "Indeterminado — o modelo não consegue classificar",
          "Depende do valor de β₀",
        ],
        correctIndex: 1,
        explanation:
          "Com limiar 0,5, classifica-se como positivo se p̂ ≥ 0,5 e como negativo se p̂ < 0,5. Como 0,42 < 0,5, o paciente é classificado como não-evento.",
      },
      {
        id: 7,
        question: "Em um diagnóstico oncológico, falsos negativos (perder um câncer real) são muito mais graves que falsos positivos (alarme falso). Como o limiar de decisão deveria ser ajustado?",
        options: [
          "Aumentado para 0,8 — para reduzir alarmes falsos",
          "Mantido em 0,5 — o padrão é sempre adequado",
          "Reduzido para 0,2 — para classificar mais casos como positivos e capturar mais verdadeiros positivos",
          "Eliminado — a regressão logística não precisa de limiar",
        ],
        correctIndex: 2,
        explanation:
          "Reduzir o limiar aumenta a sensibilidade (proporção de casos positivos verdadeiros detectados), ao custo de mais falsos positivos. Quando o custo de um falso negativo é muito alto — como deixar de detectar câncer — vale aceitar mais alarmes falsos.",
      },
      {
        id: 8,
        question: "Multicolinearidade na regressão logística ocorre quando:",
        options: [
          "A variável resposta tem muitos valores extremos",
          "Dois ou mais preditores são altamente correlacionados entre si",
          "O tamanho da amostra é muito pequeno para o número de variáveis resposta",
          "O modelo é não-linear nos parâmetros",
        ],
        correctIndex: 1,
        explanation:
          "Multicolinearidade ocorre quando preditores são altamente correlacionados. Isso torna difícil estimar o efeito isolado de cada um, infla os erros padrão dos coeficientes e pode tornar os estimadores instáveis — pequenas mudanças nos dados levam a grandes mudanças nos coeficientes.",
      },
      {
        id: 9,
        question: "Qual das seguintes afirmações descreve corretamente a curva ROC?",
        options: [
          "Ela plota a sensibilidade versus a especificidade para todos os possíveis limiares de decisão",
          "Ela plota os coeficientes β versus os valores-p do modelo",
          "Ela mostra a distribuição dos resíduos do modelo logístico",
          "Ela é equivalente ao R² da regressão linear aplicado ao contexto logístico",
        ],
        correctIndex: 0,
        explanation:
          "A curva ROC (Receiver Operating Characteristic) plota Sensibilidade (taxa de verdadeiros positivos) no eixo y versus 1−Especificidade (taxa de falsos positivos) no eixo x, para cada possível limiar. A área sob a curva (AUC) resume o poder discriminativo do modelo.",
      },
      {
        id: 10,
        question: "Por que os 'odds' são usados como etapa intermediária na construção da regressão logística?",
        options: [
          "Porque odds são sempre maiores que probabilidades, tornando o modelo mais preciso",
          "Porque a função ln(odds) transforma o intervalo [0,1] das probabilidades em (−∞, +∞), compatível com a regressão linear",
          "Porque odds permitem calcular o MLE com menor custo computacional",
          "Porque odds são exigidos pelas premissas do teorema de Bayes",
        ],
        correctIndex: 1,
        explanation:
          "A transformação p → odds = p/(1−p) mapeia [0,1] para [0,+∞). Em seguida, log(odds) mapeia para (−∞,+∞). Isso remove as restrições de amplitude e permite que a combinação linear β₀ + β₁x assuma qualquer valor real sem violar a interpretação probabilística.",
      },
    ],
  },

  pca: {
    moduleId: "pca",
    moduleLabel: "Análise de Componentes Principais (PCA)",
    questions: [
      {
        id: 1,
        question: "O que o PCA maximiza ao definir o Primeiro Componente Principal (PC1)?",
        options: [
          "A correlação entre os preditores originais",
          "A variância das projeções dos dados sobre o eixo definido pelo componente",
          "O número de observações corretamente classificadas",
          "A distância euclidiana total entre todos os pares de pontos",
        ],
        correctIndex: 1,
        explanation:
          "PC1 é o eixo de projeção que maximiza a variância das projeções dos pontos — equivalentemente, minimiza as distâncias perpendiculares entre os pontos e o eixo. PC2 faz o mesmo, mas com a restrição de ser ortogonal a PC1.",
      },
      {
        id: 2,
        question: "Por que é geralmente importante padronizar as variáveis antes de aplicar o PCA?",
        options: [
          "Para garantir que o algoritmo convirja mais rapidamente",
          "Porque variáveis com maior escala (maior variância bruta) dominariam o PC1, independentemente de sua relevância",
          "Para que os componentes principais sejam sempre positivos",
          "Porque o PCA não funciona com variáveis em escalas diferentes",
        ],
        correctIndex: 1,
        explanation:
          "O PCA maximiza variância. Se uma variável tem escala 300× maior que outra, ela domina naturalmente o PC1 — mesmo que a estrutura informativa esteja na variável menor. Padronizar (subtrair a média e dividir pelo desvio padrão) coloca todas na mesma escala.",
      },
      {
        id: 3,
        question: "No contexto do PCA, o que são 'loadings'?",
        options: [
          "Os valores de cada observação projetados no espaço de componentes principais (os scores)",
          "Os pesos de cada variável original em cada componente principal — a contribuição de cada gene/feature ao PC",
          "A variância explicada por cada componente em percentagem",
          "Os autovalores da matriz de covariância",
        ],
        correctIndex: 1,
        explanation:
          "Loadings são os coeficientes que compõem cada PC — indicam o quanto cada variável original contribui para aquele componente. Scores são os valores de cada observação no novo espaço de componentes.",
      },
      {
        id: 4,
        question: "Um scree plot mostra a variância explicada por cada componente. O 'critério do cotovelo' sugere:",
        options: [
          "Reter os componentes com variância acima de 50%",
          "Reter todos os componentes até atingir 100% da variância",
          "Reter os componentes antes do ponto onde a curva se achata — onde a melhora marginal torna-se pequena",
          "Reter apenas o primeiro componente sempre",
        ],
        correctIndex: 2,
        explanation:
          "O cotovelo (elbow) é o ponto de inflexão no scree plot onde a variância adicional de cada componente extra torna-se marginal. Componentes após o cotovelo capturam principalmente ruído e pouco sinal.",
      },
      {
        id: 5,
        question: "Afirmar que os componentes principais são 'ortogonais' significa que:",
        options: [
          "Cada componente explica exatamente a mesma quantidade de variância",
          "Os componentes são não-correlacionados entre si — geometricamente perpendiculares",
          "Os scores dos componentes são sempre positivos",
          "Os loadings de cada componente somam zero",
        ],
        correctIndex: 1,
        explanation:
          "Ortogonalidade significa que os PCs são perpendiculares no espaço p-dimensional e não-correlacionados estatisticamente. Isso garante que cada componente captura variação independente dos demais.",
      },
      {
        id: 6,
        question: "Dois pesquisadores analisam o mesmo conjunto de dados. Um aplica PCA na matriz de covariância, o outro na matriz de correlação (variáveis padronizadas). Os resultados serão:",
        options: [
          "Idênticos — a padronização não afeta o PCA",
          "Diferentes apenas nos autovalores, não nos autovetores",
          "Potencialmente muito diferentes — o PCA na covariância é dominado pelas variáveis de maior variância",
          "Sempre iguais se os dados têm distribuição normal multivariada",
        ],
        correctIndex: 2,
        explanation:
          "PCA na covariância privilegia variáveis com maior variância bruta. PCA na correlação (equivalente a padronizar antes) trata todas as variáveis igualmente. Em dados com escalas muito diferentes, os resultados podem ser drasticamente distintos.",
      },
      {
        id: 7,
        question: "Se PC1 explica 75% e PC2 explica 18% da variância total, qual é a variância acumulada dos dois primeiros componentes?",
        options: ["57%", "75%", "93%", "100%"],
        correctIndex: 2,
        explanation:
          "A variância acumulada é simplesmente a soma: 75% + 18% = 93%. Isso significa que a projeção nos dois primeiros PCs retém 93% da informação total dos dados originais.",
      },
      {
        id: 8,
        question: "Qual das seguintes situações representa uma LIMITAÇÃO fundamental do PCA?",
        options: [
          "O PCA não pode ser aplicado a dados com mais de 100 variáveis",
          "O PCA é linear — não consegue capturar estruturas não-lineares como espirais ou clusters curvos",
          "O PCA requer que as variáveis sejam independentes entre si",
          "O PCA só funciona quando todas as variáveis têm distribuição normal",
        ],
        correctIndex: 1,
        explanation:
          "O PCA projeta dados em combinações lineares das variáveis originais. Estruturas não-lineares (arcos, espirais, curvas em U) são mal representadas. Para esses casos, métodos como t-SNE, UMAP ou Kernel PCA são mais adequados.",
      },
      {
        id: 9,
        question: "Um pesquisador aplica PCA e observa que dois grupos (vermelho/azul) estão bem separados no gráfico de PC1 vs PC2. O que isso indica com certeza?",
        options: [
          "Que a separação entre os grupos é a maior fonte de variância nos dados",
          "Que o PCA detectou os grupos intencionalmente, pois é um método de clustering",
          "Que as duas primeiras componentes capturam variação que coincide com a separação entre grupos — mas isso pode ser casual",
          "Que os grupos são estatisticamente diferentes com p < 0,05",
        ],
        correctIndex: 2,
        explanation:
          "O PCA maximiza variância, não separa grupos. Se os grupos aparecem separados no biplot, é porque a maior fonte de variação nos dados coincide com a separação entre grupos. Isso pode ou não ser causal. O PCA é exploratório, não confirmatório.",
      },
      {
        id: 10,
        question: "O PCA é classificado como método supervisionado ou não supervisionado? Por quê?",
        options: [
          "Supervisionado — usa rótulos de classe para orientar a decomposição",
          "Não supervisionado — ignora rótulos e encontra estrutura apenas pela variância dos dados",
          "Semi-supervisionado — usa rótulos opcionalmente",
          "Depende: supervisionado se os dados têm rótulos, não supervisionado se não têm",
        ],
        correctIndex: 1,
        explanation:
          "O PCA é não supervisionado: ele decompõe a variância dos dados sem usar qualquer informação sobre rótulos, grupos ou desfechos. A decomposição é determinada apenas pela estrutura de covariância dos próprios dados.",
      },
    ],
  },
};
