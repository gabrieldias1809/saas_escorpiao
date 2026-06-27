import html2pdf from 'html2pdf.js';

let currentStep = 1;
const totalSteps = 5;
let totalScore = 0;
const actions = []; // Array to hold the selected actions

const steps = document.querySelectorAll('.quiz-step');
const progressBar = document.getElementById('progress');
const btnGerar = document.getElementById('btn-gerar');

// Initialize options
document.querySelectorAll('.quiz-opt').forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Get points and action from the clicked button
    const points = parseInt(e.target.getAttribute('data-points'));
    const actionText = e.target.getAttribute('data-act');
    
    totalScore += points;
    if (actionText) {
      actions.push(actionText);
    }

    // Move to next step
    goToNextStep();
  });
});

function goToNextStep() {
  const currentEl = document.getElementById(`step-${currentStep}`);
  if (currentEl) {
    currentEl.classList.remove('active');
  }

  currentStep++;

  // Update Progress Bar
  const progressPercent = Math.min(((currentStep - 1) / totalSteps) * 100, 100);
  progressBar.style.width = `${progressPercent}%`;

  if (currentStep <= totalSteps) {
    const nextEl = document.getElementById(`step-${currentStep}`);
    if (nextEl) {
      nextEl.classList.add('active');
    }
  } else {
    // Show final step
    const finalEl = document.getElementById('step-final');
    if (finalEl) {
      finalEl.classList.add('active');
    }
    preparePdfData();
  }
}

function preparePdfData() {
  const scoreTitle = document.getElementById('pdf-score-title');
  const riskDesc = document.getElementById('pdf-risk-desc');
  const pdfActions = document.getElementById('pdf-actions');
  const riskBox = document.getElementById('pdf-risk-box');

  // Determine Risk Level
  let riskLevel = "BAIXO";
  let color = "#10B981"; // Green
  let bg = "#ecfdf5";
  let desc = "Sua casa apresenta um ambiente relativamente seguro, mas a prevenção contínuma é necessária.";

  if (totalScore >= 60) {
    riskLevel = "ALTO";
    color = "#FF5A4D"; // Red
    bg = "#fdf3f2";
    desc = "Sua casa apresenta condições ALTAMENTE favoráveis para abrigo e proliferação de escorpiões. É necessário ação imediata.";
  } else if (totalScore >= 30) {
    riskLevel = "MÉDIO";
    color = "#F59E0B"; // Yellow/Orange
    bg = "#fffbeb";
    desc = "Sua casa possui alguns pontos de atenção críticos que precisam ser resolvidos em breve.";
  }

  scoreTitle.innerText = `Índice de Risco: ${riskLevel} (${totalScore}/100)`;
  scoreTitle.style.color = color;
  riskDesc.innerText = desc;
  riskBox.style.backgroundColor = bg;
  riskBox.style.borderLeftColor = color;

  // Build the actions list
  pdfActions.innerHTML = "";
  if (actions.length === 0) {
    pdfActions.innerHTML = "<li style='padding: 15px; border-bottom: 1px solid #eee;'>Mantenha os bons hábitos e inspeções semestrais.</li>";
  } else {
    actions.forEach((act, index) => {
      // Bold the text before the colon
      const parts = act.split(':');
      let html = "";
      if (parts.length > 1) {
        html = `<strong>${index + 1}. ${parts[0]}:</strong>${parts.slice(1).join(':')}`;
      } else {
        html = `<strong>${index + 1}.</strong> ${act}`;
      }
      
      const li = document.createElement('li');
      li.style.padding = "15px";
      li.style.borderBottom = "1px solid #eee";
      li.innerHTML = html;
      pdfActions.appendChild(li);
    });
  }
}

// Hook up Generate PDF button
if (btnGerar) {
  btnGerar.addEventListener('click', () => {
    const originalText = btnGerar.innerText;
    btnGerar.innerText = "⏳ Gerando Laudo...";

    const elementoParaPDF = document.getElementById('pdf-content');
    elementoParaPDF.style.display = 'block';

    const opcoes = {
      margin:       10,
      filename:     `Laudo_EscorpiaoSafe_${totalScore}_pts.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opcoes).from(elementoParaPDF).save().then(() => {
      elementoParaPDF.style.display = 'none';
      btnGerar.innerText = "Baixado com sucesso! ✔️";
      setTimeout(() => {
        btnGerar.innerText = originalText;
      }, 3000);
    }).catch(err => {
      console.error(err);
      elementoParaPDF.style.display = 'none';
      btnGerar.innerText = "Erro ao gerar PDF";
    });
  });
}
