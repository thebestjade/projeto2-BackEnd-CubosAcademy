const axios = require("axios");
const { lerArquivo } = require("../bibliotecaFS");

const exibirCarrinho = async (req,res) => {
    const arquivoLido = await lerArquivo();
    let carrinho = arquivoLido.carrinho;
    const produtos = arquivoLido.produtos;

    res.json(carrinho)

}

module.exports = { exibirCarrinho };