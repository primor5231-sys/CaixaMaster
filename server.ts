import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System prompt for CaixaMaster AI Tutor
const CAIXA_TUTOR_SYSTEM = `Você é o "Tutor CaixaMaster", o mentor oficial e professor de elite especializado exclusivamente no concurso público da Caixa Econômica Federal (CEF) para os cargos de Técnico Bancário Novo (Geral e TI).
Sua missão:
1. Explicar com máxima clareza, entusiasmo e didática conceitos do edital da Caixa:
   - Conhecimentos Bancários (SFN, CMN, BACEN, CVM, Bancos Comerciais e Múltiplos, FGC, Taxa SELIC, Copom, Política Monetária, Depósitos, Títulos de Crédito, Pix, Open Finance)
   - Produtos e Serviços da Caixa (FGTS, Poupança, Penhor, Crédito Imobiliário / Minha Casa Minha Vida, PIS/Abono, Loterias Federais, Programas Sociais)
   - Atendimento e Ética Bancária (CDC bancário, Resolução CMN 4.949, LGPD, Sigilo Bancário LC 105, Lei Anticorrupção 12.846, Estatuto CEF)
   - Português focado na Fundação Cesgranrio (crase, regência, concordância, coesão, interpretação de texto)
   - Matemática Financeira e Noções de Estatística (juros simples/compostos, sistemas SAC e Price, taxas equivalentes/nominais/efetivas)
   - Noções de TI (bancos de dados, segurança da informação, conceitos de nuvem, metodologias ágeis)
2. Use tom encorajador, focado em aprovação ("Rumo à posse na Caixa!"), forneça mnemônicos práticos e aponte as clássicas pegadinhas das bancas Cesgranrio e Cebraspe.
3. Responda em português do Brasil, de forma estruturada, com títulos curtos, tópicos em marcadores e destaques em negrito.`;

// AI Tutor Chat Route
app.post('/api/tutor/chat', async (req, res) => {
  try {
    const { messages, context } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        reply: "O Tutor CaixaMaster está em modo local simulado. (Configure a GEMINI_API_KEY no painel de Secrets para ativar o professor com inteligência em tempo real). Dica Caixa: Lembre-se que o Conselho Monetário Nacional (CMN) é o órgão exclusivamente normativo do Sistema Financeiro Nacional, enquanto o BACEN é o executor!",
        isFallback: true
      });
    }

    const lastMessage = Array.isArray(messages) && messages.length > 0 
      ? messages[messages.length - 1].content 
      : 'Olá, Tutor CaixaMaster!';

    const prompt = context 
      ? `[Contexto do Aluno: Matéria: ${context.subject || 'Geral'}, Cargo: ${context.targetRole || 'Técnico Bancário Novo'}]\n\nDúvida do Aluno: ${lastMessage}`
      : lastMessage;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: CAIXA_TUTOR_SYSTEM,
      },
    });

    const reply = response.text || 'Não consegui processar a resposta no momento. Tente novamente!';
    res.json({ reply });
  } catch (error: any) {
    console.error('Error calling Gemini Tutor:', error);
    res.status(500).json({ 
      error: 'Erro ao consultar o Tutor CaixaMaster',
      details: error.message || 'Erro inesperado'
    });
  }
});

// Explain question route
app.post('/api/tutor/explain-question', async (req, res) => {
  try {
    const { question, userSelected, correctOption, subject } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        explanation: `💡 **Comentário do Professor CaixaMaster:**\n\nA alternativa correta é a **${correctOption}**.\n\n* **Por que essa é a resposta certa:** Essa opção está em consonância estrita com a jurisprudência e o edital da CEF para ${subject || 'Conhecimentos Bancários'}.\n* **Dica de Prova Cesgranrio:** Fique atento aos termos absolutos como "sempre", "nunca" e "exclusivamente".`,
        isFallback: true
      });
    }

    const prompt = `Analise a questão de concurso da Caixa Econômica Federal e elabore um comentário didático padrão "Professor de Cursinho de Elite":
    
Matéria: ${subject}
Enunciado: ${question.statement}
Alternativas:
${question.options.map((opt: string, i: number) => `${String.fromCharCode(65 + i)}) ${opt}`).join('\n')}

Resposta Correta: ${correctOption}
Resposta que o Aluno Marcou: ${userSelected || 'Nenhuma/Dúvida'}

Forneça:
1. 🎯 **Veredito Rápido**: Por que a alternativa ${correctOption} é o gabarito oficial.
2. ⚠️ **A Pegadinha da Banca**: Por que a opção que o aluno marcou (${userSelected}) ou as outras alternativas confundem o concurseiro.
3. 🧠 **Mnemônico ou Macete Caixa**: Uma regra prática fácil de memorizar na prova.
4. 📚 **Base Legal / Normativa**: Artigo de lei, resolução do CMN/BACEN ou conceito oficial.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: CAIXA_TUTOR_SYSTEM,
      },
    });

    res.json({ explanation: response.text });
  } catch (error: any) {
    console.error('Error generating question explanation:', error);
    res.status(500).json({
      error: 'Não foi possível gerar a explicação no momento.',
      details: error.message,
    });
  }
});

// AI Question Generator route (generate tailored exam questions on demand)
app.post('/api/tutor/generate-question', async (req, res) => {
  try {
    const { subject, topic, difficulty = 'médio' } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        fallback: true,
        message: 'Modo offline. Use as questões do banco oficial CaixaMaster.'
      });
    }

    const prompt = `Gere 1 questão inédita no estilo Fundação Cesgranrio para o concurso da Caixa Econômica Federal (CEF - Técnico Bancário).
Matéria: ${subject || 'Conhecimentos Bancários'}
Tópico: ${topic || 'Sistema Financeiro Nacional'}
Nível: ${difficulty}

Retorne estritamente um objeto JSON com o formato:
{
  "statement": "Texto do enunciado da questão...",
  "options": [
    "Alternativa A...",
    "Alternativa B...",
    "Alternativa C...",
    "Alternativa D...",
    "Alternativa E..."
  ],
  "correctIndex": 0, // índice 0 a 4
  "explanation": "Explicação completa e didática...",
  "banca": "Cesgranrio Inédita",
  "year": 2026,
  "subject": "${subject}"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: 'Você é um elaborador de questões sênior da banca Cesgranrio especializado em concursos bancários.',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating new question:', error);
    res.status(500).json({ error: 'Erro ao gerar questão inédita' });
  }
});

// Setup Vite in Dev or Static in Production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CaixaMaster PWA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
