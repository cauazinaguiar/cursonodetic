import express from "express";
import { criarPedido, lerPedidoPorID, lerPedidos } from "./../models.js";

export const rotasPedidos = express.Router();

rotasPedidos.post("/pedidos", async (req, res, next) => {
    const pedido = req.body;

    res.statusCode = 400;

    if(!pedido.produtos || !pedido.produtos.length) {   
        const reposta = {
            erro: {
                mensagem: `O atributo "produto" não foi encontrado ou está vazio, porém é obrigatório para a criação do pedido`
            }
        };
        return res.send(reposta);
    }
        if(!pedido.valorTotal || pedido.valorTotal <=0 ) {   
        const reposta = {
            erro: {
                mensagem: `O atributo "valorTotal" não foi encontrado ou é menor ou igual a zero, porém é obrigatório para a criação do pedido`
            }
        };
        return res.send(reposta);
    }

    try {
        const reposta = await criarPedido(pedido);
        res.status(201).send(reposta);
    }catch (erro) {
        console.log("Falha ao criar o pedido", erro);

        const resposta = {
            erro: {
                mensagem: "Falha ao criar pedido"
            }
        };
        res.status(500).send(resposta);
    }
});

rotasPedidos.get("/pedidos/:id", async (req, res, next) => {
     const id = req.params.id // Extrai o ID da URL
    
            try {
                // Tenta ler o produto
                const resposta= await lerPedidoPorID(id);
    
                res.statusCode = 200; // No Content — sucesso sem conteúdo de resposta
            
                if(!resposta){
                    res.statusCode = 404;
                }
                
                res.send(resposta);
            
                return;
            } catch (erro) {
                console.log("Falha ao buscar pedido", erro);
                res.statusCode = 500;
    
                const resposta = {
                    erro: {
                        mensagem: `Falha ao buscar pedido ${id}`
                    }
                };
    
                res.send(resposta);
    
                return;
            }
});

rotasPedidos.get("/pedidos", async (req, res, next) => {
    try {
                // Tenta ler o produto
                const resposta = await lerPedidos();
    
                res.statusCode = 200; // No Content — sucesso sem conteúdo de resposta
            
                res.send(resposta);
            
                return;
            } catch (erro) {
                console.log("Falha ao buscar pedidos", erro);
                res.statusCode = 500;
    
                const resposta = {
                    erro: {
                        mensagem: `Falha ao buscar pedidos`
                    }
                };
    
                res.send(resposta);
    
                return;
            }
});