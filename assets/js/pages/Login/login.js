// Validar campos
function validarCampos(emailInput, senhaInput, avisoEmail, avisoSenha) {
    const valor = document.getElementById(emailInput).value;
    const aviso = document.getElementById(avisoEmail);

    if (!emailInput.value.includes('@')) {
        aviso.textContent = 'Email inválido';
        valido = false;
    }
    if (senhaInput.value.trim() === '') {
        avisoSenha.textContent = 'Senha não pode ser vazia';
        valido = false;
    }
    return valido;
}

// Integração com API
async function fazerLogin(event) {
    if(event) event.preventDefault(); //Impedir pag recaregar sozinha

    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const avisoGeral = document.getElementById('avisosenha');
    const avisoEmail = document.getElementById('aviso');

    // Validação (pra n chamar a API à toa)
    if (!validarCampos(emailInput, senhaInput, avisoEmail, avisoGeral)) {
        return;
    }

    const bodyReq = {
        email: emailInput.value,
        senha: senhaInput.value
    };

    try {
        // Muda botão entrar para carregando:
        const btnEntrar = document.getElementById('entrar h2');
        const textoOriginal = btnEntrar.innerText;
        btnEntrar.innerText = 'Carregando...';

        // Chama API:
        const resp = await apiFetch('/auth/login', 'POST', bodyReq);

        // Tratamento resposta:
        if (resp.ok) { // 200 ok
            const token = await resp.text(); // pega token
            
            //guarda token no localStorage:
            localStorage.setItem('jwt_token', token);

            //manda pra Home (Alterar depois)
            window.location.href = 'Home.html';
        } else if (resp.status === 400 || resp.status === 403) { // 400 ou 403 erro
            avisoGeral.textContent = 'Email ou senha incorretos';
            btnEntrar.innerText = textoOriginal; // volta texto do botão
        } else { // outros erros // Erros Servidor
            avisoGeral.textContent = 'Erro no servidor. Tente novamente mais tarde.';
            btnEntrar.innerText = textoOriginal; // volta texto do botão
        }


    } catch (error) { // falha ao conectar
        avisoGeral.textContent = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        console.error('Erro ao conectar:', error);
        document.querySelector(".entrar h2").innerText = 'Entrar'; // volta texto do botão
    }
}