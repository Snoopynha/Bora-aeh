const setoresNivelFacil = {
    "pista" : {
        nome: "Pista",
        categoria: "pista",
        status: "disponivel",
        chanceEsgotar: 0.2
    },
    "cadeira-inferior" : {
        nome: "Cadeira inferior",
        categoria: "cadeira",
        status: "disponivel",
        chanceEsgotar: 0.15
    },
    "cadeira-superior" : {
        nome: "Cadeira superior",
        categoria: "cadeira",
        status: "disponivel",
        chanceEsgotar: 0.1
    },
    "arquibancada" : {
        nome: "Arquibancada",
        categoria: "arquibancada",
        status: "disponivel",
        chanceEsgotar: 0.05
    },
};

// Pedaços do svg que são decorativos (não serão involvidos na lógica principal)
const areasDeBase = ["palco", "base", "estadio-um"];

export {setoresNivelFacil, areasDeBase};