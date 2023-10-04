import { dateToString, timeToString } from "../../utils/globalfunctions.js";
import { CLIENT_URL } from "../../utils/consts.js";
import { debounce } from "../../utils/globalfunctions.js";


// Const
var isLoading = true;
const main = $('#main');
const spinner = $('#spinner');

$(window).scroll(function() {
    let hash = window.location.hash;
    hash = hash.substring(1);
    if(hash === 'chats'){
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            let rem = localStorage.getItem('RemChats') === 'true';
            if(!isLoading && rem){
                getMoreChats(true);
            }
        }
    }
 });

const fetchChatsData = async () => {
    localStorage.setItem('RemChats', true);
    localStorage.setItem('page', 0);
    await getMoreChats(true);
    isLoading = false;
    $('#search-chats').on('keyup', debounce(searchChats, 700));
}

const searchChats = async () => {
    localStorage.setItem('RemChats', true);
    localStorage.setItem('page', 0);
    $('#chats').empty();
    await getMoreChats(true);
}

const getMoreChats = async (alone=false) => {
    const token = localStorage.getItem('token');
    const chatsContainer = $('#chats');
    if(alone) {
        isLoading = true;
        main.addClass('d-none');
        spinner.removeClass('d-none');
    }
    let page = parseInt(localStorage.getItem('page', 0));
    let search = $('#search-chats').val();
    if(!search) {
        search = "";
    } else {
        search = "&search=" + search;
    }
    await $.ajax({url: `${CLIENT_URL}/api/chat/?page=${page}${search}`, headers: {
        authorization: `Bearer ${token}`
    }, success: function(result){
        console.log(result);
        insertChats(result.chats, result.userId, chatsContainer, page);
        localStorage.setItem('page', page + 1);
        if(alone) {
            main.removeClass('d-none');
            spinner.addClass('d-none');
            isLoading = false;
        }
    }, type: "GET", contentType: "application/json", error: function(err){
        console.log(err);
        if(alone) {
            main.removeClass('d-none');
            spinner.addClass('d-none');
            isLoading = false;
        }
    }});
}

const insertChats = (chats, userId, chatsContainer, page) => {
    if(chats.length === 0) {
        chatsContainer.append(`<h2>No ${page ? "More" : ""} Chats To show</h2>`);
        localStorage.setItem('RemChats', false);
        return;
    }
    for(let i = 0; i < chats.length; i++) {
        let chat = chats[i];
        let chatName = "Anonymous";
        let chatPic = '/src/Anonymous_logo.png';
        let received = false;
        if(chat.name) {
            chatName = chat.name;
        }
        else if(chat.users.length > 1) {
            chatName = "Group Chat";
        } else {
            let otherUser = chat.users[0];
            if(otherUser.approved){
                chatName = otherUser.f_name + otherUser.l_name + " (Anonymous)";
                if (otherUser.profile_pic) {
                    chatPic = otherUser.profile_pic;
                }
            }
        }
        if(chat.lastMessage) {
            received = chat.lastMessage.sender !== userId;
        }
        let senderName = "You: ";
        if(received) {
            senderName = "Anonymous: ";
            for(let j = 0; j < chat.users.length; j++) {
                if(chat.users[j]._id === chat.lastMessage.sender) {
                    if(chat.users[j].approved) {
                        senderName = chat.users[j].f_name + " " + chat.users[j].l_name + ": ";
                    }
                }
            }
        }
        let chatHtml = `<article class="background2 rounded chat" id="${chat._id}">
                <div class="row">
                    <div class="col" style="flex: 0;">
                        <img src="${chatPic}" alt="profile pic" class="chat-icon">
                    </div>
                    <div class="chat-info">
                        <div class="chat-message">
                            <h5 class="chat-name">${chatName}</h5>
                            <small class="chat-text">${senderName + chat.lastMessage.text}</small>
                        </div>
                        <div class="position-relative">
                            <a class="chat-date">${dateToString(new Date(chat.lastMessage.createdAt))} ${timeToString(new Date(chat.lastMessage.createdAt))}</a>
                        </div>
                    </div>
                </div>
            </article>`;
        chatsContainer.append(chatHtml);
        let chatArticle = $(`#${chat._id}`);
        chatArticle.click(function() {
            window.location.href = `?id=${chat._id}#chat`;
        });
    }
}


export {fetchChatsData};