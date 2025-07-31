import http from "http";
import fs from "fs";
import rotas from "./routes.js";
import sqlite3 from "sqlite3";
import express from "express";

import {
  sequelize,
  criarProduto,
  criarPedido,
  lerPedidos
} from "./models.js";



// Inicializa o banco SQLite
const db = new sqlite3.Database("./tic.db", (erro) => {
    if (erro) {
        console.log("Falha ao inicializar o banco de dado");
        return;
    }
    console.log("Banco de dados inicializado");
});


// Cria e escreve um conteúdo no arquivo
fs.writeFile("./mensagem.txt", "ola tic em trilhas do arquivo", "utf-8", (erro) => {
  if (erro) console.log("Erro ao criar arquivo:", erro);
  else console.log("Arquivo criado com sucesso");
});

// Lê o conteúdo e inicia o servidor
fs.readFile("./mensagem.txt", "utf-8", async (erro, conteudo) => {
  if (erro) return console.log("Erro ao ler arquivo:", erro);

  console.log(`Conteúdo do arquivo: ${conteudo}`);
  await iniciaServidor(conteudo);
});

async function iniciaServidor(conteudo) {
  await sequelize.sync({ force: true }); // recria as tabelas
  console.log("Banco sincronizado");

  // Insere produtos
  const p1 = await criarProduto({ nome: "Mouse", preco: 29.9 });
  const p2 = await criarProduto({ nome: "Teclado", preco: 59.9 });

  // Cria pedido com produtos
  await criarPedido({
    valorTotal: 89.8,
    produtos: [
      { id: p1.id, quantidade: 1 },
      { id: p2.id, quantidade: 1 }
    ]
  });

  // Lista os dados da tabela de junção
  await lerPedidos();

  // Cria servidor HTTP (opcional)
  const server = http.createServer((req, res) => {
    res.end("Servidor online!");
  });

  const port = 3000;
  server.listen(port, () => {
    console.log(`Servidor executando em http://localhost:${port}/`);
  });
}
