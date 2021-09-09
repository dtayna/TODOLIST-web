//formulário Nova Tarefa
var inputDescricao = document.getElementById("descricao_tarefa");
var inputResponsavel = document.getElementById("responsavel_tarefa");
var inputPrazo = document.getElementById("prazo_tarefa");
var inputPrioridade = document.getElementById("prioridade_tarefa");

var botaoAdicionar = document.getElementById("adicionarTarefa");

var validaData = function(inPrazo){
	if(inPrazo.length != 10){
		return false;
	}else if(inPrazo[2]!='/' || inPrazo[5]!='/'){
		return false;
	}else if(isNaN(inPrazo[0])||isNaN(inPrazo[1])|| isNaN(inPrazo[3])||isNaN(inPrazo[4])|| isNaN(inPrazo[6])|| isNaN(inPrazo[7])||isNaN(inPrazo[8])||isNaN(inPrazo[9])){
		return false;
	}
		var d = parseInt(inPrazo.substring(0,2));
		var m = parseInt(inPrazo.substring(3,5));
		
	if (d>29 && m==2){
		return false;
	}else if(d>30 && m!=1 && m!=3 && m!=5 && m!=7 && m!=8 && m!=10 && m!=12){
		return false;
	}else if(d>31 || d<=0 || m>12 || m<=0){
		return false;
	}
	return true;

}

var validaForm = function(inDesc,inResp,inPrazo){
	if(inDesc == "" || inResp=="" || inPrazo==""){
			alert("Existem campos vazios que precisam ser preenchidos");
			return false;
	}else if(validaData(inPrazo)==false){
			alert("Campo prazo preenchido com valor inválido! Use o formato DD/MM/AAAA");
			return false;
	}
	return true;
}


var novaTarefa = function(){
	console.log("Cliquei para adicionar...");
	if (validaForm(inputDescricao.value,inputResponsavel.value,inputPrazo.value)){
		var listaItem = criarListaItem(inputDescricao.value.toUpperCase(),inputResponsavel.value,inputPrazo.value,inputPrioridade.value,0,inputPrazo.value);
		addListaAFazer(listaItem);
		ajaxRequest_gravarTarefas();
	}
}


//Auxilia nas modificações Feita X desfeita
var detalhesFeita = function(itemFeito, feita, descricao, conclusao){
	if(feita == 1){
		itemFeito.check = "<input class=\"chk_todo\" type=\"checkbox\" onclick=\"desfazerTarefa(this)\" checked>";
		itemFeito.desc = "<div class=\"w3-col s10 m10 l10\"> <font color=\"#20B2AA\"><b><s>"+descricao+"</s></b></font></div>";
		itemFeito.concl = "<div class=\"w3-col s7 m7 l7 small_font_todo\" style=\"margin-top:15px;\"><font color=\"#A9A9A9\">"+conclusao+"</font></div>";
	}
	return itemFeito;
}


//Criar item das listas
var criarListaItem = function (descricao, responsavel, prazo, prioridade, feita, conclusao){ 
	
	var itemFeito = {
	check: "<input class=\"chk_todo\" type=\"checkbox\" onclick=\"fazerTarefa(this)\">",
	desc: "<div class=\"w3-col s10 m10 l10\"> <font color=\"#20B2AA\"><b>" + descricao + "</b></font></div>",
	concl: "<div class=\"w3-col s7 m7 l7 small_font_todo hidden_todo\" style=\"margin-top:15px;\"><font color=\"#A9A9A9\">"+ conclusao+"</font></div>"
	}
	
	itemFeito = detalhesFeita(itemFeito, feita, descricao, conclusao);
	
	var listaItem = document.createElement("div");
	listaItem.className = "w3-row list_item_todo w3-border-left w3-border-bottom w3-border-right";
	listaItem.style = "margin-top:5px";
	listaItem.innerHTML = 
					"<div class=\"w3-col s2 m2 l2\">"+ 
						itemFeito.check+
					"</div>"+
					"<div class=\"w3-col s10 m10 l10 w3-border-left \">"+
					"<div class=\"w3-row list_item_todo\">"+
						"<div class=\"w3-col s1 m1 l1 hidden_todo\">.</div>"+
						itemFeito.desc+
						"<div class=\"w3-col s1 m1 l1\">"+
							"<img src=\"imagens/"+ prioridade +".png\" class=\"prioridade_todo\" alt=\""+ prioridade +"\" title=\"Prioridade "+ prioridade +"!\">"+
						"</div>"+
					"</div>"+
					"<div class=\"w3-row small_font_todo w3-border-bottom\">"+
						"<div class=\"w3-col s1 m1 l1 hidden_todo\">.</div>"+
						"<div class=\"w3-col s6 m6 l6\"> <font color=\"#A9A9A9\">"+ responsavel +"</font> </div>"+
						"<div class=\"w3-col s5 m5 l5\"> <font color=\"#20B2AA\"> Prazo: "+ prazo +" </font> </div>"+
					"</div>"+
					"<div class=\"w3-row w3-border-bottom\"> "+
					"<div class=\"w3-col s1 m1 l1 hidden_todo\">.</div>"+
						itemFeito.concl+
					"<div class=\"w3-col s2 m2 l2\"> "+
						"<img src=\"imagens/remove-xxl.png\" class=\"remove_todo\" alt=\"Norway\" onclick=\"removeTarefa(this)\">"+
					"</div>"+
					"<div class=\"w3-col s2 m2 l2\">"+
						"<img src=\"imagens/edit-xxl.png\" class=\"remove_todo\" alt=\"Norway\" onclick=\"editaTarefa(this,"+feita+")\">"+
					"</div>"+
					"</div>"+
					"</div>";
	
	return listaItem;
};

//cria os objetos a partir das listas a fazer
var pegaAtributos1 = function(item){
	
	var tarefa = {
		descricao: item.children[1].children[0].children[1].children[0].children[0].innerText,
		responsavel: item.children[1].children[1].children[1].children[0].innerText,
		prazo: item.children[1].children[1].children[2].children[0].innerText.substr(7),
		prioridade: item.children[1].children[0].children[2].children[0].alt,
		conclusao:"",
		feita:0
	}	
	return tarefa;
}

//cria os objetos a partir das listas feitas
var pegaAtributos2 = function(item){	
	var tarefa = {
		descricao: item.children[1].children[0].children[1].children[0].children[0].children[0].innerText,
		responsavel: item.children[1].children[1].children[1].children[0].innerText,
		prazo: item.children[1].children[1].children[2].children[0].innerText.substr(7),
		prioridade: item.children[1].children[0].children[2].children[0].alt,
		conclusao:item.children[1].children[2].children[1].children[0].innerText,
		feita:1
	}
	return tarefa;
}


//pega a data de conclusao
var dataConclusao = function(){
	var dataC = new Date();
	var dia = String(dataC.getDate()).padStart(2, '0');
	var mes = String(dataC.getMonth() + 1).padStart(2, '0');
	var ano = dataC.getFullYear();
	
	var conclusao = dia + '/' + mes + '/' + ano;
	return conclusao;
	
}

//checar tarefa como feita
var fazerTarefa = function(checkFazer){
		var itemFazer = checkFazer.parentNode.parentNode;
		var listaRemocao = itemFazer.parentNode;
		listaRemocao.removeChild(itemFazer);
		var t = pegaAtributos1(itemFazer);
		var i = criarListaItem(t.descricao,t.responsavel,t.prazo,t.prioridade,1,dataConclusao());
		addListaFeita(i);
		ajaxRequest_gravarTarefas();
}


//checa tarefa como desfeita
var desfazerTarefa = function(checkFazer){
		var itemFazer = checkFazer.parentNode.parentNode;
		var listaRemocao = itemFazer.parentNode;
		listaRemocao.removeChild(itemFazer);
		var t = pegaAtributos2(itemFazer);
		var i = criarListaItem(t.descricao,t.responsavel,t.prazo,t.prioridade,0,t.prazo);
		addListaAFazer(i);
		ajaxRequest_gravarTarefas();
}

//remove tarefa das listas
var removeTarefa = function(botaoRemove){
		var confirmacao = confirm("Tem certeza que deseja remover esta tarefa?");
        if (confirmacao == true) {
			var itemRemocao = botaoRemove.parentNode.parentNode.parentNode.parentNode;
			console.log("achei o item");
			var listaRemocao = itemRemocao.parentNode;
			listaRemocao.removeChild(itemRemocao);
			ajaxRequest_gravarTarefas();
        }		
}


//edita tarefa das listas
var editaTarefa = function(botaoEdita, feita){
		var itemEdita = botaoEdita.parentNode.parentNode.parentNode.parentNode;
		var tarefa;
		if(feita==1){
			tarefa = pegaAtributos2(itemEdita);
		}else{
			tarefa = pegaAtributos1(itemEdita);
		}
		document.getElementById("e_descricao_tarefa").value = tarefa.descricao;
		document.getElementById("e_responsavel_tarefa").value = tarefa.responsavel;
		document.getElementById("e_prazo_tarefa").value = tarefa.prazo;
		document.getElementById("e_prioridade_tarefa").value = tarefa.prioridade;
		itemEdita.id ="itemEdita";
		document.getElementById("editarTarefa").setAttribute("onclick",  "salvarEdicao(\"itemEdita\","+feita+")");
		document.getElementById("cancelaEdicao").setAttribute("onclick",  "cancelaEdicao(\"itemEdita\")");
		var popup = document.getElementById("editpopup");
		popup.style.display = "block";
}


//salva edicao
var salvarEdicao = function(id,feita){
	console.log("cliquei pra salvar"+id);
	var e_inDesc = document.getElementById("e_descricao_tarefa").value;
	var e_inResp = document.getElementById("e_responsavel_tarefa").value;
	var e_inPrazo = document.getElementById("e_prazo_tarefa").value;
	
	var item = document.getElementById(id);
	if(validaForm(e_inDesc,e_inResp,e_inPrazo)){
		
		if(feita==1){
			item.children[1].children[0].children[1].children[0].children[0].children[0].innerText = e_inDesc.toUpperCase();
			item.children[1].children[1].children[1].children[0].innerText = e_inResp;
			item.children[1].children[1].children[2].children[0].innerText = "Prazo: "+e_inPrazo;
			item.children[1].children[0].children[2].children[0].alt = document.getElementById("e_prioridade_tarefa").value;
			item.children[1].children[0].children[2].children[0].src = "imagens/"+document.getElementById("e_prioridade_tarefa").value+".png";
			item.children[1].children[0].children[2].children[0].title = "Prioridade "+ document.getElementById("e_prioridade_tarefa").value +"!";
		}else{
			item.children[1].children[0].children[1].children[0].children[0].innerText =e_inDesc.toUpperCase();
			item.children[1].children[1].children[1].children[0].innerText = e_inResp;
			item.children[1].children[1].children[2].children[0].innerText = "Prazo: "+e_inPrazo;
			item.children[1].children[0].children[2].children[0].alt = document.getElementById("e_prioridade_tarefa").value;
			item.children[1].children[0].children[2].children[0].src = "imagens/"+document.getElementById("e_prioridade_tarefa").value+".png";
			item.children[1].children[0].children[2].children[0].title = "Prioridade "+ document.getElementById("e_prioridade_tarefa").value +"!";
		}
		
		item.id="";
		document.getElementById("editpopup").style.display = "none";
		
		ajaxRequest_gravarTarefas();
	}

}

//cancela edição tarefa das listas
var cancelaEdicao = function(id){
		var item = document.getElementById(id);
		item.id="";
		var popup = document.getElementById("editpopup");
		popup.style.display = "none";
		console.log("cancelei edição");
}


//adiciona item na lista A FAZER
var addListaAFazer = function (listaItem){
	var listaAFazer = document.getElementById("lista_afazer");
	listaAFazer.appendChild(listaItem);
};


//adiciona item na lista FEITA
var addListaFeita = function (listaItem){
	var listaFeita = document.getElementById("lista_feita");
	listaFeita.appendChild(listaItem);
};


var eventoCarregar = function(){
	console.log("evento carregar foi disparado");
	ajaxRequest_carregarTarefas();
	ajaxRequest_carregarResponsaveis();
	//ajaxRequest_gravarTarefas();
	
};


var carregaTarefas = function(data){
	for (i=0; i < data.length; i++) {
        var item = criarListaItem(data[i].descricao,data[i].responsavel,data[i].prazo,data[i].prioridade,data[i].feita,data[i].conclusao);
		if(data[i].feita == 1){
			addListaFeita(item);
		}else{
			addListaAFazer(item);
		}
    }
}

var carregaResponsaveis =function(data, id){
	for (i=0; i < data.length; i++) {
		var r = data[i].nome + " " + data[i].email;
		var responsavel = document.createElement("option");
		responsavel.value = r;
		responsavel.innerHTML = r;
		var selectResp = document.getElementById(id);
		selectResp.appendChild(responsavel);
    }
}

//chamado em adicionar, chamado em carregar
var criaJsonTarefas = function(){
	var listas = [];
	var data1 = document.getElementById("lista_afazer");
	for (i=0; i < data1.children.length; i++) {
		listas.push(pegaAtributos1(data1.children[i]));	
	}
	var data2 = document.getElementById("lista_feita");
	for (i=0; i < data2.children.length; i++) {
		listas.push(pegaAtributos2(data2.children[i]));
	}
	
	var json = JSON.stringify(listas);
	console.log(json);
	return json;
}




function ajaxRequest_carregarTarefas() {
	//Cria a requisição para o servidor
    var tarefaRequest = new XMLHttpRequest();
    tarefaRequest.open('GET', 'http://localhost:8080/carregarTarefas',true);
    tarefaRequest.onload = function() {
        console.log("Conectou... Status: "+tarefaRequest.status);
        if (tarefaRequest.status >= 200 && tarefaRequest.status < 400) {
            var listaTarefas = JSON.parse(tarefaRequest.responseText);
			carregaTarefas(listaTarefas);
        } else {
            console.log("Servidor ativo, mas ocorreu um erro!");
        }
    };
	
    tarefaRequest.onerror = function() {
        console.log("Erro de conexão");
    }
    tarefaRequest.send();  
}

function ajaxRequest_carregarResponsaveis() {
	//Cria a requisição para o servidor
    var responsaveisRequest = new XMLHttpRequest();
    responsaveisRequest.open('GET', 'http://localhost:8080/carregarResponsaveis',true);
    responsaveisRequest.onload = function() {
        console.log("Conectou... Status: "+responsaveisRequest.status);
        if (responsaveisRequest.status >= 200 && responsaveisRequest.status < 400) {
            var listaResponsaveis = JSON.parse(responsaveisRequest.responseText);
			carregaResponsaveis(listaResponsaveis,"responsavel_tarefa");
			carregaResponsaveis(listaResponsaveis,"e_responsavel_tarefa");
        } else {
            console.log("Servidor ativo, mas ocorreu um erro!");
        }
    };
	
    responsaveisRequest.onerror = function() {
        console.log("Erro de conexão");
    }
    responsaveisRequest.send();  
}

function ajaxRequest_gravarTarefas() {
	//Cria a requisição para o servidor
	console.log("chegou na ajax de gravar");
    var gravarRequest = new XMLHttpRequest();
	
    gravarRequest.open('POST', 'http://localhost:8080/gravarTarefas',true);
	gravarRequest.setRequestHeader("Content-Type","application/json");
    gravarRequest.onload = function() {
        console.log("Conectou... Status: "+gravarRequest.status);
        if (gravarRequest.status >= 200 && gravarRequest.status < 400) {
				console.log("Servdior Gravou!");
        } else {
            console.log("Servidor ativo, mas ocorreu um erro!");
        }
    };
	
		gravarRequest.onerror = function() {
        console.log("Erro de conexão");
    }
	var s = criaJsonTarefas();
	console.log("send s +" + s);
    gravarRequest.send(s);  
}

//botaoAdicionar.addEventListener('click', novaTarefa, false);
window.addEventListener('load', eventoCarregar, false);