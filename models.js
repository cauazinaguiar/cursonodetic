// Importa o módulo Sequelize, que é o ORM (Object Relational Mapper) para manipulação do banco de dados
import { Sequelize } from "sequelize";

// Cria uma instância do Sequelize, conectando ao banco SQLite chamado "tic.db"
export const sequelize = new Sequelize({
    dialect: "sqlite",     // Tipo do banco (neste caso, SQLite)
    storage: "./tic.db"    // Caminho onde o arquivo do banco será salvo
});

// Tenta autenticar a conexão com o banco de dados
sequelize.authenticate();

// Define um modelo chamado "Produto" com os seguintes campos:
export const Produto = sequelize.define("produto", {
    id: {
        type: Sequelize.INTEGER,     // Tipo inteiro
        primaryKey: true,            // Chave primária
        autoIncrement: true          // Autoincremento (incrementa automaticamente a cada novo registro)
    },
    nome: {
        type: Sequelize.STRING,      // Texto (string)
        allowNull: false,            // Campo obrigatório
        unique: true                 // Valor único (não pode ter dois produtos com o mesmo nome)
    },
    preco: {
        type: Sequelize.DOUBLE,      // Número decimal
        allowNull: false             // Campo obrigatório
    }
});

// Função para criar um novo produto no banco de dados
export async function criarProduto(produto) {
    try {
        // Usa o método `create` do Sequelize para inserir o produto no banco
        const resultado = await Produto.create(produto);
        console.log(`O ${resultado.nome} foi criado com sucesso`);
        return resultado; // Retorna o produto criado
    } catch (erro) {
        console.log("Erro ao criar o produto", erro);
        throw erro; // Lança o erro para tratamento posterior
    }
}

// Função para buscar todos os produtos no banco
export async function lerProdutos() {
    try {
        // Retorna todos os registros da tabela Produto
        const resultado = await Produto.findAll();
        console.log(`Produtos consultados com sucesso!`, resultado);
    } catch (erro) {
        console.log("Erro ao buscar os produtos", erro);
    }
}

// Função para buscar um produto específico pelo ID
export async function lerProdutosPorID(id) {
    try {
        // Busca um produto pela chave primária (PK)
        const resultado = await Produto.findByPk(id);
        console.log(`Produto consultado com sucesso!`, resultado);
    } catch (erro) {
        console.log("Erro ao buscar o produto", erro);
    }
}

// Função para atualizar um produto específico pelo ID
export async function atualizarProdutoPorID(id, dadosProduto) {
    try {
        // Atualiza os dados do produto onde o id for igual ao informado
        const resultado = await Produto.update(dadosProduto, { where: { id: id } });
        console.log(`Produto atualizado com sucesso!`, resultado);
        return resultado;
    } catch (erro) {
        console.log("Erro ao atualizar o produto", erro);
        throw erro; // Lança o erro para tratamento
    }
}

// Função para deletar um produto específico pelo ID
export async function deletarProdutoPorID(id) {
    try {
        // Remove o registro do banco onde o id for igual ao informado
        const resultado = await Produto.destroy({ where: { id: id } });
        console.log(`Produto deletado com sucesso!`, resultado);
    } catch (erro) {
        console.log("Erro ao deletar o produto", erro);
        throw erro;
    }
}
