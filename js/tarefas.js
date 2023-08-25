const form = document.querySelector('form')
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const tarefa = form.tarefa.value
  const data = form.data.value
  const hora = form.hora.value

  if (tarefa == "" || data == "" || hora == "") {
    alert("preencha os campos em brancos!")
    return
  }
  try {
    const dataHoraFormatadaBR = formatarDataHoraBR(data, hora)
    const response = await fetch("http://localhost:3000/tarefas", {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "tarefa": tarefa, "data_hora": dataHoraFormatadaBR
      })
    })
    if (response.ok) {
      window.location.href = "tarefas.html";
    } else {
      alert("Erro ao adicionar tarefa.");
    }
  } catch (error) {
    alert("Ocorreu um erro. Entre em contato com o suporte")
  }
})

const options = { method: 'GET' }

let id = 0
fetch('http://localhost:3000/tarefas', options)
  .then(response => response.json())
  .then(data => {
    data.forEach((element) => {

      const linha = document.createElement("tr")
      const numero = document.createElement("td")
      const tarefa = document.createElement("td")
      const data_hora = document.createElement("td")
      const funcoes = document.createElement("td")
      const btnDeletar = document.createElement("button")
      const btnEditar = document.createElement("button")
      const tarefaConcluida = document.createElement("input")

      tarefaConcluida.classList.add("checar")
      tarefaConcluida.type = "checkbox"
      btnDeletar.textContent = "Deletar"
      btnEditar.textContent = "Editar"

      // evento do checkbox
      tarefaConcluida.addEventListener("change", () => {
        if (tarefaConcluida.checked) {
          tarefa.classList.add("concluido")
          data_hora.classList.add("concluido")
          btnDeletar.style.display = "none"
          btnEditar.style.display = "none"
        } else {
          tarefa.classList.remove("concluido")
          data_hora.classList.remove("concluido")
          btnEditar.style.display = "inline-flex"
          btnDeletar.style.display = "inline-flex"
        }

      })

      linha.appendChild(numero)
      linha.appendChild(tarefa)
      linha.appendChild(data_hora)
      linha.appendChild(funcoes)
      funcoes.appendChild(btnDeletar)
      funcoes.appendChild(btnEditar)
      funcoes.appendChild(tarefaConcluida)
      document.querySelector("table tbody").appendChild(linha)

      // pegando os elementos no banco de dados
      id = element.id
      numero.textContent = element.id
      tarefa.textContent = element.tarefa
      data_hora.innerHTML = element.data_hora
      btnDeletar.addEventListener("click", deletar)
      btnEditar.addEventListener("click", () => editar(element))

      function deletar() {
        fetch(`http://localhost:3000/tarefas/id/${id}`, {
          method: "delete",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "id": id, "tarefa": tarefa, "data_hora": data_hora
          })
        })

          .then((response) => {
            console.log("Deletado com sucesso!")
            window.location.href = "tarefas.html"
          })
      }
      // editar
      function editar(elementCopia) {
        const containerModal = document.createElement("div")
        const modal = document.createElement("div")
        const modalEditar = document.createElement("div")
        const labelTarefa = document.createElement("label")
        const labelData = document.createElement("label")
        const labelHora = document.createElement("label")
        const inputTarefa = document.createElement("input")
        const inputData = document.createElement("input")
        const inputHora = document.createElement("input")
        const btnEditar = document.createElement("button")
        const btnCancelar = document.createElement("button")

        inputData.type = "date"
        inputHora.type = "time"
        labelTarefa.textContent = "Tarefa"
        labelData.textContent = "Data"
        labelHora.textContent = "Hora"

        btnEditar.textContent = "Editar"
        btnCancelar.textContent = "Cancelar"

        modalEditar.append(labelTarefa)
        modalEditar.append(inputTarefa)
        modalEditar.append(labelData)
        modalEditar.append(inputData)
        modalEditar.append(labelHora)
        modalEditar.append(inputHora)
        modalEditar.append(btnEditar)
        modalEditar.append(btnCancelar)

        modal.classList.add("modal")
        containerModal.classList.add("containerModal")
        modalEditar.classList.add("modalEditar")
        
        document.querySelector("main").append(modal)
        containerModal.appendChild(modalEditar)
        modal.appendChild(containerModal)

        // cancelar evento
        btnCancelar.addEventListener("click", () => {
          modal.style.display = "none"
        })

        inputTarefa.value = elementCopia.tarefa
        inputData.value = elementCopia.data_hora
        inputHora.value = elementCopia.data_hora


        btnEditar.addEventListener("click", () => {

          if (inputTarefa.value == "" || inputData.value == "" || inputHora == "") {
            alert("preencha todos os campos")
            return
          }

          const dataBR = formatarDataHoraBR(inputData.value, inputHora.value)

          fetch(`http://localhost:3000/tarefas/id/${elementCopia.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json', 'User-Agent': 'Insomnia/2023.5.5'
            },
            body: JSON.stringify({
              "id": elementCopia.id, "tarefa": inputTarefa.value, "data_hora": dataBR
            })
          })
            .then(() => {
              modalEditar.style.display = "none"
              modalEditar.classList.remove("modal")
              window.location.href = "tarefas.html"
            })

        })
      }
    })
  })
function formatarDataHoraBR(data, hora) {
  const dataHora = new Date(`${data}T${hora}`);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  return dataHora.toLocaleDateString('pt-BR', options);
}