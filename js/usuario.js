

const options = { method: 'GET', headers: { 'User-Agent': 'Insomnia/2023.5.5' } }

let id = 0
fetch('http://localhost:3000/usuario', options)
  .then(response => response.json())
  .then(data => {
    data.forEach((element) => {

      const linha = document.createElement("tr")
      const colunas = document.createElement("td")
      const nome = document.createElement("td")
      const senha = document.createElement("td")
      const btnDeletar = document.createElement("button")
      const btnEditar = document.createElement("button")
      btnDeletar.textContent = "Deletar"
      btnEditar.textContent = "Editar"

      document.querySelector("table tbody").append(linha)
      document.querySelector("table tbody").append(nome)
      document.querySelector("table tbody").append(senha)

      linha.appendChild(colunas)
      linha.appendChild(nome)
      linha.appendChild(senha)
      linha.appendChild(btnDeletar)
      linha.appendChild(btnEditar)

      id = element.id
      colunas.innerHTML = element.id
      nome.innerHTML = element.nome
      senha.innerHTML = element.senha
      btnDeletar.addEventListener("click", deletar)
      btnEditar.addEventListener("click", () => editar(element))

      function deletar() {
        fetch(`http://localhost:3000/usuario/id/${id}`, {
          method: "delete",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "id": id, "nome": nome, "senha": senha
          })
        })

          .then((response) => {
            console.log("Deletado com sucesso!")
          })
        window.location.href = "usuarios.html"
      }
      function editar(elementCopia) {
        const modalEditar = document.createElement("div")
        const labelNome = document.createElement("label")
        const labelSenha = document.createElement("label")
        const inputNome = document.createElement("input")
        const inputSenha = document.createElement("input")
        const btnEditar = document.createElement("button")
        const btnCancelar = document.createElement("button")

        labelNome.textContent = "Nome"
        labelSenha.textContent = "Senha"

        btnEditar.textContent = "Editar"
        btnCancelar.textContent = "Cancelar"

        document.querySelector("body").append(modalEditar)

        modalEditar.append(labelNome)
        modalEditar.append(inputNome)
        modalEditar.append(labelSenha)
        modalEditar.append(inputSenha)
        modalEditar.append(btnEditar)
        modalEditar.append(btnCancelar)
        modalEditar.classList.add("modal")

        // cancelar evento
        btnCancelar.addEventListener("click", () => {
          modalEditar.style.display = "none"
          modalEditar.classList.remove("modal")
        })
        inputNome.value = elementCopia.nome
        inputSenha.value = elementCopia.senha


        btnEditar.addEventListener("click", () => {


          fetch(`http://localhost:3000/usuario/id/${elementCopia.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json', 'User-Agent': 'Insomnia/2023.5.5'
            },
            body: JSON.stringify({
              "id": elementCopia.id, "nome": inputNome.value, "senha": inputSenha.value
            })
          })
            .then(() => {
              modalEditar.style.display = "none"
              modalEditar.classList.remove("modal")
              nome.innerHTML = inputNome.value
              senha.innerHTML = inputSenha.value
            })

        })

      }

    })
  })