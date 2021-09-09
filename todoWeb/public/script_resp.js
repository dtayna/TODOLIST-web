//formulário Nova Tarefa
var inputNome = document.getElementById("Nome_resp");
var inputEmail = document.getElementById("email_resp");
var inputNasc = document.getElementById("nasc_resp");
var inputTel = document.getElementById("tel_resp");

var botaoAdicionar = document.getElementById("adicionar_resp");

var validaData = function(inPrazo){
	console.log(inPrazo+" "+inPrazo.length);
	if(inPrazo.length != 10){
		console.log("1");
		return false;
	}else if(inPrazo[2]!='/' || inPrazo[5]!='/'){
		console.log("2");
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

var novoResp = function(){
	if(inputNome.value == ""){
		alert("É necessário informar ao menos o nome do Responsável!");
	}else if(inputNasc.value != ""){
		if(validaData(inputNasc.value)==false){
			alert("Campo Data de Nascimento preenchido com valor inválido! Use o formato DD/MM/AAAA");
		}else{
			var item = criaResp(inputNome.value, inputEmail.value, inputNasc.value, inputTel.value);
			var lista = document.getElementById("lista_responsaveis");
				lista.appendChild(item);
				ajaxRequest_gravarResp();
		}
	}
}


var eventoCarregar = function(){
	ajaxRequest_carregarResponsaveis_r();	
};

var pegaAtributos = function(item){
	var resp = {
		nome: item.children[0].children[0].children[0].children[0].children[0].innerText,
		email: item.children[0].children[0].children[1].innerText,
		nascimento: item.children[0].children[1].children[0].innerText,
		telefone: item.children[0].children[1].children[1].innerText,
		foto:""
	}
	return resp;
}

var criaResp = function(nome, email, tel, nasc){
	var listaItem = document.createElement("div");
	listaItem.className = "w3-row list_item_todo w3-border-left w3-border-bottom w3-border-right";
	listaItem.style = "margin-top:5px";
	listaItem.innerHTML = 
						"<div class=\"w3-col s11 m11 l11\">"+
							"<div class=\"w3-row\">"+
								"<font color=\"#20B2AA\"><b><div class=\"w3-col s6 m6 l6  w3-border-bottom\">"+
									nome+
								"</div></font></b>"+
								"<div class=\"w3-col s6 m6 l6 w3-border-left  w3-border-bottom\">"+
									email+
								"</div>"+
							"</div>"+
							"<div class=\"w3-row\">"+
								"<div class=\"w3-col s6 m6 l6 w3-border-bottom\">"+
									nasc+
								"</div>"+
								"<div class=\"w3-col s6 m6 l6 w3-border-left w3-border-bottom\">"+
									tel+
								"</div>"+
							"</div>"+
						"</div>"+
						"<div class=\"w3-col s1 m1 l1\">"+
						"<img src=\"imagens/remove-xxl.png\" class=\"remove_todo\" alt=\"Norway\" onclick=\"removeResp(this)\">"+
						  "</div>";
			
	return listaItem;
}


var carregaResponsaveis =function(data, id){
	for (i=0; i < data.length; i++) {
		var item = criaResp(data[i].nome, data[i].email, data[i].telefone, data[i].nascimento);
		var lista = document.getElementById(id);
		lista.appendChild(item);
		
    }
}

var removeResp =function(lixo){
	var confirmacao = confirm("Tem certeza que deseja remover este responsável?");
        if (confirmacao == true) {
			var itemRemove = lixo.parentNode.parentNode;
			var lista = document.getElementById("lista_responsaveis");
			lista.removeChild(itemRemove);
			ajaxRequest_gravarResp();
		}
    
}


function ajaxRequest_carregarResponsaveis_r() {
	//Cria a requisição para o servidor
    var responsaveisRequest = new XMLHttpRequest();
    responsaveisRequest.open('GET', 'http://localhost:8080/carregarResponsaveis_r',true);
    responsaveisRequest.onload = function() {
        console.log("Conectou... Status: "+responsaveisRequest.status);
        if (responsaveisRequest.status >= 200 && responsaveisRequest.status < 400) {
            var listaResponsaveis = JSON.parse(responsaveisRequest.responseText);
			carregaResponsaveis(listaResponsaveis,"lista_responsaveis");
        } else {
            console.log("Servidor ativo, mas ocorreu um erro!");
        }
    };
	
    responsaveisRequest.onerror = function() {
        console.log("Erro de conexão");
    }
    responsaveisRequest.send();  
}



function ajaxRequest_gravarResp() {
	//Cria a requisição para o servidor
	console.log("chegou na ajax de gravar");
    var gravarRequest = new XMLHttpRequest();
	
    gravarRequest.open('POST', 'http://localhost:8080/gravarResp',true);
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
	var s = criaJsonResp();
	console.log("send s +" + s);
    gravarRequest.send(s);  
}




var criaJsonResp = function(){
	var listas = [];
	var data1 = document.getElementById("lista_responsaveis");
	for (i=0; i < data1.children.length; i++) {
		listas.push(pegaAtributos(data1.children[i]));	
	}
	var json = JSON.stringify(listas);
	console.log(json);
	return json;
}

window.addEventListener('load', eventoCarregar, false);