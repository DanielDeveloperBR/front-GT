const form = document.querySelector('form')
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const nome = form.nome.value
    const senha = form.senha.value
    if (nome == "" || senha == "") {
        alert("preencha os campos em brancos!")
        return
    } else {
        form.submit()
        fetch("http://localhost:3000/usuario", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                 "nome": nome, "senha": senha
            })
        })

            .then((response) => {
                console.log("Cadastrado com sucesso!")
            })
            window.location.href = "cadastrar.html"
    }
})


