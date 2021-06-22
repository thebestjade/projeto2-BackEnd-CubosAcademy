const axios = require("axios");
const { lerArquivo, escreverNoArquivo } = require("../bibliotecaFS");

const modificarQuantidadeNoCarrinho = async (req, res) => {
  const arquivoLido = await lerArquivo();
  const carrinho = arquivoLido.carrinho;
  const produtos = arquivoLido.produtos;

  const idProduto = req.params.idProduto;
  const { quantidade } = req.body;

  const produtoAchadoNoCarrinho = carrinho.produtos.find(
    (produto) => produto.id === Number(idProduto)
  );
  const produtoOriginal = produtos.find(
    (produto) => produto.id === Number(idProduto)
  );

  if (produtoAchadoNoCarrinho) {
    if (produtoOriginal.estoque >= quantidade) {

      produtoAchadoNoCarrinho.quantidade += quantidade;
      
      carrinho.subtotal += Number((produtoAchadoNoCarrinho.preco * quantidade).toFixed(2));
      carrinho.subtotal = Number(carrinho.subtotal.toFixed(2));

      if (carrinho.subtotal <= 200) {
        carrinho.valorDoFrete = 50;
      } else {
        carrinho.valorDoFrete = 0;
      }

      carrinho.totalAPagar = carrinho.subtotal + carrinho.valorDoFrete;
      carrinho.totalAPagar = Number(carrinho.totalAPagar.toFixed(2));

      await escreverNoArquivo({ produtos, carrinho });

      res.json(carrinho);
    } else {
      res.json("Produto sem estoque");
    }
  }
  res.json("Produto não encontrado");
};

module.exports = {
  modificarQuantidadeNoCarrinho,
};
