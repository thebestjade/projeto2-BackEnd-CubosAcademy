const axios = require("axios");
const { addBusinessDays } = require('date-fns');
const { lerArquivo, escreverNoArquivo } = require("../bibliotecaFS");

const adicionarProdutoNoCarrinho = async (req, res) => {
  const arquivoLido = await lerArquivo();
  const carrinho = arquivoLido.carrinho;
  const produtos = arquivoLido.produtos;
  const { id, quantidade } = req.body;
  const produtoAchado = "";

  if(!isNaN(id) && !isNaN(quantidade)){
    
    const produtoAchado = produtos.find((produto) => id === produto.id);
    const produtoAchadoNoCarrinho = carrinho.produtos.find(produto => id === produto.id);

    if (produtoAchado) {

      if(produtoAchadoNoCarrinho){
        res.json(`O produto ${produtoAchadoNoCarrinho.nome} já está no carrinho, favor ir no endPoint 'modificarQuantidadeNoCarrinho'`);

      }else{

        if (produtoAchado.estoque >= quantidade) {
          const { estoque, ...produto } = produtoAchado;
          let total = 0;
          let data = + new Date()
          produto.preco /= 100;
          carrinho.produtos.push({ ...produto, quantidade });
    
          carrinho.subtotal += Number((produto.preco * quantidade).toFixed(2));
          carrinho.subtotal = Number(carrinho.subtotal.toFixed(2))
    
          carrinho.dataDeEntrega = addBusinessDays(data, 15);
    
            if(carrinho.subtotal <= 200){
              carrinho.valorDoFrete = 50;
            }else{
            carrinho.valorDoFrete = 0;
            }
        carrinho.totalAPagar = carrinho.subtotal + carrinho.valorDoFrete;
        carrinho.totalAPagar = Number(carrinho.totalAPagar.toFixed(2));
  
        await escreverNoArquivo({produtos, carrinho});
  
        res.json(carrinho);
        }else{
          res.json('Produto sem estoque');
        }
      }
    }else{
    res.json('Produto não encontrado');
    }
  }else{
      res.json('O id e a quantidade precisam ser números');
  }
  

};

module.exports = {
  adicionarProdutoNoCarrinho,
};
