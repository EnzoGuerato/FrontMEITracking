// SÓ EXECUTA O EVENTO DE CLIQUE SE O BOTÃO EXISTIR NA TELA ATUAL
if(trilho){

    trilho.addEventListener("click", () => {
        trilho.classList.toggle("dark");
        body.classList.toggle("dark");

        const darkAtivo = body.classList.contains("dark");

        // SALVA A PREFERÊNCIA DO USUÁRIO NO NAVEGADOR
        localStorage.setItem("dark-mode", darkAtivo);

        // TROCA ÍCONE DINAMICAMENTE
        if(imgLua){
            imgLua.src = darkAtivo ? sol : lua;
        }
    });

}