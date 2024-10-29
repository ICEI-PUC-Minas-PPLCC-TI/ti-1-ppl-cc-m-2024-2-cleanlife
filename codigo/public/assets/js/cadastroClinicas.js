const apiUrl = '/clinicas';

function displayMessage(mensagem) {
    msg = document.getElementById('msg');
    msg.innerHTML = '<div class="alert alert-warning">' + mensagem + '</div>';
}

function readClinica(processaDados) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            processaDados(data);
        })
        .catch(error => {
            console.error('Erro ao ler clinicas via API JSONServer:', error);
            displayMessage("Erro ao ler clinicas");
        });
}

function createClinica(clinica, refreshFunction) {
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(clinica),
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("Clinica inserida com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao inserir clinica via API JSONServer:', error);
            displayMessage("Erro ao inserir clinica");
        });
}

function updateClinica(id, clinica, refreshFunction) {
    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(clinica),
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("Clinica alterada com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao atualizar clinica via API JSONServer:', error);
            displayMessage("Erro ao atualizar clinica");
        });
}

function deleteClinica(id, refreshFunction) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("Clinica removida com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao remover clinica via API JSONServer:', error);
            displayMessage("Erro ao remover clinica");
        });
}

function exibeClinicas() {
    tableClinicas = document.getElementById("table-clinicas");

    // Remove todas as linhas do corpo da tabela
    tableClinicas.innerHTML = "";

    readClinica (dados => {
        // Popula a tabela com os registros do banco de dados
        for (i = 0; i < dados.length; i++) {
            let clinica = dados[i];    
            tableClinicas.innerHTML += `<tr><td scope="row">${clinica.id}</td>
                                            <td>${clinica.nome}</td>
                                            <td>${clinica.endereco}</td>
                                            <td>${clinica.cidade}</td>
                                            <td>${clinica.latlong}</td>
                                            <td>${clinica.cor}</td>
                                            <td>${clinica.url}</td>
                                        </tr>`;
        }
    })
}

function init() {
    // Define uma variável para o formulário de clinica
    formClinica = document.getElementById("form-clinica");

    // Adiciona funções para tratar os eventos 
    btnInsert = document.getElementById("btnInsert");
    btnInsert.addEventListener ('click', function () {
        // Verifica se o formulário está preenchido corretamente
        if (!formClinica.checkValidity()) {
            displayMessage("Preencha o formulário corretamente.");
            return;
        }

        // Obtem os valores dos campos do formulário
        let campoNome = document.getElementById ('inputNome').value;
        let campoEndereco = document.getElementById ('inputEndereco').value;
        let campoCidade = document.getElementById ('inputCidade').value;
        let campoLat = document.getElementById ('inputLat').value;
        let campoLong = document.getElementById ('inputLong').value;
        let campoCor = document.getElementById ('inputCor').value;
        let campoSite = document.getElementById ('inputSite').value;

        // Cria um objeto com os dados da clinica
        let clinica = { 
            nome: campoNome, 
            endereco: campoEndereco,
            cidade: campoCidade, 
            latlong: [
                campoLat,
                campoLong
            ],
            url: campoSite,
            cor: campoCor
        };

        // Cria a clinica no banco de dados
        createClinica(clinica, exibeClinicas);

        // Limpa o formulario
        formClinica.reset()
    });

    // Trata o click do botão Alterar
    btnUpdate = document.getElementById("btnUpdate");
    btnUpdate.addEventListener ('click', function () {
        // Obtem os valores dos campos do formulário
        let campoId = document.getElementById("inputId").value;
        if (campoId == "") {
            displayMessage("Selecione antes uma clinica para ser alterada.");
            return;
        }

        // Obtem os valores dos campos do formulário
        let campoNome = document.getElementById ('inputNome').value;
        let campoEndereco = document.getElementById ('inputEndereco').value;
        let campoCidade = document.getElementById ('inputCidade').value;
        let campoLat = document.getElementById ('inputLat').value;
        let campoLong = document.getElementById ('inputLong').value;
        let campoCor = document.getElementById ('inputCor').value;
        let campoSite = document.getElementById ('inputSite').value;

        // Cria um objeto com os dados da clinica
        let clinica = { 
            nome: campoNome, 
            endereco: campoEndereco,
            cidade: campoCidade, 
            latlong: [
                campoLat,
                campoLong
            ],
            url: campoSite,
            cor: campoCor
        };

        // Altera a clinica no banco de dados
        updateClinica(parseInt(campoId), clinica, exibeClinicas);

        // Limpa o formulario
        formClinica.reset()
    });

    // Trata o click do botão Excluir
    btnDelete = document.getElementById('btnDelete');
    btnDelete.addEventListener ('click', function () {
        let campoId = document.getElementById('inputId').value;
        if (campoId == "") {
            displayMessage("Selecione uma clinica a ser excluída.");
            return;
        }

        // Exclui a clinica no banco de dados
        deleteClinica(parseInt(campoId), exibeClinicas);

        // Limpa o formulario
        formClinica.reset()
    });

    // Trata o click do botão Listar Clinicas
    btnClear = document.getElementById('btnClear');
    btnClear.addEventListener ('click', function () {                
        formClinica.reset()
    });

    // Oculta a mensagem de aviso após alguns 5 segundos
    msg = document.getElementById('msg');
    msg.addEventListener ("DOMSubtreeModified", function (e) {
        if (e.target.innerHTML == "") return;
        setTimeout (function () {
            alert = msg.getElementsByClassName("alert");
            alert[0].remove();
        }, 5000);
    })

    // Preenche o formulário quando o usuario clicar em uma linha da tabela 
    gridClinicas = document.getElementById("grid-clinicas");
    gridClinicas.addEventListener('click', function (e) {
        if (e.target.tagName == "TD") { 

            // Obtem as colunas da linha selecionada na tabela
            let linhaClinica = e.target.parentNode;
            colunas = linhaClinica.querySelectorAll("td");

            // Preenche os campos do formulário com os dados da linha selecionada na tabela
            document.getElementById ('inputId').value = colunas[0].innerText;
            document.getElementById ('inputNome').value = colunas[1].innerText;
            document.getElementById ('inputEndereco').value = colunas[2].innerText;
            document.getElementById ('inputCidade').value = colunas[3].innerText;
            let latlong = colunas[4].innerText.split(",")
            document.getElementById ('inputLat').value = latlong[0].trim();
            document.getElementById ('inputLong').value = latlong[1].trim();
            document.getElementById ('inputCor').value = colunas[5].innerText;
            document.getElementById ('inputSite').value = colunas[6].innerText;
        }
    });

    exibeClinicas();
}