import html2pdf from 'html2pdf.js';

// --- DATA: MATRIZ DE PERGUNTAS E PONTUAÇÃO ---
const QUIZ_DATA = [
  // BLOCO 1: Perfil do Imóvel
  {
    id: 'q1', block: 1, title: 'Qual é o tipo do seu imóvel?', category: 'contexto',
    options: [
      { text: 'Casa térrea com quintal ou jardim', points: 10, urgency: '30d', actions: ['Atenção a quintais, ralos externos, entulho e muros.'], rooms: ['quintal', 'garagem'] },
      { text: 'Casa térrea sem quintal (cimentada)', points: 7, urgency: '30d', actions: ['Mesmo sem quintal, ralos, frestas e garagens precisam de foco.'], rooms: ['garagem'] },
      { text: 'Sobrado', points: 8, urgency: '30d', actions: ['Avalie área térrea, além de ralos e tubulações nos andares superiores.'], rooms: ['garagem'] },
      { text: 'Apartamento térreo', points: 8, urgency: '30d', actions: ['Cuidado com áreas comuns, ralos, jardins próximos e caixas de passagem.'], rooms: ['quintal'] },
      { text: 'Apartamento em andar superior', points: 4, urgency: '30d', actions: ['O foco principal deve ser ralos, pias, tanques e áreas úmidas internas.'], rooms: [] }
    ]
  },
  {
    id: 'q2', block: 1, title: 'Existem terrenos baldios, obras, mato alto ou lixo acumulado próximos?', category: 'externo',
    options: [
      { text: 'Sim, muito próximo ao imóvel', points: 15, urgency: '7d', actions: ['Reforce a limpeza da divisa, mantenha muros livres de entulho e solicite limpeza de terrenos vizinhos.'], rooms: ['quintal', 'garagem'] },
      { text: 'Sim, mas não é colado ao imóvel', points: 8, urgency: '30d', actions: ['Monitore áreas externas após chuvas ou limpeza de terrenos.'], rooms: ['quintal'] },
      { text: 'Não existe esse tipo de situação próxima', points: 0, urgency: '', actions: [], rooms: [] },
      { text: 'Não sei avaliar', points: 5, urgency: '30d', actions: ['Faça uma inspeção visual no entorno do imóvel e lotes vizinhos.'], rooms: ['quintal'] }
    ]
  },
  
  // BLOCO 2: Pontos de Entrada
  {
    id: 'q3', block: 2, title: 'Como estão os ralos do BANHEIRO?', category: 'entrada',
    options: [
      { text: 'Abertos ou sem nenhuma proteção', points: 20, urgency: '24h', actions: ['Banheiro: Instale tela fina ou grelha abre-fecha nos ralos IMEDIATAMENTE.'], rooms: ['banheiro'], redFlag: true },
      { text: 'Tampa comum furadinha', points: 12, urgency: '7d', actions: ['Banheiro: A tampa comum não segura filhotes. Prefira tela fina ou abre-fecha.'], rooms: ['banheiro'] },
      { text: 'Tela fina ou ralo abre-fecha', points: 0, urgency: '', actions: [], rooms: [] }
    ]
  },
  {
    id: 'q4', block: 2, title: 'Como estão os ralos da COZINHA e área da pia?', category: 'entrada',
    options: [
      { text: 'Abertos ou sem proteção', points: 18, urgency: '24h', actions: ['Cozinha: Proteja ralos e evite restos de alimentos ou umidade no chão.'], rooms: ['cozinha'], redFlag: true },
      { text: 'Tampa comum furadinha', points: 10, urgency: '7d', actions: ['Cozinha: Substitua tampas simples por tela fina para evitar acesso pela tubulação.'], rooms: ['cozinha'] },
      { text: 'Protegidos (Abre-fecha ou tela fina)', points: 0, urgency: '', actions: [], rooms: [] }
    ]
  },
  {
    id: 'q5', block: 2, title: 'Como estão os ralos da LAVANDERIA ou área de serviço?', category: 'entrada',
    options: [
      { text: 'Abertos ou sem proteção', points: 18, urgency: '24h', actions: ['Lavanderia: Coloque proteção urgente. É a área úmida mais crítica ligada à tubulação externa.'], rooms: ['lavanderia'], redFlag: true },
      { text: 'Tampa comum', points: 10, urgency: '7d', actions: ['Lavanderia: Reforce com tela fina, principalmente se for próxima de garagem/quintal.'], rooms: ['lavanderia'] },
      { text: 'Protegidos ou Não se aplica', points: 0, urgency: '', actions: [], rooms: [] }
    ]
  },
  {
    id: 'q6', block: 2, title: 'Existem frestas em portas externas, janelas, soleiras ou portões?', category: 'entrada',
    options: [
      { text: 'Sim, frestas grandes (passa insetos soltos)', points: 18, urgency: '24h', actions: ['Portas: Instale rodo de vedação (tipo cobrinha) nas portas externas urgentemente.'], rooms: ['sala', 'garagem'] },
      { text: 'Sim, frestas pequenas', points: 10, urgency: '7d', actions: ['Frestas: Vede soleiras e vãos com borracha ou silicone.'], rooms: ['sala'] },
      { text: 'Não vejo frestas aparentes', points: 0, urgency: '', actions: [], rooms: [] }
    ]
  },
  {
    id: 'q7', block: 2, title: 'Existem rachaduras, rodapés soltos, caixas de fiação ou inspeção abertas?', category: 'entrada',
    options: [
      { text: 'Sim, vários pontos ou caixas abertas', points: 15, urgency: '7d', actions: ['Estrutura: Corrija rodapés soltos e mantenha caixas de fiação/inspeção totalmente vedadas.'], rooms: ['sala', 'quartos', 'garagem'] },
      { text: 'Sim, poucos pontos', points: 8, urgency: '30d', actions: ['Estrutura: Repare rachaduras ou vãos atrás de móveis e rodapés.'], rooms: ['sala'] },
      { text: 'Nenhum ponto aparente', points: 0, urgency: '', actions: [], rooms: [] }
    ]
  },

  // BLOCO 3: Abrigo e Umidade
  {
    id: 'q8', block: 3, title: 'Você vê baratas ou outros insetos com frequência?', category: 'ecologico',
    options: [
      { text: 'Frequentemente', points: 20, urgency: '24h', actions: ['Controle de Pragas: Barata é o principal alimento do escorpião. Providencie dedetização e reduza o lixo.'], rooms: ['cozinha', 'banheiro', 'lavanderia'], redFlag: true },
      { text: 'Às vezes', points: 12, urgency: '7d', actions: ['Limpeza: Reforce a limpeza noturna, vede lixeiras e monitore ralos para evitar insetos.'], rooms: ['cozinha'] },
      { text: 'Raramente ou Nunca vejo', points: 0, urgency: '', actions: [], rooms: [] }
    ]
  },
  {
    id: 'q9', block: 3, title: 'O lixo doméstico fica aberto ou acumulado por muito tempo?', category: 'ecologico',
    options: [
      { text: 'Sim, fica aberto/acumula', points: 14, urgency: '7d', actions: ['Lixo: Use lixeiras com tampa e retire lixo com frequência. Não deixe resíduos expostos à noite.'], rooms: ['cozinha', 'quintal'] },
      { text: 'Fica fechado, mas às vezes acumula', points: 7, urgency: '30d', actions: ['Lixo: Tente reduzir o tempo de armazenamento do lixo perto da casa.'], rooms: ['cozinha'] },
      { text: 'Não, sempre fechado e retirado', points: 0, urgency: '', actions: [], rooms: [] }
    ]
  },
  {
    id: 'q10', block: 3, title: 'Há acúmulo de entulho, madeira, telhas ou materiais de construção?', category: 'ecologico',
    options: [
      { text: 'Sim, bastante material acumulado', points: 20, urgency: '24h', actions: ['Entulho: Remova imediatamente restos de obras, madeira e telhas. É o principal esconderijo.'], rooms: ['quintal', 'garagem'], redFlag: true },
      { text: 'Sim, pouco material', points: 10, urgency: '7d', actions: ['Entulho: Organize e eleve materiais do chão para evitar umidade por baixo.'], rooms: ['quintal'] },
      { text: 'Não há / Não se aplica', points: 0, urgency: '', actions: [], rooms: [] }
    ]
  },
  {
    id: 'q11', block: 3, title: 'Existem áreas que ficam úmidas ou molhadas com frequência (ex: poças)?', category: 'ecologico',
    options: [
      { text: 'Banheiro, cozinha ou lavanderia internos', points: 12, urgency: '7d', actions: ['Umidade: Corrija vazamentos e mantenha pias e chãos secos (o escorpião busca hidratação).'], rooms: ['banheiro', 'cozinha', 'lavanderia'] },
      { text: 'Quintal ou garagem ficam úmidos', points: 10, urgency: '7d', actions: ['Umidade: Melhore o escoamento externo para evitar água empoçada.'], rooms: ['quintal', 'garagem'] },
      { text: 'Não há áreas úmidas frequentes', points: 0, urgency: '', actions: [], rooms: [] }
    ]
  },

  // BLOCO 4: Exposição Humana
  {
    id: 'q12', block: 4, title: 'Você costuma examinar sapatos, toalhas e roupas antes de usar?', category: 'humano',
    options: [
      { text: 'Nunca', points: 12, urgency: '24h', actions: ['Rotina: Crie o hábito imediato de bater sapatos e sacudir roupas e toalhas antes de vesti-las.'], rooms: ['quartos', 'banheiro'] },
      { text: 'Às vezes', points: 6, urgency: '7d', actions: ['Rotina: Torne a inspeção de roupas/sapatos um hábito diário para todos os moradores.'], rooms: ['quartos'] },
      { text: 'Sempre', points: 0, urgency: '', actions: [], rooms: [] }
    ]
  },
  {
    id: 'q13', block: 4, title: 'Camas, berços ou mosquiteiros ficam encostados na parede ou chão?', category: 'humano',
    options: [
      { text: 'Sim, camas encostadas E roupas tocam o chão', points: 14, urgency: '24h', actions: ['Quartos: Afaste as camas da parede em pelo menos 10cm e nunca deixe lençol/mosquiteiro tocar o chão.'], rooms: ['quartos'] },
      { text: 'Apenas encostadas NA PAREDE', points: 8, urgency: '7d', actions: ['Quartos: Afaste camas e berços das paredes para evitar subida por contato.'], rooms: ['quartos'] },
      { text: 'Não, tudo afastado e suspenso', points: 0, urgency: '', actions: [], rooms: [] }
    ]
  },
  {
    id: 'q14', block: 4, title: 'Há crianças pequenas, idosos ou pessoas vulneráveis na residência?', category: 'humano',
    options: [
      { text: 'Sim, crianças', points: 10, urgency: '24h', actions: ['Crianças: A gravidade de acidentes é MUITO maior. Prioridade total para ralos e vedações nos quartos.'], rooms: ['quartos'], redFlag: true },
      { text: 'Sim, idosos', points: 7, urgency: '7d', actions: ['Idosos: Reduza pontos de acúmulo no chão e deixe ambientes bem iluminados para facilitar a visão.'], rooms: ['quartos', 'sala'] },
      { text: 'Nenhum', points: 0, urgency: '', actions: [], rooms: [] }
    ]
  },

  // BLOCO 5: Contexto de Ocorrência
  {
    id: 'q15', block: 5, title: 'Já apareceu escorpião no seu imóvel ou nas proximidades?', category: 'ocorrencia',
    options: [
      { text: 'Sim, DENTRO da casa recentemente (< 30 dias)', points: 25, urgency: '24h', actions: ['Alerta Máximo: Como já houve aparição interna, vede TODAS as saídas de ralos hoje e afaste camas imediatamente.'], rooms: ['sala', 'quartos', 'cozinha', 'banheiro', 'lavanderia'], redFlag: true },
      { text: 'Sim, NO QUINTAL ou garagem recentemente', points: 18, urgency: '24h', actions: ['Alerta Externo: Faça limpeza imediata do lote e instale rodo de vedação na porta que divide a casa do quintal.'], rooms: ['quintal', 'garagem'] },
      { text: 'Sim, vizinhos ou bairro relataram', points: 10, urgency: '7d', actions: ['Vizinhança: A região é propícia. Mantenha barreira química e estrutural (vedação de portas).'], rooms: ['garagem', 'quintal'] },
      { text: 'Nunca vi ou ouvi falar', points: 0, urgency: '', actions: [], rooms: [] }
    ]
  }
];

// --- APP STATE ---
let currentBlock = 1;
const totalBlocks = 5;
let userAnswers = {};

const quizRenderArea = document.getElementById('quiz-render-area');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const progressBar = document.getElementById('progress');

// --- RENDER BLOCK ---
function renderBlock(blockNum) {
  quizRenderArea.innerHTML = '';
  const questionsInBlock = QUIZ_DATA.filter(q => q.block === blockNum);

  // Block Headers
  const blockHeaders = [
    "Bloco 1: Perfil do Imóvel e Arredores",
    "Bloco 2: Entradas Estruturais (Ralos e Frestas)",
    "Bloco 3: Esconderijos, Alimento e Umidade",
    "Bloco 4: Riscos à Saúde Humana",
    "Bloco 5: Ocorrências e Histórico"
  ];
  const blockDescs = [
    "Vamos mapear a estrutura da sua casa e o que existe ao redor dela.",
    "Avaliaremos como o escorpião pode entrar fisicamente na sua casa.",
    "O que atrai o animal para morar e se reproduzir no local?",
    "Quais os riscos diretos de contato acidental no dia a dia.",
    "Analisando o histórico da sua região."
  ];

  const hdr = document.createElement('h2');
  hdr.className = 'block-title';
  hdr.innerText = blockHeaders[blockNum - 1];
  quizRenderArea.appendChild(hdr);

  const desc = document.createElement('p');
  desc.className = 'block-desc';
  desc.innerText = blockDescs[blockNum - 1];
  quizRenderArea.appendChild(desc);

  // Render Questions
  questionsInBlock.forEach((q, idx) => {
    const qBox = document.createElement('div');
    qBox.className = 'question-box';
    
    const title = document.createElement('div');
    title.className = 'q-title';
    title.innerText = `${idx + 1}. ${q.title}`;
    qBox.appendChild(title);

    const optsGrid = document.createElement('div');
    optsGrid.className = 'q-options';
    
    q.options.forEach(opt => {
      const btn = document.createElement('div');
      btn.className = 'q-opt';
      btn.innerText = opt.text;
      
      // Select logic
      if (userAnswers[q.id] && userAnswers[q.id].text === opt.text) {
        btn.classList.add('selected');
      }

      btn.addEventListener('click', () => {
        userAnswers[q.id] = { ...opt, category: q.category };
        // UI feedback
        Array.from(optsGrid.children).forEach(c => c.classList.remove('selected'));
        btn.classList.add('selected');
        validateBlock();
      });
      optsGrid.appendChild(btn);
    });

    qBox.appendChild(optsGrid);
    quizRenderArea.appendChild(qBox);
  });

  // UI Updates
  btnPrev.style.display = blockNum === 1 ? 'none' : 'block';
  btnNext.innerText = blockNum === totalBlocks ? 'Finalizar e Gerar Laudo →' : 'Continuar →';
  
  const progressPercent = ((blockNum - 1) / totalBlocks) * 100;
  progressBar.style.width = `${progressPercent}%`;

  validateBlock();
}

function validateBlock() {
  const questionsInBlock = QUIZ_DATA.filter(q => q.block === currentBlock);
  const answeredAll = questionsInBlock.every(q => userAnswers[q.id] !== undefined);
  btnNext.disabled = !answeredAll;
}

// --- NAVIGATION ---
btnNext.addEventListener('click', () => {
  if (currentBlock < totalBlocks) {
    currentBlock++;
    renderBlock(currentBlock);
    window.scrollTo({top:0, behavior:'smooth'});
  } else {
    // Generate Results
    processResults();
  }
});

btnPrev.addEventListener('click', () => {
  if (currentBlock > 1) {
    currentBlock--;
    renderBlock(currentBlock);
    window.scrollTo({top:0, behavior:'smooth'});
  }
});


// --- PROCESSING LOGIC ---
function processResults() {
  const originalText = btnNext.innerText;
  btnNext.innerText = "⏳ Gerando Laudo Avançado...";
  btnNext.disabled = true;

  // 1. Calculate Scores and Red Flags
  let totalScore = 0;
  let hasRedFlag = false;
  let hasKids = false;
  let hasRecentOccurrence = false;

  const roomScores = {
    'banheiro': 0,
    'cozinha': 0,
    'lavanderia': 0,
    'sala': 0,
    'quartos': 0,
    'garagem': 0,
    'quintal': 0
  };

  const actionPlans = { '24h': [], '7d': [], '30d': [] };

  Object.values(userAnswers).forEach(ans => {
    totalScore += ans.points;
    if (ans.redFlag) hasRedFlag = true;

    // Track specific conditions for super flags
    if (ans.text.includes('Sim, crianças')) hasKids = true;
    if (ans.text.includes('DENTRO da casa recentemente')) hasRecentOccurrence = true;

    // Distribute Room Scores
    if (ans.rooms) {
      ans.rooms.forEach(r => {
        if (roomScores[r] !== undefined) roomScores[r] += ans.points;
      });
    }

    // Action Plans
    if (ans.urgency && ans.actions && ans.actions.length > 0) {
      actionPlans[ans.urgency].push(...ans.actions);
    }
  });

  // Global Risk Assessment (0-24, 25-49, 50-74, 75-100)
  // Super Flag: Kids + Recent Occurrence pushes minimum to 75
  if (hasKids && hasRecentOccurrence && totalScore < 75) totalScore = 75;
  if (hasRedFlag && totalScore < 50) totalScore = 50;
  if (totalScore > 100) totalScore = 100; // Cap at 100

  let levelStr = "BAIXO";
  let color = "#10B981"; // Green
  let desc = "Ambiente relativamente protegido. Mantenha rotina de prevenção e limpeza.";
  
  if (totalScore >= 75) {
    levelStr = "CRÍTICO"; color = "#EF4444"; 
    desc = "Ambiente com múltiplos fatores de risco e necessidade de ação Imediata (Ralos/Frestas).";
  } else if (totalScore >= 50) {
    levelStr = "ALTO"; color = "#F97316"; 
    desc = "Condições favoráveis à entrada e abrigo. Recomendado agir rapidamente.";
  } else if (totalScore >= 25) {
    levelStr = "MODERADO"; color = "#F59E0B";
    desc = "Alguns pontos de atenção foram encontrados. Corrija em curto prazo.";
  }

  // --- POPULATE PDF PAGE 1 (Resumo) ---
  const today = new Date();
  document.getElementById('pdf-date').innerText = today.toLocaleDateString('pt-BR');
  document.getElementById('pdf-protocol').innerText = Math.floor(Math.random()*90000) + 10000;
  
  document.getElementById('pdf-risk-level').innerText = `Risco: ${levelStr}`;
  document.getElementById('pdf-risk-level').style.color = color;
  document.getElementById('pdf-risk-score').innerText = totalScore;
  document.getElementById('pdf-risk-score').style.color = color;
  document.getElementById('pdf-risk-card').style.borderLeftColor = color;
  document.getElementById('pdf-risk-desc').innerText = desc;

  // Top 3 Risks
  const topRisksList = document.getElementById('pdf-top-risks');
  topRisksList.innerHTML = '';
  // Sort answers by points descending to grab worst 3
  const worstIssues = Object.values(userAnswers)
    .filter(a => a.points >= 10 && a.actions.length > 0)
    .sort((a,b) => b.points - a.points)
    .slice(0, 3);
  
  if (worstIssues.length === 0) {
    topRisksList.innerHTML = '<li class="pdf-li">Nenhuma vulnerabilidade crítica gritante encontrada. Continue com inspeções regulares.</li>';
  } else {
    worstIssues.forEach(iss => {
      topRisksList.innerHTML += `<li class="pdf-li"><strong>• ${iss.actions[0]}</strong></li>`;
    });
  }

  // --- POPULATE PDF PAGE 2 (Heatmap) ---
  const getRoomColor = (score) => {
    if(score >= 40) return "#EF4444"; // Crítico para cômodo é menor threshold
    if(score >= 20) return "#F97316";
    if(score >= 10) return "#F59E0B";
    return "#10B981"; // Verde
  };

  Object.keys(roomScores).forEach(room => {
    const rect = document.getElementById(`svg-${room}`);
    if (rect) rect.style.fill = getRoomColor(roomScores[room]);
  });

  // --- POPULATE PDF PAGE 3 (Plano Tático) ---
  const fillList = (ulId, arr, emptyMsg) => {
    const ul = document.getElementById(ulId);
    ul.innerHTML = '';
    if(arr.length === 0){
      ul.innerHTML = `<li class="pdf-li" style="color:#888;">${emptyMsg}</li>`;
    } else {
      // Remove duplicates
      const unique = [...new Set(arr)];
      unique.forEach(txt => {
        // Bold string before colon
        let html = txt;
        if(txt.includes(':')) {
          html = `<strong>${txt.split(':')[0]}:</strong>${txt.split(':').slice(1).join(':')}`;
        }
        ul.innerHTML += `<li class="pdf-li">✓ ${html}</li>`;
      });
    }
  };
  fillList('pdf-plan-24h', actionPlans['24h'], 'Nenhuma ação de urgência crítica identificada.');
  fillList('pdf-plan-7d', actionPlans['7d'], 'Nenhuma ação pontual de curto prazo.');
  fillList('pdf-plan-30d', actionPlans['30d'], 'Manutenção preventiva padrão sugerida.');

  // --- POPULATE PDF PAGE 4 (Dossiê por Cômodo) ---
  const roomCardsContainer = document.getElementById('pdf-room-cards');
  roomCardsContainer.innerHTML = '';
  
  const roomNames = {
    'banheiro': 'Banheiro', 'cozinha': 'Cozinha', 'lavanderia': 'Lavanderia',
    'quartos': 'Quartos', 'sala': 'Sala e Corredor', 'garagem': 'Garagem / Frente', 'quintal': 'Quintal / Área Externa'
  };

  Object.keys(roomScores).forEach(room => {
    const rScore = roomScores[room];
    const rColor = getRoomColor(rScore);
    let rLevel = "Baixo";
    if(rColor === "#EF4444") rLevel = "Crítico";
    else if(rColor === "#F97316") rLevel = "Alto";
    else if(rColor === "#F59E0B") rLevel = "Atenção";

    // Gather specific tips for this room
    let roomTips = Object.values(userAnswers)
      .filter(a => a.rooms && a.rooms.includes(room) && a.actions.length > 0)
      .map(a => a.actions[0]);
    roomTips = [...new Set(roomTips)]; // Unique
    
    let tipsHtml = roomTips.length > 0 ? roomTips.map(t=>`<li>${t}</li>`).join('') : '<li>Vulnerabilidade estrutural muito baixa. Mantenha rotina normal de limpeza.</li>';

    roomCardsContainer.innerHTML += `
      <div class="room-card" style="border-left: 5px solid ${rColor}">
        <div class="room-header">
          <h4 class="room-name">${roomNames[room]}</h4>
          <span class="room-badge" style="background-color:${rColor}">${rLevel} Risco</span>
        </div>
        <ul style="margin:0; padding-left:20px; font-size:13px; color:#444; line-height:1.6;">
          ${tipsHtml}
        </ul>
      </div>
    `;
  });

  // --- GENERATE PDF ---
  const elementoParaPDF = document.getElementById('pdf-wrapper');
  elementoParaPDF.style.display = 'block';

  // Opções para quebras de página funcionarem lindamente
  const opcoes = {
    margin:       0,
    filename:     `EscorpiaoSafe_Laudo_${totalScore}pts.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'px', format: [800, 1130], orientation: 'portrait' } // Formato adaptado à div de 800px pra evitar cortes!
  };

  html2pdf().set(opcoes).from(elementoParaPDF).save().then(() => {
    elementoParaPDF.style.display = 'none';
    btnNext.innerText = "Laudo Baixado! ✔️";
    progressBar.style.width = '100%';
  }).catch(err => {
    console.error(err);
    elementoParaPDF.style.display = 'none';
    btnNext.innerText = "Erro. Tente novamente.";
    btnNext.disabled = false;
  });
}

// Inicializa a primeira tela
renderBlock(currentBlock);
