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

export async function atualizarProdutoPorID(id, dadosProduto) {
  try {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return null;
    }

    if (dadosProduto.nome) {
      produto.nome = dadosProduto.nome;
    }

    if (dadosProduto.preco) {
      produto.preco = dadosProduto.preco;
    }

    await produto.save();
    console.log("Produto atualizado com sucesso:", produto);

    return produto;
  } catch (erro) {
    console.log("Erro ao atualizar produto:", erro);
    throw erro;
  }
}


export async function deletarProdutoPorID(id) {
  try {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return false;
    }

    await produto.destroy();
    console.log("Produto deletado com sucesso:", produto.nome);
    return true;
  } catch (erro) {
    console.log("Erro ao deletar produto:", erro);
    throw erro;
  }
}

export async function lerProdutos() {
  try {
    const produtos = await Produto.findAll({ raw: true });
    console.log("Produtos encontrados:", produtos);
    return produtos;
  } catch (erro) {
    console.log("Erro ao buscar produtos:", erro);
    throw erro;
  }
}


export async function lerProdutosPorID(id) {
  try {
    const produto = await Produto.findByPk(id, { raw: true });
    console.log(`Produto com ID ${id}:`, produto);
    return produto;
  } catch (erro) {
    console.log("Erro ao buscar produto por ID:", erro);
    throw erro;
  }
}

export async function lerPedidoPorID(id) {
  try {
    const pedido = await Pedido.findByPk(id, {
      include: {
        model: Produto,
        through: {
          attributes: ["quantidade", "preco"] // Campos extras da tabela de junção
        }
      }
    });

    if (!pedido) return null;

    // Converte para objeto limpo e imprime no terminal
    const resultado = pedido.toJSON();
    console.log(`Pedido com ID ${id}:`, resultado);

    return resultado;
  } catch (erro) {
    console.log("Erro ao buscar pedido por ID:", erro);
    throw erro;
  }
}
