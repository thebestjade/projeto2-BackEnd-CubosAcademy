const axios = require("axios");
const instanciaAxios = require('../servicos/pagarme')
const { lerArquivo, escreverNoArquivo } = require("../bibliotecaFS");

const finalizarCompra = async (req, res) => {
    const arquivoLido = await lerArquivo();
    const carrinho = arquivoLido.carrinho;
    const produtos = arquivoLido.produtos;
    const {type, country, name, documents} = req.body;
    const arrayNome = name.split(' ');
    const compra = { ...carrinho};
    let compraValida = true;
    
    //documents.type e documents.number
    try {

        if(carrinho.produtos.length > 0){
            
            for(let produto of carrinho.produtos){
    
                const produtoOriginal = produtos.find(produtoOriginal => produtoOriginal.id === produto.id);
    
                if(produtoOriginal.estoque >= produto.quantidade ){
                    
                    produtoOriginal.estoque -= produto.quantidade;
    
                }else{
                    res.json(`Produto ${produtoOriginal.nome} sem estoque. Retirar do carrinho para continuar.`)
                }
            }

            if(type !== "individual"){
                res.json("Este e-commerce só atende pessoas físicas")
                compraValida = false;
            }
            if(country.length !== 2 ){
                res.json("O campo deve possuir dois dígitos")
                compraValida = false;   
            }
            if(arrayNome.length < 2){
                res.json("O campo deve ser preenchido, pelo menos, com nome e sobrenome")
                compraValida = false;   
            }
            documents.map(documento => {
                
                if(documento.type !== "cpf"){
                    res.json("O documento tem que ser cpf") 
                    compraValida = false;   
                }
                if(!isNaN(documento.number)){
                    if((documento.number + '').length !== 11){
                        res.json("O campo deve possuir onze dígitos")
                        compraValida = false;   
                    }
                }else{
                    res.json("O campo deve ser preenchido apenas com números")
                    compraValida = false;
                }
            })
            if(compraValida){

                carrinho.produtos = [];
                carrinho.subtotal = 0;
                carrinho.dataDeEntrega = null;
                carrinho.valorDoFrete = 0;
                carrinho.totalAPagar = 0;
    
                await escreverNoArquivo({produtos, carrinho});
                res.status(200)
                res.json(compra);
            }
    
        }else{
            res.json("Carrinho vazio")
        }
    } catch (error) {
        res.json(error)
    }

}
module.exports = {
    finalizarCompra
}