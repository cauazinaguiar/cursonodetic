import { Sequelize } from "sequelize";

// Conexão com SQLite
export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./tic.db",
  logging: console.log // mostra os comandos no terminal
});

// Tenta autenticar a conexão
sequelize.authenticate();

// Tabela Produto
export const Produto = sequelize.define("produto", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  preco: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
});

// Tabela Pedido
const Pedido = sequelize.define("pedido", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  valor_total: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  estado: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// Tabela de junção com campos extras
const produtosPedido = sequelize.define("produtos_pedido", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantidade: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  preco: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
});

// Relacionamentos com chave clara
Produto.belongsToMany(Pedido, {
  through: produtosPedido,
  foreignKey: "produtoId",
  otherKey: "pedidoId"
});
Pedido.belongsToMany(Produto, {
  through: produtosPedido,
  foreignKey: "pedidoId",
  otherKey: "produtoId"
});

// Funções CRUD

export async function criarProduto(produto) {
  return await Produto.create(produto);
}

export async function criarPedido(novoPedido) {
  try {
    const pedido = await Pedido.create({
      valor_total: novoPedido.valorTotal,
      estado: "ENCAMINHADO"
    });

    for (const prod of novoPedido.produtos) {
      const produto = await Produto.findByPk(prod.id);
      if (produto) {
        console.log("Adicionando produto ao pedido:", produto.nome);
        await pedido.addProduto(produto, {
          through: {
            quantidade: prod.quantidade,
            preco: produto.preco
          }
        });
      }
    }

    console.log("Pedido criado com sucesso!");
    return pedido;
  } catch (erro) {
    console.log("Erro ao criar pedido:", erro);
    throw erro;
  }
}

export async function lerPedidos() {
  try {
    const resultado = await produtosPedido.findAll({ raw: true });
    console.log("Produtos em pedidos:", resultado);
    return resultado;
  } catch (erro) {
    console.log("Erro ao consultar pedidos:", erro);
    throw erro;
  }
}
