const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');

//usar recursos estáticos
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//envia arquivo página principal: index.html
app.get("/", function(req,res){
	res.sendFile( __dirname + "/" + "public/index.html" );
});

//rota para carregar tarefas json
app.get("/carregarTarefas", function(req,res){
	console.log("Requisição tarefa chegou no servidor");
	res.sendFile(__dirname + "/" + "public/tarefas.json"); 
});

//rota para carregar responsaveis no select
app.get("/carregarResponsaveis", function(req,res){
	console.log("Requisição resp chegou no servidor");
	res.sendFile(__dirname + "/" + "public/responsaveis.json"); 
});



//rota para carregar responsaveis geral
app.get("/carregarResponsaveis_r", function(req,res){
	console.log("Requisição resp chegou no servidor");
	res.sendFile(__dirname + "/" + "public/responsaveis.json"); 
});


//rota para gravar resps
app.post("/gravarResp", function(req,res){
	var data =  JSON.stringify(req.body);
	fs.writeFile(__dirname + "/" + "public/responsaveis.json", data, (err) => {
		if (err) throw err;
		console.log('Dado escrito');
	});
	res.json(req.body);
});


//rota para gravar tarefas
app.post("/gravarTarefas", function(req,res){
	var data =  JSON.stringify(req.body);
	fs.writeFile(__dirname + "/" + "public/tarefas.json", data, (err) => {
		if (err) throw err;
		console.log('Dado escrito');
	});
	res.json(req.body);
});



app.listen(8080, function(){
	console.log("Servidor na porta 8080");
});