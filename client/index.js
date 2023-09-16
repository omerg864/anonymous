

window.addEventListener("hashchange", (event) => {
    let hash = window.location.hash;
    console.log(hash);
    if (hash == '') {
        main.load('./pages/home/home.html');
    } else {
        switchPage(hash.substring(1));
    }
});

document.addEventListener("DOMContentLoaded", (event) => {
    let hash = window.location.hash;
    let main = $('#main');
    console.log(hash);
    if (hash == '') {
        main.load('./pages/home/home.html');
    } else {
        switchPage(hash.substring(1));
    }
});

const switchPage = (page) => {
    let main = $('#main');
    main.html(''); // clear main
    main.load(`./pages/${page}/${page}.html`);
}