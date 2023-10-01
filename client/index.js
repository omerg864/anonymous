import { fetchChatsData } from './pages/chats/chats.js';
import { verifyUser } from './pages/verify/verify.js';
import { registerPage } from './pages/register/Register.js';

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
        switch(page){
            case 'profile':
                main.addClass('d-none');
                $('#spinner').removeClass('d-none');
                break;
            case 'chats':
                fetchChatsData();
                break;
            case 'verify':
                verifyUser();
                break;
            case 'register':
                registerPage();
                break;
        }
    });
}