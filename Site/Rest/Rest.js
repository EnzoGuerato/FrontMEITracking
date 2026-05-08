// URL BackEnd
const API_URL = 'http://localhost:8080/'


// Bearer FrontEnd (Barreira)
document.addEventListener('DOMContentLoaded', () => {
    const paginaAtual = window.location.pathname.toLocaleLowerCase();

    // Paginas livre do Bearer sem precisar do Token:
    const paginaLivre = paginaAtual.includes('login') || paginaAtual.includes('cadastro') || paginaAtual.includes('home')

    // Salva Token
    const token = localStorage.getItem('jwt_token');

    // Priva paginas que precisam de Token
    if (!paginaLivre && !token) {
        console.warn("Acesso negado!");
        window.location.href = '../Login/Login.html'; //Redireciona pro Login
    }
});

// "PostMan" Automatico:
// Serve para Login e Cadastro
async function apiFetch(endpoint, metodo = 'GET', bodyReq = null) {
    const token = localStorage.getItem('jwt_token'); // Pega token

    const headers = {
        'Content-Type': 'application/json'
    }

    // add token no Headers
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Config Headers
    const config = {
        method: metodo, 
        headers: headers
    };

    // Transforma JS em JSON
    if (bodyReq){
        config.body = JSON.stringify(bodyReq);
    }

    try {
        // SEND
        const resp = await fetch(`${API_URL}${endpoint}`, config);
            
        if(resp.status == 403) {
            localStorage.removeItem('jwt_token') // limpa Token
            window.location.href = '../Login/Login.html';
            throw new Error("Sessão inválida ou expirada");
        }

        return resp;
    } catch (erro) {
        console.error("Erro ao conectar com a API:", erro);
        throw erro;
    }
}