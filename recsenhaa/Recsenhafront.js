document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('loginForm');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', function(event){
        event.preventDefault();

        const emailInput = document.getElementById('email');
        const emailValue = emailInput.value;

        fetch('http://localhost:8080/recsenha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: emailValue })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message) });
            }
            return response.json();
        })
        .then(data => {
            resultDiv.style.color = "green";
            resultDiv.textContent = data.message;
            emailInput.value = '';
        })
        .catch(erro => {
            console.error('Erro ao recuperar senha:', erro);
            resultDiv.style.color = "red";
            resultDiv.textContent = erro.message || 'Erro ao se conectar com o servidor.';
        });
    });
});