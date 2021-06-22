const axios = require("axios");
const { lerArquivo, escreverNoArquivo } = require("../bibliotecaFS");

const listarProdutos = async (req, res) => {
  const arquivoLido = await lerArquivo();
  let produtos = arquivoLido.produtos;
  const { categoria, precoInicial, precoFinal } = req.query;

  if (categoria) {
    if (precoInicial && precoFinal) {
      const produtosPrecoECategoria = produtos.filter(
        (produto) =>
          produto.categoria === categoria &&
          produto.preco >= precoInicial &&
          produto.preco <= precoFinal
      );

      if (produtosPrecoECategoria.length === 0) {
        res.json(
          "Nenhum produto da categoria informada está nessa faixa de preço"
        );
      }
      return res.json(produtosPrecoECategoria);
    }

    const produtosPorCategoria = produtos.filter(
      (produto) => produto.categoria === categoria
    );

    if (produtosPorCategoria.length === 0) {
      res.json("Nenhum produto desta categoria disponível");
    }
    return res.json(produtosPorCategoria);
  }

  if (precoInicial && precoFinal) {
    const produtosNaFaixaDePreco = produtos.filter(
      (produto) => produto.preco >= precoInicial && produto.preco <= precoFinal
    );

    if (produtosNaFaixaDePreco.length === 0) {
      res.json("Nenhum produto nesta faixa de preço disponível");
    }
    return res.json(produtosNaFaixaDePreco);
  }

  const produtosComEstoque = produtos.filter(
    (produto) => produto.estoque !== 0
  );

  if (produtosComEstoque.length === 0) {
    res.json("Nenhum produto disponível");
  }

  return res.json(produtosComEstoque);
};

module.exports = {
  listarProdutos,
};
