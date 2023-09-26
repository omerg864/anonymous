import { fetchProfileData } from './pages/profile/profile.js';

window.addEventListener("popstate", (event) => {
    let hash = window.location.hash;
    let main = $('#main');
    console.log(hash);
    if (hash == '') {
        main.load('./pages/home/home.html');
    } else {
        switchPage(hash.substring(1));
    }
});

document.addEventListener("DOMContentLoaded", (event) => {
    let hash = window.location.hash;
    let temp = "";
    for(let i = 0; i < hash.length; i++){
        if(hash[i] == "?"){
            break;
        }
        temp += hash[i];
    }
    hash = temp;
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
    main.load(`./pages/${page}/${page}.html`, () => {
        if(page === 'profile'){
            fetchProfileData();
        }
    });
}