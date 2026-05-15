// =========================
// TAMANHO DA FONTE
// =========================

const fontSelect = document.getElementById("font-size-select");

// APLICA AO CARREGAR
const fonteSalva = localStorage.getItem("font-size");

if(fonteSalva){

    body.classList.remove(
        "font-grande",
        "font-x-grande"
    );

    if(fonteSalva !== "normal"){
        body.classList.add(`font-${fonteSalva}`);
    }

    if(fontSelect){
        fontSelect.value = fonteSalva;
    }
}


// EVENTO SELECT
if(fontSelect){

    fontSelect.addEventListener("change", () => {

        body.classList.remove(
            "font-grande",
            "font-x-grande"
        );

        const valor = fontSelect.value;

        if(valor !== "normal"){
            body.classList.add(`font-${valor}`);
        }

        localStorage.setItem("font-size", valor);

    });

}