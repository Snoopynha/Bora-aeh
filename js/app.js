import {setoresNivelFacil, areasDeBase} from './setores.js';

// ---ESTADOS DO JOGO---
let missaoAtual = null;
let vidas = 3;
let ingressosComprados = 0;
let segundosSobrevividos = 0;
let intervaloCronometro = null;
let tempoRestanteMissao = 15;

export function iniciarJogo() {
    document.getElementById('queue-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    console.log("Jogo Iniciado!");

    configurarClique();
    iniciarSimuladorVendas();
    gerarNovaMissao();
}

function configurarClique() {
    document.getElementById('estadio-um').addEventListener('click', (event) => {
        const idClicado = event.target.id;
        
        // Se o id for válido
        if (setoresNivelFacil[idClicado]) {
            processarCliqueSetor(idClicado);
        } else {
            adicionarLog("Atenção: você não clicou em um setor válido");
            penalizar('tempo');
        }
    });
}

function iniciarSimuladorVendas() {
    console.log("Simulador de vendas iniciado!");

    setInterval(() => {
        for (let id in setoresNivelFacil) {
            const setor = setoresNivelFacil[id];
            const sorteio = Math.random();

            if (setor.status === "disponivel" && sorteio < setor.chanceEsgotar) {
                setor.status = "esgotando";
                adicionarLog(`${setor.nome} está quase esgotando!`);
            } 
            else if (setor.status === "esgotando" && sorteio < 0.3) {
                setor.status = "esgotado";
                adicionarLog(`${setor.nome} ESGOTADO!`);
            }
            // Mudar tratamento de esgotado-> esgotando
            else if (setor.status === "esgotado") { 
                setor.status = "esgotando";
                adicionarLog(`⚡ Vaga liberada! vaga em ${setor.nome}!`);
            }
        }
        atualizarVisualMapa();
    }, 2500);
}

function gerarNovaMissao() {
    const ids = Object.keys(setoresNivelFacil);
    const tipos = ["EXAT", "NAO", "PRIORI"];

    const tipoSorteado = tipos[Math.floor(Math.random() * tipos.length)];
    const setorA = ids[Math.floor(Math.random() * ids.length)];
    const setorB = ids[Math.floor(Math.random() * ids.length)];

    while (setorB === setorA) { setorB = ids[Math.floor(Math.random() * ids.length)]; }
    switch (tipoSorteado) {
        case "EXAT":
            missaoAtual = { tipo: "EXAT", alvo: setorA, texto: `GARANTA: ${setoresNivelFacil[setorA].nome}` };
            break;
        case "NAO":
            missaoAtual = { tipo: "NAO", proibido: setorA, texto: `COMPRE QUALQUER UM, MENOS: ${setoresNivelFacil[setorA].nome}` };
            break;
        case "PRIORI":
            missaoAtual = { tipo: "PRIORI", planoA: setorA, planoB: setorB, texto: `TENTE ${setoresNivelFacil[setorA].nome}, SE ESGOTAR VÁ DE ${setoresNivelFacil[setorB].nome}` };
            break;
    }

    document.getElementById('mission-text').innerText = missaoAtual.texto;
}

// ---FUNÇÕES AUXILIARES---
function atualizarVisualMapa() {
    for (let id in setoresNivelFacil) {
        const setorDados = setoresNivelFacil[id];
        const elementoSvg = document.getElementById(id);

        if (elementoSvg) {
            elementoSvg.classList.remove('status-disponivel', 'status-esgotando', 'status-esgotado');
            elementoSvg.classList.add(`status-${setorDados.status}`);
        }
    }
}

function adicionarLog(mensagem) {
    const logList = document.getElementById('log-list');
    if (logList) {
        const novoItem = document.createElement('li');
        novoItem.innerText = `[${new Date().toLocaleTimeString()}] ${mensagem}`;
        logList.prepend(novoItem);

        const maxItens = 10;
        while (logList.children.length > maxItens) {
            logList.removeChild(logList.lastChild);
        }
    }
}

function processarCliqueSetor(idClicado) {
    const setor = setoresNivelFacil[idClicado]
    
    // Clicou em um setor esgotado perdeu vida
    if (setor.status === "esgotado") {
        adicionarLog(`Erro Crítico! ${setor.nome} já está esgotado.`);
        penalizar('vida');
        return;
    }

    // Marca se a pessoa cumpriu ou não
    let sucesso = false;

    // Validação por tipo de missão
    if (missaoAtual.tipo === "EXAT") {
        sucesso = (idClicado === missaoAtual.alvo);
    } else if (missaoAtual.tipo === "NAO") {
        sucesso = (idClicado !== missaoAtual.proibido);
    } else if (missaoAtual.tipo === "PRIORI") {
        const statusA = setoresNivelFacil[missaoAtual.planoA].status;
        if (idClicado === missaoAtual.planoA) sucesso = true;
        else if (idClicado === missaoAtual.planoB && statusA === "esgotado") sucesso = true;
    }

    if (sucesso) {
        ingressosComprados++;
        document.getElementById('score-count').innerText = ingressosComprados;
        adicionarLog(`Sucesso! +1 ingresso de ${setor.nome}`);
        gerarNovaMissao();
    } else {
        adicionarLog(`Erro! Setor errado para o objetivo atual!`);
        penalizar('tempo');
    }
}

function penalizar(tipo) {
    if (tipo === 'tempo') {
        // Perde 5 segundos do cronômetro da missão atual
        tempoRestanteMissao -= 5;
        adicionarLog("Clique errado! -5 segundos");
        document.getElementById('timer').innerText = tempoRestanteMissao > 0 ? tempoRestanteMissao : 0;
        
        // Efeitinho visual de tremor
        document.getElementById('timer').classList.add('shake');
        setTimeout(() => document.getElementById('timer').classList.remove('shake'), 500);

    } else if (tipo === 'vida') {
        vidas--;
        atualizarInterfaceVidas();
        adicionarLog("Erro Crítico! Você perdeu uma vida.");

        if (vidas <= 0) {
            gameOver();
        } else {
            // Pula para a próxima para não travar no erro
            gerarNovaMissao();
        }
    }
}