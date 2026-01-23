const barraProgresso = document.getElementById('progress-bar');
const statusTexto = document.getElementById('queue-status');
const usuariosFrente = document.getElementById('users-ahead');
const tokenTexto = document.getElementById('queue-token');
const atualizacaoTexto = document.getElementById('last-update');
const telaFila = document.getElementById('queue-screen');
const telaJogo = document.getElementById('game-screen');

let progresso = 0;
// Aleatoriza entre 20k e 40k pessoas na frente
let usuarios = Math.floor(Math.random() * (40000 - 20000) + 20000);
let token = Math.random().toString(36).substring(2,9).toUpperCase();

// Inicia os dados
tokenTexto.innerText = token;
usuariosFrente.innerText = usuarios.toLocaleString();

function atualizaTempo() {
    const agora = new Date();
    atualizacaoTexto.innerText = agora.toLocaleTimeString();
}

function atualizaFila() {
    let incremento = Math.random() * 5;

    // Da uma lentidão de 20%
    if (Math.random() > 0.8) incremento = 0;
    // Se tiver quase no final deixa mais lento
    if (progresso > 90) incremento = Math.random() * 0.5;
    // Adicionar um para o 99%

    progresso += incremento;

    if (progresso >= 100) {
        progresso = 100;
        usuariosFrente.innerText = "0";
        statusTexto.innerText = "Sua vez chegou! Entrando...";
        // Da um 10 antes de sair do carregamento
        setTimeout(iniciaJogo, 1000);
    } else {
        barraProgresso.style.width = progresso + '%';

        let usuariosAgora = Math.floor(usuarios * (1 - progresso / 100))
        usuariosFrente.innerText = usuariosAgora.toLocaleString();
        statusTexto.innerText = "Sua posição na fila está sendo atualizada...";

        atualizaTempo()
        // Depois deixar mais lento (* 1000 + 500)
        setTimeout(atualizaFila, Math.random() * 500 + 100);
    }
}

function iniciaJogo() {
    telaFila.classList.add('hidden');
    telaJogo.classList.remove('hidden')
    console.log("Jogo Iniciado!")
}

atualizaFila();