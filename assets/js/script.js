document.addEventListener('DOMContentLoaded', () => {
  // Seletores dos elementos HTML
  const passwordOutput = document.getElementById('password-output');
  const copyBtn = document.getElementById('copy-btn');
  const passwordLength = document.getElementById('password-length');
  const lengthValue = document.getElementById('length-value');
  const uppercaseCheckbox = document.getElementById('uppercase');
  const lowercaseCheckbox = document.getElementById('lowercase');
  const numbersCheckbox = document.getElementById('numbers');
  const symbolsCheckbox = document.getElementById('symbols');
  const strengthBar = document.getElementById('strength-bar');
  const strengthText = document.getElementById('strength-text');
  const generateBtn = document.getElementById('generate-btn');

  // Elementos do histórico e dicas (se existirem no HTML)
  const passwordHistory = document.getElementById('password-history');
  const securityTips = document.getElementById('security-tips');

  // Array para armazenar histórico
  let history = [];

  // Mapeamento de caracteres
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numbersChars = '0123456789';
  const symbolsChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

  // Função principal para gerar a senha
  const generatePassword = () => {
    let password = '';
    let availableChars = '';
    
    // 1. Monta os caracteres disponíveis com base nos checkboxes
    if (uppercaseCheckbox.checked) availableChars += uppercaseChars;
    if (lowercaseCheckbox.checked) availableChars += lowercaseChars;
    if (numbersCheckbox.checked) availableChars += numbersChars;
    if (symbolsCheckbox.checked) availableChars += symbolsChars;

    // Validação: pelo menos um tipo selecionado
    if (!availableChars) {
      passwordOutput.textContent = 'Selecione pelo menos um tipo de caractere!';
      updatePasswordStrength('');
      return; // Interrompe a função se não houver caracteres selecionados
    }

    // 2. Gera a senha
    for (let i = 0; i < passwordLength.value; i++) {
      password += availableChars.charAt(Math.floor(Math.random() * availableChars.length));
    }

    passwordOutput.textContent = password;
    updatePasswordStrength(password);

    // 3. Adiciona ao histórico (se o elemento existir)
    if (passwordHistory) {
      addToHistory(password);
    }
  };


  // Função para atualizar a força da senha
  const updatePasswordStrength = (password) => {
    let score = 0;

    // Comprimento
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    
    // Tipos de caracteres
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Dica dinâmica (se o elemento existir)
    if (securityTips) {
      showDynamicTips(password);
    }

    // Barra de força
    let percent = Math.min(score * 16, 100);
    strengthBar.style.width = percent + '%';
    strengthBar.classList.remove('weak', 'medium', 'strong');

    if (score <= 2) {
      strengthBar.classList.add('weak');
      strengthText.textContent = 'Fraca';
      strengthText.style.color = '#dc3545';
    } else if (score <= 4) {
      strengthBar.classList.add('medium');
      strengthText.textContent = 'Média';
      strengthText.style.color = '#ffc107';
    } else {
      strengthBar.classList.add('strong');
      strengthText.textContent = 'Forte';
      strengthText.style.color = '#28a745';
    }
  };

  // --- Funções Adicionais (se os elementos existirem) ---
  // Estas funções foram adicionadas, mas seus elementos HTML não foram fornecidos
  // no código inicial que eu te enviei. Se você os adicionar ao seu HTML, elas funcionarão.

  // Adiciona senha ao histórico
  function addToHistory(password) {
    if (!password || password.includes('Selecione')) return;
    history.unshift(password);
    if (history.length > 5) history = history.slice(0, 5);
    renderHistory();
  }

  // Renderiza histórico na interface
  function renderHistory() {
    if (!passwordHistory) return;
    passwordHistory.innerHTML = '';
    history.forEach((pass, idx) => {
      const li = document.createElement('li');
      li.className = 'history-item';
      li.innerHTML = `<span>${pass}</span> <button class="copy-history-btn" title="Copiar" data-idx="${idx}">Copiar</button>`;
      passwordHistory.appendChild(li);
    });
  }

  // Copiar senha do histórico
  if (passwordHistory) {
    passwordHistory.addEventListener('click', (e) => {
      if (e.target.classList.contains('copy-history-btn')) {
        const idx = e.target.getAttribute('data-idx');
        navigator.clipboard.writeText(history[idx])
          .then(() => alert('Senha copiada do histórico!'));
      }
    });
  }

  // Dicas dinâmicas de segurança
  function showDynamicTips(password) {
    if (!securityTips) return;
    let tips = [];
    if (password.length < 12) tips.push('Aumente o comprimento para mais segurança.');
    if (!/[A-Z]/.test(password)) tips.push('Adicione letras maiúsculas.');
    if (!/[a-z]/.test(password)) tips.push('Adicione letras minúsculas.');
    if (!/[0-9]/.test(password)) tips.push('Inclua números.');
    if (!/[^A-Za-z0-9]/.test(password)) tips.push('Inclua símbolos especiais.');
    securityTips.innerHTML = '';
    if (tips.length === 0) {
      securityTips.innerHTML = '<li>Sua senha está excelente!</li>';
    } else {
      tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        securityTips.appendChild(li);
      });
    }
  }

  // Event Listeners
  passwordLength.addEventListener('input', () => {
    lengthValue.textContent = passwordLength.value;
    generatePassword(); // Gera uma nova senha ao mover o slider
  });

  generateBtn.addEventListener('click', generatePassword);

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(passwordOutput.textContent)
      .then(() => {
        alert('Senha copiada com sucesso!');
      })
      .catch(err => {
        console.error('Erro ao copiar a senha: ', err);
      });
  });
  
  // Lógica de validação da senha do usuário
  const userPasswordInput = document.getElementById('user-password');
  const checkUserPasswordBtn = document.getElementById('check-user-password');
  const userPasswordFeedback = document.getElementById('user-password-feedback');

  if (checkUserPasswordBtn) {
    checkUserPasswordBtn.addEventListener('click', function() {
      const pwd = userPasswordInput.value;
      let tips = [];
      if (pwd.length < 12) tips.push('Aumente o comprimento para mais segurança.');
      if (!/[A-Z]/.test(pwd)) tips.push('Adicione letras maiúsculas.');
      if (!/[a-z]/.test(pwd)) tips.push('Adicione letras minúsculas.');
      if (!/[0-9]/.test(pwd)) tips.push('Inclua números.');
      if (!/[^A-Za-z0-9]/.test(pwd)) tips.push('Inclua símbolos especiais.');
      if (tips.length === 0) {
        userPasswordFeedback.textContent = 'Senha forte! Você pode usá-la.';
        userPasswordFeedback.style.color = '#28a745';
        passwordOutput.textContent = pwd;
      } else {
        userPasswordFeedback.innerHTML = tips.map(tip => `<div style='color:#dc3545;'>${tip}</div>`).join('');
        userPasswordFeedback.style.color = '#dc3545';
      }
    });
  }

  // Gera uma senha inicial ao carregar a página
  generatePassword();
});