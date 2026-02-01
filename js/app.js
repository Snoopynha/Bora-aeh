import {setoresNivelFacil, areasDeBase} from './setores.js';

export function iniciarJogo() {
    document.getElementById('queue-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    console.log("Jogo Iniciado!");

    configurarClique();
    iniciarSimuladorVendas();
}

function configurarClique() {
    const estadio = document.getElementById('estadio-um');

    estadio.addEventListener('click', (event) => {
        const idClicado = event.target.id;

        // Vê se clicou em um setor válido
        if(setoresNivelFacil[idClicado]) {
            const setor = setoresNivelFacil[idClicado];
            processarCliqueSetor(idClicado, setor);
        } else if (areasDeBase.includes(idClicado)) {
            adicionarLog("Você não selecionou um setor de assentos");
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

function processarCliqueSetor(id, dados) {
    if (dados.status === "esgotado") {
        adicionarLog(`Você selecionou: o setor ${dados.nome} ele já está esgotado.`);
    } else {
        adicionarLog(`Você selecionou: ${dados.nome} (${dados.status})`);
    }
}