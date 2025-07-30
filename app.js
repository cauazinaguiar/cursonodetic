// Importa o módulo HTTP nativo do Node.js para criar o servidor
import http from "http";

// Importa o módulo `fs` (file system) para manipulação de arquivos (ler, escrever, etc.)
import fs from "fs";

// Importa as rotas definidas no arquivo routes.js (responsável por tratar os endpoints da API)
import rotas from "./routes.js";

// Importa o SQLite3, um banco de dados leve baseado em arquivos
import sqlite3 from "sqlite3";

// Importa a instância do Sequelize já configurada com SQLite
import { sequelize } from "./models.js";


// Inicializa o banco SQLite, apontando para o arquivo tic.db
const db = new sqlite3.Database("./tic.db", (erro) => {
    if (erro) {
        console.log("Falha ao inicializar o banco de dados");
        return;
    }
    console.log("Banco de dados inicializado corretamente");
});


// Cria e escreve um conteúdo no arquivo mensagem.txt
fs.writeFile(
    "./mensagem.txt",                      // Caminho e nome do arquivo
    "ola tic em trilhas do arquivo",       // Conteúdo que será gravado
    "utf-8",                               // Codificação de caracteres
    (erro) => {                            // Função callback para tratar o resultado
        if (erro) {
            console.log("Falha ao escrever o arquivo", erro);
            return;
        }
        console.log("Arquivo criado com sucesso");
    }
);


// Lê o conteúdo do arquivo mensagem.txt
fs.readFile(
    "./mensagem.txt",                      // Caminho e nome do arquivo
    "utf-8",                               // Codificação para ler corretamente o texto
    (erro, conteudo) => {                  // Callback que retorna erro ou conteúdo
        if (erro) {
            console.log("Falha na leitura do arquivo", erro);
            return;
        }

        console.log(`Conteúdo do arquivo: ${conteudo}`);

        // Após ler o conteúdo do arquivo, inicializa o servidor HTTP passando esse conteúdo
        iniciaServidor(conteudo);
    }
);


// Função responsável por iniciar o servidor
async function iniciaServidor(conteudo) {
    // Garante que todas as tabelas estejam sincronizadas com o banco de dados antes de iniciar o servidor
    await sequelize.sync();

    // Cria o servidor HTTP
    const servidor = http.createServer((req, res) => {
        // A cada requisição, chama a função rotas passando a requisição, resposta e o conteúdo do arquivo lido
        rotas(req, res, { conteudo });
    });

    // Define a porta e o host do servidor
    const porta = 3000;
    const host = "localhost";

    // Inicia o servidor e escuta requisições HTTP na porta e host definidos
    servidor.listen(porta, host, () => {
        console.log(`Servidor executando em http://${host}:${porta}/`);
    });
}
