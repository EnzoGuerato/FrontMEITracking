const trilho = document.getElementById('trilho');
const body = document.querySelector('body');
const imgLua = document.getElementById('img-lua'); 

const sol = "/Site/imgs/trilho/iconsol(preto).png";
const lua = "/Site/imgs/trilho/iconlua(branca).png";

trilho.addEventListener('click', () => {
    trilho.classList.toggle('dark');
    body.classList.toggle('dark');

    if (body.classList.contains('dark')) {
        imgLua.src = sol;
    } else {
        imgLua.src = lua;
    }
});