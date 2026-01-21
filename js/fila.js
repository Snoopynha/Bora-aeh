const barraProgresso = document.getElementById('progress-bar');
const statusTexto = document.getElementById('queue-status');
const telaFila = document.getElementById('queue-screen');
const telaJogo = document.getElementById('game-screen');

let progresso = 0;

function atualizaFila() {
    let incremento = Math.random() * 5;

    // Da uma lentidão de 20%
    if (Math.random() > 0.8) incremento = 0;
    // Se tiver quase no final deixa mais lento
    if (progresso > 90) incremento = Math.random() * 0.5;

    progresso += incremento;

    if (progresso >= 100) {
        progresso = 100;
        barraProgresso.style.width = progresso + '%';
        statusTexto.innerText = "Sua vez chegou! Entrando...";

        // Da um 10 antes de sair do carregamento
        setTimeout(iniciaJogo, 1000);
    } else {
        barraProgresso.style.width = progresso + '%';
        statusTexto.innerText = `Progresso: ${Math.floor(progresso)}%`;

        setTimeout(atualizaFila, Math.random() * 500 + 100);
    }
}

function iniciaJogo() {
    telaFila.classList.add('hidden');
    telaJogo.classList.remove('hidden')
    console.log("Jogo Iniciado!")
}

atualizaFila();