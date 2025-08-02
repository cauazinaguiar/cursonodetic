import express from "express";
// Importa o Sequelize e as funções de manipulação de produtos
import {
    sequelize,
    criarProduto,
    lerProdutos,
    lerProdutosPorID,
    atualizarProdutoPorID,
    deletarProdutoPorID
} from "./../models.js";


export const rotasProdutos = express.Router();

rotasProdutos.post("/produtos", async (req, res, next) => {
            const produto = req.body; // Concatena e transforma em objeto

            res.statusCode = 400; // Status padrão de erro

            // Validação: nome é obrigatório
            if (!produto?.nome) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo "nome" não foi encontrado, porém é obrigatório para a criação do produto`
                    }
                };
               res.send(resposta)
                return;
            }

            // Validação: preço é obrigatório
            if (!produto?.preco) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo "preco" não foi encontrado, porém é obrigatório para a criação do produto`
                    }
                };
               res.send(resposta)
                return;
            }

            try {
                // Tenta criar o produto usando a função do model
                const resposta = await criarProduto(produto);

                res.statusCode = 201; // Criado com sucesso
               res.send(resposta) // Retorna a resposta

                return;
            } catch (erro) {
                // Erro ao criar produto
                console.log("Falha ao criar produto", erro);
                res.statusCode = 500;

                const resposta = {
                    erro: {
                        mensagem: `Falha ao criar produto ${produto.nome}`
                    }
                };

               res.send(resposta)
                return;
            }
});

rotasProdutos.patch("/produtos/:id", async (req, res, next) => {
    const produto = req.body; // Converte os dados recebidos

            res.statusCode = 400;

            // Validação: ao menos um campo (nome ou preço) deve ser informado
            if (!produto?.nome && !produto.preco) {
                const resposta = {
                    erro: {
                        mensagem: `Nenhum atributo foi encontrado, porém é obrigatório pelo menos um para a atualização do produto`
                    }
                };
               res.send(resposta)
                return;
            }

            const id = req.params.id; // Extrai o ID da URL

            try {
                // Tenta atualizar o produto pelo ID
                const resposta = await atualizarProdutoPorID(id, produto);

                res.statusCode = 200; // Sucesso

                if(!resposta){
                    res.statusCode = 404;
                }
               res.send(resposta)
                return;
            } catch (erro) {
                console.log("Falha ao atualizar produto", erro);
                res.statusCode = 500;

                const resposta = {
                    erro: {
                        mensagem: `Falha ao atualizar produto ${id}`
                    }
                };

               res.send(resposta)
                return;
            }
});

rotasProdutos.delete("/produtos/:id", async (req, res, next) => {
    const id = req.params.id; // Extrai o ID da URL

        try {
            // Tenta deletar o produto
            const encontrado = await deletarProdutoPorID(id);

            res.statusCode = 204; // No Content — sucesso sem conteúdo de resposta

            if(!encontrado){
                res.statusCode = 404;
            }

            res.send();
        
            return;
        } catch (erro) {
            console.log("Falha ao remover produto", erro);
            res.statusCode = 500;

            const resposta = {
                erro: {
                    mensagem: `Falha ao deletar produto ${id}`
                }
            };

            res.send(resposta);

            return;
        }
});

rotasProdutos.get("/produtos/:id", async (req, res, next) => {
    const id = req.params.id // Extrai o ID da URL

        try {
            // Tenta ler o produto
            const resposta= await lerProdutosPorID(id);

            res.statusCode = 200; // No Content — sucesso sem conteúdo de resposta
        
            if(!resposta){
                res.statusCode = 404;
            }
            
            res.send(resposta);
        
            return;
        } catch (erro) {
            console.log("Falha ao buscar produto", erro);
            res.statusCode = 500;

            const resposta = {
                erro: {
                    mensagem: `Falha ao buscar produto ${id}`
                }
            };

            res.send(resposta);

            return;
        }
});

rotasProdutos.get("/produtos", async (req, res, next) => {
    try {
            // Tenta ler o produto
            const resposta = await lerProdutos();

            res.statusCode = 200; // No Content — sucesso sem conteúdo de resposta
        
            res.send(resposta);
        
            return;
        } catch (erro) {
            console.log("Falha ao buscar produtos", erro);
            res.statusCode = 500;

            const resposta = {
                erro: {
                    mensagem: `Falha ao buscar produtos`
                }
            };

            res.send(resposta);

            return;
        }
});
