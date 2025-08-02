import sqlite3 from "sqlite3";
import express from "express";
import bodyParser from "body-parser";

import { rotasProdutos } from "./routes/produtos.js";
import { rotasPedidos } from "./routes/pedidos.js";

import { sequelize } from "./models.js";

const app = express();

app.use(bodyParser.json());

app.use(rotasProdutos);

app.use(rotasPedidos);

async function iniciaApp() {

  // Inicializa o banco SQLite
  const db = new sqlite3.Database("./tic.db", (erro) => {
      if (erro) {
          console.log("Falha ao inicializar o banco de dados");
          return;
      }
      console.log("Banco de dados inicializado");
  });


  await sequelize.sync(); // recria as tabelas
  
  const porta = 3000;
 
  app.listen(porta);
}

iniciaApp();