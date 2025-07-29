import http from "http"; // importar o http
import fs from "fs"; //importar o fs(fs.writeFile, fs.writeFile)
import rotas from "./routes.js"; //importar as rotas utilizadas
import sqlite3 from "sqlite3";//  importar o sqlite3 para usar o db

const db = new sqlite3.Database("./tic.db", (erro) =>{
    if(erro) {
        console.log("Falha ao inicializar o bando de dados");
        return;
    }
    console.log("Banco de dados inicializado corretamente");
});

// abre a "função" fs.writeFile em que nela vc cria e escreve um arquivo
fs.writeFile("./mensagem.txt", "ola tic em trilhas do arquivo", "utf-8", (erro)=>{ //parametros: "./nome do arquivo", "conteudo do arquivo/frase digitada", "utf-8(formatação)", (erro(para usar dentro da funcao))
    if (erro) {
        console.log("Falha ao escrever o arquivo", erro);
        return;
    }
    console.log("arquivo criado com sucesso");
});


// abre a "função" fs.readFile em que nela vc le oq tem no arquivo
fs.readFile("./mensagem.txt", "utf-8", (erro, conteudo)=>{ //parametros: "./nome do arquivo", "utf-8(formatação)", (erro,conteudo(para usar dentro da funcao))
if (erro) {
    console.log("falha na leitura do arquivo", erro);
    return;
    }
    console.log(`Conteudo do arquivo: ${conteudo}`);

    iniciaServidor(conteudo); //chama a funcao de iniciar servidor dps de ler o arquivo
});


//funcao de iniciar o servidor 
function iniciaServidor(conteudo) {
    const servidor = http.createServer((req, res) =>{ //declara uma constante de servidor e puxa a funcao de http.createServer para criar um servidor
        rotas(req,res, {conteudo}); // chama a rota de conteudo(funcao) contido no arquivo "routes.js"
});

const porta = 3000; //porta com num 3000
const host = "localhost"; //host com nome de localhost

servidor.listen(porta, host, () =>{ // ouvir, com servidor.listen que quando realmente estiver funcionando o servidor, ira aparecer a mensagem
    console.log(`Servidor executando em http://${host}:${porta}/`); 
});

};

