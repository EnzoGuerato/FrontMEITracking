const trilho = document.getElementById('trilho');
const body = document.querySelector('body');
const imgLua = document.getElementById('img-lua'); 

const sol = "/Site/imgs/trilho/iconlua(preta).png";
const lua = "/Site/imgs/trilho/iconsol(branco).png";

trilho.addEventListener('click', () => {
    trilho.classList.toggle('dark');
    body.classList.toggle('dark');

    if (body.classList.contains('dark')) {
        imgLua.src = sol;
    } else {
        imgLua.src = lua;
    }
});