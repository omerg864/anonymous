import { fetchChatsData } from './pages/chats/chats.js';
import { verifyUser } from './pages/verify/verify.js';
import { registerPage } from './pages/register/Register.js';
import {LoginPage} from "./pages/login/login.js";



const socket = new WebSocket(`ws://${window.location.host}?token=${localStorage.getItem('token')}`);

// Connection opened
socket.addEventListener('open', function (event) {
    console.log('Connected to WS Server')
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});

socket.addEventListener('close', function (event) {
    console.log('Disconnected from WS Server')
});


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

    const body = document.querySelector("body"),
    sidebar = body.querySelector("nav"),
    toggle = body.querySelector(".toggle");

    const toggleHeader = $(".toggle-header");
    const nav = $("nav");

    toggleHeader.click(() => {
        nav.toggleClass("close");
    });
    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
    });
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
                socket.send('chats');
                fetchChatsData();
                break;
            case 'verify':
                verifyUser();
                break;
            case 'register':
                registerPage();
                break;
            case 'login':
                LoginPage();
                break;
        }
    });
}