const axios = require("axios");
const { lerArquivo, escreverNoArquivo } = require("../bibliotecaFS");

const deletarProdutoDoCarrinho = async (req, res) => {
  const arquivoLido = await lerArquivo();
  const carrinho = arquivoLido.carrinho;
  const produtos = arquivoLido.produtos;
  const idProduto = req.params.idProduto;

  let produtoEncontrado = "";

  if (!isNaN(idProduto)) {
    produtoEncontrado = carrinho.produtos.find(
      (produto) => produto.id === Number(idProduto)
    );

    if (produtoEncontrado) {
      const produtosPermanecentesNoCarrinho = carrinho.produtos.filter(
        (produto) => Number(idProduto) !== produto.id
      );
      if (produtosPermanecentesNoCarrinho.length >= 1) {
        carrinho.produtos = [...produtosPermanecentesNoCarrinho];
        carrinho.subtotal -= Number(
          (produtoEncontrado.preco * produtoEncontrado.quantidade).toFixed(2)
        );
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
        carrinho.produtos = [...produtosPermanecentesNoCarrinho];
        carrinho.subtotal = 0;
        carrinho.dataDeEntrega = null;
        carrinho.valorDoFrete = 0;
        carrinho.totalAPagar = 0;

        await escreverNoArquivo({ produtos, carrinho });
        res.json(carrinho);
      }
    } else {
      res.json("Item não encontrado no carrinho");
    }
  } else {
    res.json("O id precisa ser um número");
  }
};

module.exports = {
  deletarProdutoDoCarrinho,
};
