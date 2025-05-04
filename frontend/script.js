document.getElementById('fan-form').addEventListener('submit', async function (e) {
  e.preventDefault();

// Cria um objeto FormData para pegar os dados do formulário
  const form = this;
  const formData = new FormData(form);
// Obtém os valores dos campos do formulário  
  const nome = formData.get('nome')?.trim();
  const cpf = formData.get('cpf')?.trim();
  const documento = formData.get('documento');
  const twitterUrl = document.getElementById('twitterInput').value.trim();

  const status = document.getElementById('twitterStatus');

  status.textContent = '';
  status.style.color = '';

// Exibe a tela de escaneamento e oculta a tela de resultados 
  document.getElementById('scannerScreen').classList.remove('hidden');
  document.getElementById('resultadoScreen').classList.add('hidden');

// Valida os dados preenchidos pelo usuário  
  if (!nome) return alert("Por favor, preencha seu nome.");
  if (!validarCPF(cpf)) return alert("CPF inválido!");
  if (!documento) return alert("Por favor, envie um documento de identificação.");
  if (twitterUrl && !/^https:\/\/(x\.com|twitter\.com)\/[A-Za-z0-9_]+\/?$/.test(twitterUrl)) {
    return alert("Por favor, insira uma URL válida de perfil no X (Twitter).");
  }

  try {
// Exibe o status de "Processando..."    
    status.textContent = "⏳ Processando...";
    status.style.color = "white";

    const uploadResp = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    const data = await uploadResp.json();

    console.log("Resposta /upload:", data);

// Exibe erro caso o nome informado não seja encontrado ou seja inconsistente
    if (data.status === 'erro' && data.mensagem.includes('nome informado')) {
      document.getElementById('scannerScreen').classList.add('hidden');
      status.textContent = "❌ O nome informado não foi encontrado ou está diferente no documento.";
      status.style.color = "red";
      return;
    }

// Exibe mensagem de erro geral, caso haja algum erro
    if (data.status === 'erro') {
      document.getElementById('scannerScreen').classList.add('hidden');
      status.textContent = "❌ " + data.mensagem;
      status.style.color = "red";
      return;
    }

// Caso não haja erro, oculta a tela de escaneamento e exibe a tela de resultados
    document.getElementById('scannerScreen').classList.add('hidden');
    document.getElementById('resultadoScreen').classList.remove('hidden');

// Exibe links personalizados com base nos dados de e-sports ou não, facilmente editável    
    const resultadoTexto = document.getElementById('resultadoTexto');
    resultadoTexto.innerHTML = data.relacionadoEsports
      ? `
        🎯 Você parece ser um verdadeiro fã de e-sports! Aqui estão alguns links que podem te interessar:<br><br>
        🔗 <a href="https://furia.gg" target="_blank">Site oficial da FURIA</a><br>
        🔗 <a href="https://www.twitch.tv/furiagg" target="_blank">Twitch da FURIA</a><br>
        🔗 <a href="https://twitter.com/FURIA" target="_blank">Twitter da FURIA</a><br>
        🔗 <a href="https://discord.gg/furia" target="_blank">Comunidade FURIA no Discord</a><br>
      `
      : `
        🎮 Beleza, vamos te ajudar a começar no universo gamer:<br><br>
        🔗 <a href="https://www.youtube.com/@FURIA" target="_blank">YouTube da FURIA</a><br>
        🔗 <a href="https://furia.gg/loja" target="_blank">Loja oficial da FURIA</a><br>
        🔗 <a href="https://twitter.com/FURIAAcademy" target="_blank">Twitter da FURIA Academy</a><br>
        🔗 <a href="https://furia.gg/noticias" target="_blank">Notícias da FURIA</a><br>
      `;

// Limpa o formulário
    form.reset();
    status.textContent = '';
  } catch (err) {
// Em caso de erro na requisição, exibe uma mensagem    
    console.error("Erro geral:", err);
    document.getElementById('scannerScreen').classList.add('hidden');
    status.textContent = "❌ Ocorreu um erro no processamento.";
    status.style.color = "red";
  }
});

// Função para validar o CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 0; i < 9; i++) soma += +cpf[i] * (10 - i);
  resto = (soma * 10) % 11; if (resto >= 10) resto = 0;
  if (resto !== +cpf[9]) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += +cpf[i] * (11 - i);
  resto = (soma * 10) % 11; if (resto >= 10) resto = 0;
// Retorna verdadeiro se o CPF for válido  
  return resto === +cpf[10];
}
// Função para reiniciar o formulário
function reiniciarFormulario() {
  document.getElementById('resultadoScreen').classList.add('hidden');
  document.getElementById('scannerScreen').classList.add('hidden');
  document.getElementById('fan-form').reset();
  document.getElementById('twitterStatus').textContent = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}