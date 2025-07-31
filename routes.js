// Importa o módulo de sistema de arquivos do Node.js (não está sendo usado nesse código)
import fs from "fs";

// Importa o Sequelize e as funções de manipulação de produtos
import {
    sequelize,
    criarProduto,
    lerProdutos,
    lerProdutosPorID,
    atualizarProdutoPorID,
    deletarProdutoPorID
} from "./models.js";

// Função principal de roteamento para tratar as requisições HTTP
export default async function rotas(req, res, dado) {
    // Define o cabeçalho da resposta como JSON com codificação UTF-8
    res.setHeader("Content-Type", "application/json", "utf-8");

    // Rota GET: retorna uma mensagem padrão da raiz "/"
    if (req.method === "GET" && req.url === "/") {
        const { conteudo } = dado; // Extrai o conteúdo enviado na chamada da função

        res.statusCode = 200; // Código de sucesso

        const resposta = {
            mensagem: conteudo // Monta objeto com a mensagem
        };

        res.end(JSON.stringify(resposta)); // Envia a resposta convertida em JSON
        return;
    }

    // Rota POST: cria um novo produto
    if (req.method === "POST" && req.url === "/produtos") {
        const corpo = []; // Array para armazenar os dados da requisição

        // Evento que ocorre ao receber parte dos dados
        req.on("data", (parte) => {
            corpo.push(parte); // Armazena cada pedaço do corpo
        });

        // Evento que ocorre quando a requisição é finalizada
        req.on("end", async () => {
            const produto = JSON.parse(corpo); // Concatena e transforma em objeto

            res.statusCode = 400; // Status padrão de erro

            // Validação: nome é obrigatório
            if (!produto?.nome) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo "nome" não foi encontrado, porém é obrigatório para a criação do produto`
                    }
                };
                res.end(JSON.stringify(resposta));
                return;
            }

            // Validação: preço é obrigatório
            if (!produto?.preco) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo "preco" não foi encontrado, porém é obrigatório para a criação do produto`
                    }
                };
                res.end(JSON.stringify(resposta));
                return;
            }

            try {
                // Tenta criar o produto usando a função do model
                const resposta = await criarProduto(produto);

                res.statusCode = 201; // Criado com sucesso
                res.end(JSON.stringify(resposta)); // Retorna a resposta

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

                res.end(JSON.stringify(resposta));
                return;
            }
        });

        // Tratamento de erro no recebimento de dados
        req.on("error", (erro) => {
            console.log("Falha ao processar requisição", erro);
            res.statusCode = 400;

            const resposta = {
                erro: {
                    mensagem: "Falha ao processar requisição"
                }
            };

            res.end(JSON.stringify(resposta));
            return;
        });

        return;
    }

    // Rota PATCH: atualiza um produto por ID (ex: /produtos/1)
    if (
        req.method === "PATCH" &&
        req.url.split("/")[1] === "produtos" &&
        !isNaN(req.url.split("/")[2]) // verifica se o ID é um número
    ) {
        const corpo = [];

        req.on("data", (parte) => {
            corpo.push(parte);
        });

        req.on("end", async () => {
            const produto = JSON.parse(corpo); // Converte os dados recebidos

            res.statusCode = 400;

            // Validação: ao menos um campo (nome ou preço) deve ser informado
            if (!produto?.nome && !produto.preco) {
                const resposta = {
                    erro: {
                        mensagem: `Nenhum atributo foi encontrado, porém é obrigatório pelo menos um para a atualização do produto`
                    }
                };
                res.end(JSON.stringify(resposta));
                return;
            }

            const id = req.url.split("/")[2]; // Extrai o ID da URL

            try {
                // Tenta atualizar o produto pelo ID
                const resposta = await atualizarProdutoPorID(id, produto);

                res.statusCode = 200; // Sucesso

                if(!resposta){
                    res.statusCode = 404;
                }
                res.end(JSON.stringify(resposta));
                return;
            } catch (erro) {
                console.log("Falha ao atualizar produto", erro);
                res.statusCode = 500;

                const resposta = {
                    erro: {
                        mensagem: `Falha ao atualizar produto ${produto.nome}`
                    }
                };

                res.end(JSON.stringify(resposta));
                return;
            }
        });

        // Erro ao processar a requisição
        req.on("error", (erro) => {
            console.log("Falha ao processar requisição", erro);
            res.statusCode = 400;

            const resposta = {
                erro: {
                    mensagem: "Falha ao processar requisição"
                }
            };

            res.end(JSON.stringify(resposta));
            return;
        });

        return;
    }

    // Rota DELETE: remove produto por ID (ex: /produtos/1)
    if (
        req.method === "DELETE" &&
        req.url.split("/")[1] === "produtos" &&
        !isNaN(req.url.split("/")[2]) // verifica se é número
    ) {
        const id = req.url.split("/")[2]; // Extrai o ID da URL

        try {
            // Tenta deletar o produto
            const encontrado = await deletarProdutoPorID(id);

            res.statusCode = 204; // No Content — sucesso sem conteúdo de resposta

            if(!encontrado){
                res.statusCode = 404;
            }

            res.end();
        
            return;
        } catch (erro) {
            console.log("Falha ao remover produto", erro);
            res.statusCode = 500;

            const resposta = {
                erro: {
                    mensagem: `Falha ao deletar produto ${id}`
                }
            };

            res.end(JSON.stringify(resposta));

            return;
        }
    }

    if (
        req.method === "GET" &&
        req.url.split("/")[1] === "produtos" &&
        !isNaN(req.url.split("/")[2]) // verifica se é número
    ) {
        const id = req.url.split("/")[2]; // Extrai o ID da URL

        try {
            // Tenta ler o produto
            const resposta= await lerProdutosPorID(id);

            res.statusCode = 200; // No Content — sucesso sem conteúdo de resposta
        
            if(!resposta){
                res.statusCode = 404;
            }
            
            res.end(JSON.stringify(resposta));
        
            return;
        } catch (erro) {
            console.log("Falha ao buscar produto", erro);
            res.statusCode = 500;

            const resposta = {
                erro: {
                    mensagem: `Falha ao buscar produto ${id}`
                }
            };

            res.end(JSON.stringify(resposta));

            return;
        }
    }

    if (
        req.method === "GET" &&
        req.url === "/produtos"
    ) {

        try {
            // Tenta ler o produto
            const resposta = await lerProdutos();

            res.statusCode = 200; // No Content — sucesso sem conteúdo de resposta
        
            res.end(JSON.stringify(resposta));
        
            return;
        } catch (erro) {
            console.log("Falha ao buscar produtos", erro);
            res.statusCode = 500;

            const resposta = {
                erro: {
                    mensagem: `Falha ao buscar produtos`
                }
            };

            res.end(JSON.stringify(resposta));

            return;
        }
    }
    // Caso a rota não seja encontrada, retorna erro 404
    res.statusCode = 404;

    const resposta = {
        erro: {
            mensagem: "Rota não encontrada",
            url: req.url
        }
    };

    res.end(JSON.stringify(resposta));
}
