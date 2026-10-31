import { Subject, ModulePath, Question, VideoLesson, LeaderboardUser, Flashcard } from '../types';

export const SUBJECTS: Subject[] = [
  {
    id: 'bancarios',
    name: 'Conhecimentos Bancários',
    shortName: 'Bancários (Carro-Chefe)',
    icon: '🏛️',
    color: '#004481',
    description: 'SFN, CMN, BACEN, Produtos da Caixa, Taxa SELIC, Copom, Pix e Open Finance.',
    totalQuestions: 56,
  },
  {
    id: 'portugues',
    name: 'Língua Portuguesa',
    shortName: 'Português',
    icon: '📖',
    color: '#0284C7',
    description: 'Gramática aplicada, interpretação de texto e estilo da banca Cesgranrio.',
    totalQuestions: 46,
  },
  {
    id: 'matematica',
    name: 'Matemática Financeira',
    shortName: 'Mat. Financeira',
    icon: '📊',
    color: '#F39200',
    description: 'Juros simples e compostos, taxas equivalentes, sistemas SAC e Price.',
    totalQuestions: 40,
  },
  {
    id: 'estatistica',
    name: 'Noções de Probabilidade e Estatística',
    shortName: 'Prob. & Estatística',
    icon: '📈',
    color: '#6366F1',
    description: 'Média, mediana, moda, desvio-padrão, variância e cálculo de probabilidades.',
    totalQuestions: 28,
  },
  {
    id: 'direito_adm',
    name: 'Direito Administrativo e Constitucional',
    shortName: 'Direito Adm. & Const.',
    icon: '⚖️',
    color: '#8B5CF6',
    description: 'Art. 37 CF (LIMPE), Lei das Estatais 13.303, Atos Administrativos e LRF.',
    totalQuestions: 35,
  },
  {
    id: 'ti',
    name: 'Tecnologia da Informação',
    shortName: 'TI & Digital',
    icon: '💻',
    color: '#10B981',
    description: 'Bancos de dados relacionais, segurança da informação, nuvem e Scrum.',
    totalQuestions: 42,
  },
  {
    id: 'atendimento',
    name: 'Atendimento & Produtos CEF',
    shortName: 'Atendimento & Produtos',
    icon: '🤝',
    color: '#EC4899',
    description: 'FGTS, Penhor, Poupança Caixa, Habitação Minha Casa Minha Vida e Res. CMN 4.949.',
    totalQuestions: 32,
  },
  {
    id: 'legislacao',
    name: 'Legislação, Ética & Compliance',
    shortName: 'Ética & Sigilo',
    icon: '🛡️',
    color: '#14B8A6',
    description: 'Sigilo Bancário LC 105, LGPD, Lei Anticorrupção 12.846 e Código de Conduta CEF.',
    totalQuestions: 34,
  },
];

export const QUESTION_BANK: Question[] = [
  {
    id: 'q_banc_1',
    subjectId: 'bancarios',
    topic: 'Sistema Financeiro Nacional (SFN)',
    banca: 'Cesgranrio',
    year: 2024,
    statement: 'No âmbito do Sistema Financeiro Nacional (SFN), o Conselho Monetário Nacional (CMN) desempenha papel central. Sobre as competências do CMN, assinale a afirmativa correta:',
    options: [
      'Trata-se de um órgão eminentemente normativo, responsável por fixar diretrizes e metas de inflação, sem funções executivas ou fiscalizatórias.',
      'É o órgão supervisor do mercado de capitais brasileiro, responsável direto pela punição de corretoras de valores.',
      'Possui poder de emitir papel-moeda diretamente aos correntistas e controlar individualmente as contas bancárias.',
      'É composto pelo Presidente da República, pelo Ministro da Fazenda e pelo Ministro da Justiça.',
      'Executa as operações de redesconto e fiscaliza as agências da Caixa Econômica Federal in loco.'
    ],
    correctIndex: 0,
    explanation: 'O Conselho Monetário Nacional (CMN) é o órgão colegiado MÁXIMO e EXCLUSIVAMENTE NORMATIVO do SFN. Ele não executa nem fiscaliza (quem faz isso é o BACEN e a CVM). O CMN estabelece as metas para a inflação, diretrizes gerais de crédito e normas do sistema financeiro.',
    mnemonic: 'CMN = Conselho Manda Normatizar (não coloca a mão na massa!).',
    legalBase: 'Lei nº 4.595/1964, art. 3º e 4º.'
  },
  {
    id: 'q_banc_2',
    subjectId: 'bancarios',
    topic: 'Banco Central do Brasil e Copom',
    banca: 'Cesgranrio',
    year: 2024,
    statement: 'A Taxa SELIC Meta é definida periodicamente em reuniões ordinárias pelo Comitê de Política Monetária (Copom). Quando o Copom decide ELEVAR a taxa básica de juros, o objetivo macroeconômico primordial imediato é:',
    options: [
      'Estimular o consumo das famílias e aumentar a liquidez na economia.',
      'Desacelerar a demanda agregada para conter pressões inflacionárias e convergir a inflação para a meta.',
      'Incentivar a tomada de empréstimos habitacionais de longo prazo junto à Caixa.',
      'Aumentar o valor nominal do salário mínimo e baratear o dólar artificialmente.',
      'Diminuir a rentabilidade dos títulos públicos negociados no Selic.'
    ],
    correctIndex: 1,
    explanation: 'A política monetária contracionista (alta da taxa SELIC) encarece o crédito e incentiva a poupança/investimentos em renda fixa. Isso reduz o consumo e os investimentos produtivos, desacelerando a demanda agregada e forçando a desaceleração da alta dos preços (inflação).',
    mnemonic: 'Sobe SELIC -> Sobe custo do crédito -> Cai consumo -> Cai Inflação.',
    legalBase: 'Regulamento do Copom / Resolução BCB.'
  },
  {
    id: 'q_banc_3',
    subjectId: 'bancarios',
    topic: 'Produtos Caixa - Penhor e Poupança',
    banca: 'Cesgranrio',
    year: 2024,
    statement: 'A Caixa Econômica Federal possui monopólio legal na concessão de determinada modalidade secular de crédito pessoal com garantia real. Trata-se do:',
    options: [
      'Crédito Consignado em folha de pagamento pública.',
      'Penhor Civil de joias, metais nobres, relógios e pratarias.',
      'Financiamento de veículos automotores com alienação fiduciária.',
      'Crédito Direto ao Consumidor (CDC Caixa).',
      'Microcrédito Produtivo Orientado com aval solidário.'
    ],
    correctIndex: 1,
    explanation: 'O Penhor Caixa é uma das operações mais tradicionais do banco público, com monopólio garantido por lei federal (Decreto nº 60.659/1967). O cliente empenha joias, ouro ou metais nobres e recebe o dinheiro na hora, sem avalista e com baixa taxa de inadimplência.',
    mnemonic: 'OURO na Caixa = PENHOR com exclusividade!',
    legalBase: 'Decreto-Lei nº 759/1969 e Decreto 60.659/1967.'
  },
  {
    id: 'q_dir_1',
    subjectId: 'direito_adm',
    topic: 'Princípios da Administração Pública (Art. 37 CF)',
    banca: 'Cesgranrio',
    year: 2024,
    statement: 'A Caixa Econômica Federal, na qualidade de empresa pública federal integrante da Administração Indireta, submete-se aos princípios constitucionais expressos no caput do art. 37 da Constituição Federal de 1988, sintetizados no mnemônico LIMPE. O princípio que veda a promoção pessoal de agentes públicos em publicidades oficiais é o princípio da:',
    options: [
      'Legalidade.',
      'Impessoalidade.',
      'Moralidade.',
      'Publicidade.',
      'Eficiência.'
    ],
    correctIndex: 1,
    explanation: 'O Princípio da Impessoalidade veda que a atividade administrativa seja utilizada para promoção pessoal de autoridades ou funcionários públicos (art. 37, § 1º, da CF/88). Além disso, impõe tratamento isonômico a todos os administrados e correntistas sem favoritismos ou perseguições.',
    mnemonic: 'LIMPE: Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência.',
    legalBase: 'CF/88, art. 37, caput e § 1º.'
  },
  {
    id: 'q_dir_2',
    subjectId: 'direito_adm',
    topic: 'Lei de Responsabilidade Fiscal (LC nº 101/2000)',
    banca: 'Cesgranrio',
    year: 2024,
    statement: 'A Lei de Responsabilidade Fiscal (LRF - Lei Complementar nº 101/2000) estabelece normas de finanças públicas voltadas para a responsabilidade na gestão fiscal. Acerca das vedações expressas impostas pela LRF às instituições financeiras controladas pelo Poder Público (como a Caixa Econômica Federal), assinale a correta:',
    options: [
      'É permitido à Caixa conceder empréstimos ilimitados ao seu ente controlador (a União) para cobrir despesas correntes de pessoal.',
      'É terminantemente vedado à instituição financeira estatal realizar operação de crédito com o seu respectivo ente controlador.',
      'A Caixa pode adquirir diretamente títulos da dívida pública da União na data de emissão primária sem qualquer restrição.',
      'A LRF não se aplica às empresas públicas do setor financeiro, restringindo-se aos órgãos da administração direta.',
      'A Caixa pode financiar campanhas eleitorais municipais com juros subsidiados pelo Tesouro Nacional.'
    ],
    correctIndex: 1,
    explanation: 'O art. 36 da LRF proíbe expressamente a operação de crédito entre instituição financeira estatal e o ente da Federação que a controle (no caso da Caixa, a União). Essa regra evita que o Tesouro utilize os bancos públicos para financiar seus déficits orçamentários sem controle legislativo ("pedaladas fiscais").',
    mnemonic: 'LRF art. 36: Banco público NÃO empresta dinheiro para seu dono (ente controlador)!',
    legalBase: 'LC nº 101/2000, art. 36.'
  },
  {
    id: 'q_estat_1',
    subjectId: 'estatistica',
    topic: 'Medidas de Tendência Central e Dispersão',
    banca: 'Cesgranrio',
    year: 2024,
    statement: 'Em uma agência da Caixa Econômica Federal, o número de contratos de financiamento habitacional assinados em 5 dias úteis consecutivos foi: 4, 7, 7, 10 e 12. A média aritmética e a moda desse conjunto de dados são, respectivamente:',
    options: [
      '8 e 7',
      '7 e 8',
      '8 e 10',
      '7,5 e 7',
      '9 e 12'
    ],
    correctIndex: 0,
    explanation: 'Média aritmética = (4 + 7 + 7 + 10 + 12) / 5 = 40 / 5 = 8. Moda é o valor que aparece com maior frequência no conjunto: o número 7 aparece 2 vezes (os outros aparecem 1 vez). Logo, média = 8 e moda = 7.',
    mnemonic: 'Moda = O que mais se repete (está "na moda"). Média = Soma tudo e divide pela quantidade.',
    legalBase: 'Estatística Descritiva Básica.'
  },
  {
    id: 'q_estat_2',
    subjectId: 'estatistica',
    topic: 'Cálculo de Probabilidade Clássica',
    banca: 'Cesgranrio',
    year: 2024,
    statement: 'Em uma urna da Caixa Loterias há 20 bolas numeradas de 1 a 20. Se uma bola for sorteada aleatoriamente, qual é a probabilidade de o número sorteado ser um múltiplo de 4 OU um número primo?',
    options: [
      '60% (12/20)',
      '65% (13/20)',
      '50% (10/20)',
      '70% (14/20)',
      '55% (11/20)'
    ],
    correctIndex: 1,
    explanation: 'Múltiplos de 4 entre 1 e 20: {4, 8, 12, 16, 20} -> 5 elementos. Números primos entre 1 e 20: {2, 3, 5, 7, 11, 13, 17, 19} -> 8 elementos. Note que nenhum múltiplo de 4 é primo (interseção é vazia!). P(A U B) = P(A) + P(B) = 5/20 + 8/20 = 13/20 = 65%.',
    mnemonic: 'P(A ou B) = P(A) + P(B) - Interseção. Sem elementos repetidos, apenas soma!',
    legalBase: 'Teoria das Probabilidades.'
  },
  {
    id: 'q_banc_4',
    subjectId: 'bancarios',
    topic: 'Fundo Garantidor de Créditos (FGC)',
    banca: 'Cesgranrio',
    year: 2023,
    statement: 'Em relação ao Fundo Garantidor de Créditos (FGC), mecanismo que confere estabilidade e segurança ao sistema bancário, é correto afirmar:',
    options: [
      'Garante aplicações financeiras ilimitadas independentemente da titularidade ou CPF.',
      'Cobre até R$ 250.000,00 por CPF/CNPJ por instituição ou conglomerado, limitado ao teto global de R$ 1.000.000,00 a cada 4 anos.',
      'É um órgão público federal financiado exclusivamente pelo Orçamento Geral da União.',
      'Cobre aplicações em ações na Bolsa de Valores (B3) e fundos de investimento imobiliário.',
      'Não cobre depósitos em Caderneta de Poupança da Caixa, apenas depósitos a prazo (CDB).'
    ],
    correctIndex: 1,
    explanation: 'O FGC é uma associação civil privada mantida pelas instituições associadas. Garante depósitos à vista, a prazo (CDB/RDB), poupança, LCI e LCA até o limite de R$ 250 mil por CPF/instituição, com o teto periódico de R$ 1 milhão a cada 4 anos.',
    mnemonic: 'FGC = 250k por banco / 1 Milhão por quadriênio.',
    legalBase: 'Estatuto do FGC e Resolução CMN 4.222/2013.'
  },
  {
    id: 'q_port_1',
    subjectId: 'portugues',
    topic: 'Emprego do Sinal Indicativo de Crase',
    banca: 'Cesgranrio',
    year: 2024,
    statement: 'O acento grave indicativo de crase está empregado em conformidade com o padrão culto da língua portuguesa na frase:',
    options: [
      'O gerente da agência dirigiu-se à ela com extrema cordialidade durante o atendimento.',
      'O novo funcionário da Caixa começou à trabalhar pontualmente às oito horas da manhã.',
      'Os relatórios trimestrais foram encaminhados à diretoria executiva para validação.',
      'O empréstimo habitacional atende à todas as famílias inscritas no programa social.',
      'O cliente prefere pagar à prazo do que à vista nas compras de materiais.'
    ],
    correctIndex: 2,
    explanation: 'Em "encaminhados à diretoria": o verbo encaminhar exige a preposição "a" e o substantivo "diretoria" aceita o artigo feminino "a" (a + a = à). Não ocorre crase antes de pronome pessoal ("ela"), antes de verbo ("trabalhar"), antes de pronome indefinido ("todas") ou antes de palavra masculina ("prazo").',
    mnemonic: 'Antes de mulher acentua, antes de verbo e pronome a crase recua!',
    legalBase: 'Manual de Redação Cesgranrio.'
  },
  {
    id: 'q_mat_1',
    subjectId: 'matematica',
    topic: 'Juros Compostos e Equivalência',
    banca: 'Cesgranrio',
    year: 2024,
    statement: 'Um correntista aplicou R$ 10.000,00 em um Certificado de Depósito Bancário (CDB) da Caixa a uma taxa de juros compostos de 2% ao mês. Ao término de 2 meses, o montante total resgatado pelo aplicador (sem considerar impostos) será de:',
    options: [
      'R$ 10.400,00',
      'R$ 10.404,00',
      'R$ 10.200,00',
      'R$ 10.612,08',
      'R$ 10.500,00'
    ],
    correctIndex: 1,
    explanation: 'Fórmula do montante em juros compostos: M = C * (1 + i)^t. M = 10.000 * (1 + 0,02)^2 = 10.000 * 1,0404 = R$ 10.404,00. A pegadinha é somar 2% + 2% = 4% (juros simples de 10.400), ignorando os "juros sobre juros" dos R$ 4,00.',
    mnemonic: 'Juros Compostos = Juros sobre Juros! 1,02 x 1,02 = 1,0404.',
    legalBase: 'Matemática Financeira Básica.'
  },
  {
    id: 'q_mat_2',
    subjectId: 'matematica',
    topic: 'Sistemas de Amortização (SAC vs Price)',
    banca: 'Cesgranrio',
    year: 2024,
    statement: 'No financiamento habitacional da Caixa, o Sistema de Amortização Constante (SAC) possui como característica fundamental distintiva em relação à Tabela Price:',
    options: [
      'Prestações periódicas fixas e iguais do primeiro ao último mês.',
      'Parcelas de amortização constantes, com prestações decrescentes ao longo do prazo do contrato.',
      'Juros crescentes em todas as parcelas devido à capitalização composta.',
      'Ausência de amortização inicial, quitando-se todo o saldo devedor na última parcela.',
      'Prestações iniciais menores do que as parcelas finais do financiamento.'
    ],
    correctIndex: 1,
    explanation: 'No SAC, a AMORTIZAÇÃO é sempre constante. Como o saldo devedor vai diminuindo a cada pagamento, os juros da parcela diminuem e a PRESTAÇÃO é DECRESCENTE. Já na Tabela Price, as prestações são constantes.',
    mnemonic: 'SAC = Amortização Fixa / Prestação Cai (Decrescente). Price = Prestação Fixa / Amortização Sobe.',
    legalBase: 'Resoluções SFH e Manuais Habitacionais CEF.'
  },
  {
    id: 'q_ti_1',
    subjectId: 'ti',
    topic: 'Segurança da Informação e Criptografia',
    banca: 'Cesgranrio',
    year: 2024,
    statement: 'No contexto da segurança em canais de atendimento digital da Caixa (Internet Banking e App Caixa Tem), o protocolo HTTPS emprega criptografia para garantir a comunicação segura. Sobre os conceitos de chave pública e chave privada (criptografia assimétrica), assinale a correta:',
    options: [
      'A mesma chave é usada para cifrar e decifrar os dados confidenciais do correntista.',
      'A chave pública é compartilhada livremente para cifrar dados, enquanto apenas o detentor da chave privada correspondente consegue decifrá-los.',
      'As chaves privadas são expostas publicamente no certificado SSL da agência bancária.',
      'O protocolo HTTPS não usa criptografia assimétrica, apenas hash MD5 sem chaves.',
      'A chave pública só pode ser utilizada se o usuário estiver fisicamente presente na agência.'
    ],
    correctIndex: 1,
    explanation: 'Na criptografia assimétrica, a chave pública pode ser amplamente distribuída para qualquer um cifrar uma mensagem; já a chave privada é mantida sob segredo absoluto pelo destinatário para poder decifrar o conteúdo.',
    mnemonic: 'Pública tranca o cofre (qualquer um fecha). Privada tem o segredo e abre.',
    legalBase: 'Padrão PKI / ICP-Brasil.'
  }
];

export const MODULE_PATHS: ModulePath[] = [
  {
    id: 'mod_1',
    subjectId: 'bancarios',
    title: 'Módulo 1: O Coração do Edital Caixa',
    description: 'Sistema Financeiro Nacional, CMN, BACEN e o Papel Estratégico da Caixa',
    lessons: [
      {
        id: 'mod1_lesson1',
        subjectId: 'bancarios',
        moduleIndex: 0,
        nodeIndex: 0,
        title: 'SFN: Órgãos Normativos vs Executivos',
        subtitle: 'A distinção definitiva entre CMN e BACEN que despenca na prova da Cesgranrio',
        icon: '🏛️',
        xpReward: 30,
        coinsReward: 15,
        slides: [
          {
            title: 'A Estrutura Piramidal do SFN',
            content: 'O Sistema Financeiro Nacional é dividido em três níveis essenciais:\n\n1. **Órgãos Normativos**: Fixam regras gerais (CMN, CNSP, CNPC).\n2. **Órgãos Supervisores**: Fiscalizam e punem (BACEN, CVM, SUSEP, PREVIC).\n3. **Operadores**: Quem negocia diretamente com você e as empresas (Caixa, bancos, corretoras, cooperativas).',
            highlightBox: '🚨 Pegadinha clássica da Cesgranrio: dizer que o CMN fiscaliza bancos. O CMN NÃO fiscaliza nem executa! Ele apenas dita normas gerais.'
          },
          {
            title: 'Conselho Monetário Nacional (CMN)',
            content: 'O CMN é composto por apenas 3 membros:\n\n* **Ministro da Fazenda** (Presidente do Conselho)\n* **Ministro do Planejamento e Orçamento**\n* **Presidente do Banco Central do Brasil**\n\nPrincipais metas: estabelecer a Meta de Inflação e zelar pela liquidez e solvência do sistema.',
            mnemonic: '🧠 Macete: Ministro da Fazenda + Ministra do Planejamento + Presidente do BACEN. Trio de ouro do CMN!'
          },
          {
            title: 'Banco Central do Brasil (BACEN)',
            content: 'Autarquia de natureza especial com **autonomia legal** (Lei Complementar nº 179/2021).\n\n* O BACEN **não é subordinado** a nenhum ministério (apenas vinculado).\n* Mandatos do presidente e diretores têm duração de 4 anos e são não coincidentes com o mandato do Presidente da República para evitar interferências políticas de curto prazo.',
            mnemonic: '⚡ Lembre-se: BACEN Executa e Fiscaliza. Tem poder de punir e intervir em bancos em crise.'
          }
        ],
        quizQuestions: [
          QUESTION_BANK[0]
        ]
      },
      {
        id: 'mod1_lesson2',
        subjectId: 'bancarios',
        moduleIndex: 0,
        nodeIndex: 1,
        title: 'Taxa SELIC e Política Monetária',
        subtitle: 'Como o Copom mexe nos juros e o que isso afeta a poupança Caixa',
        icon: '📈',
        xpReward: 35,
        coinsReward: 15,
        slides: [
          {
            title: 'O Copom e a Selic Meta',
            content: 'O Comitê de Política Monetária (Copom) do BACEN se reúne a cada 45 dias para calibrar a taxa básica de juros da economia brasileira.\n\n* **Selic Meta**: Alvo fixado pelo Copom.\n* **Selic Over**: Taxa efetiva média apurada nas operações interbancárias lastreadas em títulos públicos.',
            highlightBox: 'Quando a inflação sobe, o Copom sobe a Selic para desaquecer a economia e controlar os preços.'
          },
          {
            title: 'Regra de Ouro da Poupança Caixa',
            content: 'A remuneração da Caderneta de Poupança da Caixa tem duas regras fundamentais:\n\n1. **Se a Selic for maior que 8,5% ao ano**: Rentabilidade de 0,5% ao mês + TR (Taxa Referencial).\n2. **Se a Selic for menor ou igual a 8,5% ao ano**: Rentabilidade de 70% da Selic + TR.\n\nAlém disso, é isenta de Imposto de Renda para pessoa física!',
            mnemonic: '💡 8,5% é o divisor de águas! Acima de 8,5% = Meio por cento + TR. Até 8,5% = 70% da Selic + TR.'
          }
        ],
        quizQuestions: [
          QUESTION_BANK[1]
        ]
      },
      {
        id: 'mod1_lesson3',
        subjectId: 'atendimento',
        moduleIndex: 0,
        nodeIndex: 2,
        title: 'Penhor e Produtos Exclusivos da CEF',
        subtitle: 'Tradição secular: a garantia do ouro e os programas sociais do Brasil',
        icon: '🪙',
        xpReward: 40,
        coinsReward: 20,
        slides: [
          {
            title: 'O Penhor Caixa',
            content: 'Criado no Império, o Penhor da Caixa é uma linha de crédito onde joias de ouro, canetas de grife, relógios de valor e pratarias ficam custodiados nos cofres blindados do banco.\n\n* **Sem análise de crédito no SPC/Serasa**\n* **Dinheiro liberado na hora**\n* **Monopólio federal da Caixa** (nenhum outro banco privado pode operar penhor civil de joias no país).',
            highlightBox: 'Se o concurseiro vir na prova uma questão sobre concessão de crédito com custódia de joias pelo banco público, a resposta é PENHOR CAIXA.'
          },
          {
            title: 'Caixa como Braço Social do Estado',
            content: 'A Caixa opera programas vitais:\n\n* **FGTS**: Gestão operacional das contas de todos os trabalhadores do Brasil.\n* **Loterias Federais**: Quase 50% da arrecadação das apostas é destinada a repasses sociais (educação, esporte, segurança pública e seguridade).\n* **Minha Casa Minha Vida**: Maior carteira de crédito habitacional da América Latina.',
            mnemonic: 'CEF = Caixa Econômica Federal = O Banco de todos os brasileiros.'
          }
        ],
        quizQuestions: [
          QUESTION_BANK[2]
        ]
      },
      {
        id: 'mod1_lesson4',
        subjectId: 'matematica',
        moduleIndex: 0,
        nodeIndex: 3,
        title: 'Sistemas de Amortização: SAC vs Price',
        subtitle: 'Decifrando a matemática do crédito imobiliário Caixa',
        icon: '🧮',
        xpReward: 40,
        coinsReward: 20,
        slides: [
          {
            title: 'Sistema de Amortização Constante (SAC)',
            content: 'No SAC, o valor que você abate da dívida todo mês é rigorosamente fixo.\n\n* Amortização = Constante\n* Juros = Decrescentes (pois incidem sobre o saldo devedor que diminui)\n* Prestação = DECRESCENTE (começa alta e termina bem baixa)',
            highlightBox: 'É o sistema mais utilizado nos financiamentos habitacionais de longo prazo da Caixa.'
          },
          {
            title: 'Tabela Price (Sistema Francês)',
            content: 'Na Tabela Price, o valor da PRESTAÇÃO que você paga no boleto todo mês é RIGOROSAMENTE IGUAL.\n\n* Prestação = Constante\n* Juros = Decrescentes\n* Amortização = CRESCENTE (no começo quase não abate dívida, só paga juros).',
            mnemonic: 'SAC = Amortização é Fixa / Price = Prestação é Fixa!'
          }
        ],
        quizQuestions: [
          QUESTION_BANK[10]
        ]
      },
      {
        id: 'mod1_lesson5',
        subjectId: 'direito_adm',
        moduleIndex: 0,
        nodeIndex: 4,
        title: 'Princípios da Adm. Pública e LRF na Caixa',
        subtitle: 'LIMPE (Art. 37 CF) e a Lei de Responsabilidade Fiscal para Bancos Estatais',
        icon: '⚖️',
        xpReward: 45,
        coinsReward: 25,
        slides: [
          {
            title: 'O Mnemônico LIMPE (Art. 37 CF)',
            content: 'Todo técnico bancário da Caixa age sob 5 mandamentos constitucionais:\n\n* **L**egalidade: Fazer somente o que a lei permite.\n* **I**mpessoalidade: Sem favoritismo ou autopromoção.\n* **M**oralidade: Ética, probidade e lealdade institucional.\n* **P**ublicidade: Transparência dos atos e contratos.\n* **E**ficiência: Produtividade com qualidade e economicidade.',
            highlightBox: 'Na Caixa, a admissão de novos empregados ocorre obrigatoriamente por Concurso Público de provas ou títulos (art. 37, II, CF).'
          },
          {
            title: 'A Lei de Responsabilidade Fiscal (LRF)',
            content: 'A LRF (LC 101/2000) impõe prudência fiscal rigorosa:\n\n* **Art. 36**: A Caixa é proibida de emprestar dinheiro ou financiar o seu ente controlador (a União) para pagar despesas correntes.\n* Essa proibição protege os recursos dos poupadores e impede o desvirtuamento do banco público.',
            mnemonic: 'LRF Art. 36 = Banco estatal NUNCA financia seu dono!'
          }
        ],
        quizQuestions: [
          QUESTION_BANK[3]
        ]
      }
    ]
  }
];

export const FLASHCARDS: Flashcard[] = [
  {
    id: 'fc_1',
    subjectId: 'bancarios',
    title: 'Composição do CMN',
    concept: '3 Membros Apenas: Ministro da Fazenda (Presidente), Ministro do Planejamento e Presidente do BACEN.',
    mnemonic: 'Fazenda + Planejamento + BACEN = Trio Normativo do CMN.',
    details: 'Não possui secretários nem ministros extras. É estritamente normativo!'
  },
  {
    id: 'fc_2',
    subjectId: 'bancarios',
    title: 'Regra da Poupança Caixa',
    concept: 'Selic > 8,5% ao ano = 0,5% a.m. + TR. Selic <= 8,5% ao ano = 70% da Selic + TR.',
    mnemonic: '8,5% é o divisor de águas!',
    details: 'Pessoa física é isenta de Imposto de Renda!'
  },
  {
    id: 'fc_3',
    subjectId: 'bancarios',
    title: 'Garantia do FGC',
    concept: 'Até R$ 250.000 por CPF e por instituição, com teto de R$ 1 milhão a cada 4 anos.',
    mnemonic: '250 mil por banco / 1 milhão por 4 anos.',
    details: 'Cobre poupança, conta corrente, CDB, LCI e LCA.'
  },
  {
    id: 'fc_4',
    subjectId: 'matematica',
    title: 'SAC vs Price',
    concept: 'SAC: Amortização constante, Prestação decrescente. Price: Prestação constante, Amortização crescente.',
    mnemonic: 'SAC tem A fixo / Price tem P fixo!',
    details: 'No SAC você paga menos juros totais ao final do contrato.'
  },
  {
    id: 'fc_5',
    subjectId: 'direito_adm',
    title: 'Princípios LIMPE (Art. 37 CF)',
    concept: 'Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência.',
    mnemonic: 'LIMPE!',
    details: 'Impessoalidade proíbe colocar foto de autoridade em propaganda da Caixa.'
  },
  {
    id: 'fc_6',
    subjectId: 'direito_adm',
    title: 'LRF Artigo 36',
    concept: 'Vedada a operação de crédito entre a instituição financeira estatal e o ente que a controla.',
    mnemonic: 'Banco público não financia o patrão!',
    details: 'Impede pedaladas fiscais e uso indevido do banco público.'
  },
  {
    id: 'fc_7',
    subjectId: 'atendimento',
    title: 'Monopólio do Penhor Caixa',
    concept: 'Apenas a Caixa Econômica Federal pode realizar o penhor civil de joias, canetas e relógios.',
    mnemonic: 'Ouro no cofre = Só na Caixa!',
    details: 'Crédito imediato sem consulta a órgãos de restrição cadastral.'
  }
];

export const CURATED_VIDEOS: VideoLesson[] = [
  {
    id: 'vid_1',
    subjectId: 'bancarios',
    title: 'Conhecimentos Bancários para a Caixa - Sistema Financeiro Nacional',
    instructor: 'Prof. Amanda Costa',
    channel: 'Estratégia Concursos',
    duration: '28 min',
    youtubeId: '0Uj3EaZ4X7M',
    topic: 'SFN, CMN e BACEN'
  },
  {
    id: 'vid_2',
    subjectId: 'matematica',
    title: 'Matemática Financeira Descomplicada - SAC vs Tabela Price',
    instructor: 'Prof. Marcelo Rocha',
    channel: 'Gran Concursos',
    duration: '22 min',
    youtubeId: 'tgbNymZ7vqY',
    topic: 'Sistemas de Amortização'
  },
  {
    id: 'vid_3',
    subjectId: 'direito_adm',
    title: 'Direito Administrativo e Lei das Estatais para a Caixa',
    instructor: 'Prof. Herbert Almeida',
    channel: 'Estratégia Concursos',
    duration: '31 min',
    youtubeId: 'dQw4w9WgXcQ',
    topic: 'Art. 37 CF e Lei 13.303'
  },
  {
    id: 'vid_4',
    subjectId: 'estatistica',
    title: 'Probabilidade e Estatística Básica para Concursos Cesgranrio',
    instructor: 'Prof. Josimar Padilha',
    channel: 'Direção Concursos',
    duration: '26 min',
    youtubeId: 'tgbNymZ7vqY',
    topic: 'Médias e Probabilidade'
  },
  {
    id: 'vid_5',
    subjectId: 'portugues',
    title: 'Português Cesgranrio: As 5 Pegadinhas que mais reprovam',
    instructor: 'Profa. Denise Ferreira',
    channel: 'Direção Concursos',
    duration: '34 min',
    youtubeId: 'dQw4w9WgXcQ',
    topic: 'Crase e Regência Cesgranrio'
  },
  {
    id: 'vid_6',
    subjectId: 'atendimento',
    title: 'FGTS e Produtos da Caixa - Tudo o que o edital exige',
    instructor: 'Prof. Lucas Ribeiro',
    channel: 'AlfaCon',
    duration: '25 min',
    youtubeId: 'eVTXPUF4Oz4',
    topic: 'Produtos Exclusivos CEF'
  }
];

export const LEADERBOARD_USERS: LeaderboardUser[] = [
  { id: 'usr_1', name: 'Larissa Albuquerque', avatar: '👩‍💼', targetRole: 'Técnico Bancário - Geral', xp: 980, streak: 14 },
  { id: 'usr_2', name: 'Rodrigo S. Mendes', avatar: '👨‍💻', targetRole: 'Técnico Bancário - TI', xp: 870, streak: 12 },
  { id: 'usr_3', name: 'Beatriz Fontes', avatar: '👩‍🎓', targetRole: 'Técnico Bancário - Geral', xp: 740, streak: 9 },
  { id: 'usr_4', name: 'Concurseiro Caixa (Você)', avatar: '⭐', targetRole: 'Técnico Bancário - Geral', xp: 320, streak: 5, isCurrentUser: true },
  { id: 'usr_5', name: 'Thiago Nogueira', avatar: '👨‍💼', targetRole: 'Técnico Bancário - TI', xp: 310, streak: 4 },
  { id: 'usr_6', name: 'Camila Morais', avatar: '👩‍💼', targetRole: 'Técnico Bancário - Geral', xp: 280, streak: 3 },
  { id: 'usr_7', name: 'Gabriel Pires', avatar: '👨‍🎓', targetRole: 'Técnico Bancário - TI', xp: 250, streak: 2 },
  { id: 'usr_8', name: 'Mariana Duarte', avatar: '👩‍💼', targetRole: 'Técnico Bancário - Geral', xp: 190, streak: 2 },
  { id: 'usr_9', name: 'Felipe Santana', avatar: '👨‍💻', targetRole: 'Técnico Bancário - TI', xp: 140, streak: 1 },
  { id: 'usr_10', name: 'Aline Rezende', avatar: '👩‍🎓', targetRole: 'Técnico Bancário - Geral', xp: 90, streak: 1 }
];

export const ACHIEVEMENTS = [
  { id: 'first_step', title: 'Primeiro Passo', desc: 'Completou a 1ª micro-aula da Caixa', icon: '🚀', xp: 50, unlocked: true },
  { id: 'streak_3', title: 'Hábito de Posse', desc: 'Manteve 3 dias seguidos de ofensiva', icon: '🔥', xp: 100, unlocked: true },
  { id: 'bacen_master', title: 'Mestre do BACEN', desc: 'Acertou 5 questões de SFN sem errar', icon: '🏛️', xp: 150, unlocked: true },
  { id: 'limpe_pro', title: 'Guardião do Artigo 37', desc: 'Gabaritou questões de Direito Adm.', icon: '⚖️', xp: 150, unlocked: true },
  { id: 'cesgranrio_slayer', title: 'Domador da Cesgranrio', desc: 'Finalizou um simulado no Modo Foco', icon: '🎯', xp: 200, unlocked: false },
  { id: 'streak_7', title: 'Semana 100% Caixa', desc: 'Estudou os 7 dias da semana seguidos', icon: '👑', xp: 300, unlocked: false },
  { id: 'pwa_pro', title: 'Bancário Conectado', desc: 'Instalou o CaixaMaster PWA no dispositivo', icon: '📱', xp: 100, unlocked: true }
];
