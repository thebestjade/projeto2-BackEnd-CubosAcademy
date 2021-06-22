const express = require('express');
const { listarProdutos } = require('./controladores/listasTodosOsProdutos');
const { exibirCarrinho } = require('./controladores/exibirCarrinho');
const { adicionarProdutoNoCarrinho } = require('./controladores/adicionarProdutoNoCarrinho');
const { modificarQuantidadeNoCarrinho } = require('./controladores/modificarQuantidadeNoCarrinho');
const { deletarProdutoDoCarrinho } = require('./controladores/deletarProduto');
const { deletarTodosOsProdutosDoCarrinho } = require('./controladores/deletarTodosOsProdutosDoCarrinho');
const { finalizarCompra } = require('./controladores/finalizarCompra');


const rotas = express();

rotas.get('/produtos', listarProdutos);
rotas.get('/carrinho', exibirCarrinho);
rotas.post('/carrinho/produtos', adicionarProdutoNoCarrinho);
rotas.patch('/carrinho/produtos/:idProduto', modificarQuantidadeNoCarrinho);
rotas.delete('/carrinho/produtos/:idProduto', deletarProdutoDoCarrinho);
rotas.delete('/carrinho', deletarTodosOsProdutosDoCarrinho);
rotas.post('/carrinho/finalizar-compra', finalizarCompra);

module.exports = rotas;