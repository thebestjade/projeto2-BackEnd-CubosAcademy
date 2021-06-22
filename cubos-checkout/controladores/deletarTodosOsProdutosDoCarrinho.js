const axios = require('axios');
const { lerArquivo, escreverNoArquivo } = require("../bibliotecaFS");

const deletarTodosOsProdutosDoCarrinho = async (req, res) => {
    const arquivoLido = await lerArquivo();
    const carrinho = arquivoLido.carrinho;
    const produtos = arquivoLido.produtos;

    if(carrinho.produtos.length > 0){
        
        carrinho.produtos = [];
        carrinho.subtotal = 0;
        carrinho.dataDeEntrega = null;
        carrinho.valorDoFrete = 0;
        carrinho.totalAPagar = 0;

        await escreverNoArquivo({ produtos, carrinho});
        res.json(carrinho);
    }else{
        res.json("O carrinho já está vazio");
    }
}

module.exports = {
    deletarTodosOsProdutosDoCarrinho
}