class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == "" || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Db {
    constructor() {
        let id = localStorage.getItem("id")
        if (id == null) {
            localStorage.setItem("id", 0)
        }
    }
    getProximoId() {
        let proximoId = localStorage.getItem("id")
        return parseInt(proximoId) + 1
    }
    gravar(d) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem("id", id)
    }
    recuperarRegistros() {
        //array de despesas
        let despesas = Array()
        let id = localStorage.getItem("id")
        //recuperar despesas
        for (let i = 1; i <= id; i++) {
            //formatar pra JSOn pra recuperar
            let despesa = JSON.parse(localStorage.getItem(i))
            //verificar índices nulos
            if (despesa === null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }
    pesquisar(despesa) {
        //implementando filtro
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarRegistros()
        // filtro ano
        if (despesa.ano != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        // filtro mes
        if (despesa.mes != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        // filtro dia
        if (despesa.dia != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        // filtro tipo
        if (despesa.tipo != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        // filtro descricao
        if (despesa.descricao != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        // filtro valor
        if (despesa.valor != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let db = new Db()

function cadastrarDespesa() {
    let ano = document.getElementById("ano")
    let mes = document.getElementById("mes")
    let dia = document.getElementById("dia")
    let tipo = document.getElementById("tipo")
    let descricao = document.getElementById("descricao")
    let valor = document.getElementById("valor")

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    //salvar despesas
    if (despesa.validarDados()) {
        db.gravar(despesa)
        //dialog pra quando salvar com sucesso
        document.getElementById("h5-modal").innerHTML = "Registrado com sucesso."
        document.getElementById("h5-div").className = "modal-header text-success"
        document.getElementById("div-text").innerHTML = "Despesa registrada com sucesso."
        document.getElementById("modal-btn").innerHTML = "Voltar"
        document.getElementById("modal-btn").className = "btn btn-success"
        $("#registroGravacao").modal("show")
        //limpar campos
        ano.value = ""
        mes.value = ""
        dia.value = ""
        tipo.value = ""
        descricao.value = ""
        valor.value = ""
    } else {
        //dialog pra quando n salvar
        document.getElementById("h5-modal").innerHTML = "Erro no registro."
        document.getElementById("h5-div").className = "modal-header text-danger"
        document.getElementById("div-text").innerHTML = "Campos obrigatórios não foram preenchidos."
        document.getElementById("modal-btn").innerHTML = "Corrigir"
        document.getElementById("modal-btn").className = "btn btn-danger"
        $("#registroGravacao").modal("show")
    }

}
//exibir despesas
function carregaDespesas(despesas = Array(), filtro = false) {
    if (despesas.length == 0 && filtro == false) {
        despesas = db.recuperarRegistros()
    }
    let listaDespesas = document.getElementById("lista-despesas")
    //limpar tabela quando for exibir resultado
    listaDespesas.innerHTML = ""
    //faz o laço
    despesas.forEach(function (d) {
        //cria linhas
        let linha = listaDespesas.insertRow()
        // cria colunas
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        // ajuste exibição do tempo
        switch (d.tipo) {
            case "1": d.tipo = "Alimentação"
                break
            case "2": d.tipo = "Educação"
                break
            case "3": d.tipo = "Lazer"
                break
            case "4": d.tipo = "Saúde"
                break
            case "5": d.tipo = "Transporte"
                break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criação do botão de exclusão da despesa
        let btn = document.createElement("button")
        btn.className = "btn btn-danger"
        btn.innerHTML = "<i class='fas fa-times'></i>"
        btn.id = `id-despesa-${d.id}`
        // lógica pra exclusão
        btn.onclick = function () {
            // remove nome do id do html
            let id = this.id.replace("id-despesa-", "")
            // remoção
            db.remover(id)
            // atualiza página automática pra sumir o dado
            window.location.reload()
        }
        linha.insertCell(4).append(btn)

    })
}

// pesquisa por filtros
function pesquisarDespesa() {
    let ano = document.getElementById("ano").value
    let mes = document.getElementById("mes").value
    let dia = document.getElementById("dia").value
    let tipo = document.getElementById("tipo").value
    let descricao = document.getElementById("descricao").value
    let valor = document.getElementById("valor").value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    let despesas = db.pesquisar(despesa)

    carregaDespesas(despesas, true)
}

