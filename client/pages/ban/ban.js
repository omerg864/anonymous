import { dateToString, timeToString, debounce } from "../../utils/globalFunctions.js";


// Const
var isLoading = true;
const main = $('#main');
const spinner = $('#spinner');

$(window).scroll(function() {
    let hash = window.location.hash;
    hash = hash.substring(1);
    if(hash === 'ban'){
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            let rem = localStorage.getItem('RemUsers') === 'true';
            if(!isLoading && rem){
                getMoreChats(true);
            }
        }
    }
 });

const fetchBanData = async () => {
    localStorage.setItem('RemUsers', true);
    localStorage.setItem('page', 0);
    await getMoreBans(true);
    isLoading = false;
    $('#search-bans').on('keyup', debounce(searchBans, 700));
}

const searchBans = async () => {
    localStorage.setItem('RemUsers', true);
    localStorage.setItem('page', 0);
    $('#bans').empty();
    await getMoreBans(true);
}

const getMoreBans = async (alone=false) => {
    const token = localStorage.getItem('token');
    const bansContainer = $('#bans');
    if(alone) {
        isLoading = true;
        spinner.removeClass('d-none');
    }
    let page = parseInt(localStorage.getItem('page', 0));
    let search = $('#search-bans').val();
    if(!search) {
        search = "";
    } else {
        search = "&search=" + search;
    }
    await $.ajax({url: `${window.location.origin}/api/user/ban/?page=${page}${search}`, headers: {
        authorization: `Bearer ${token}`
    }, success: function(result){
        console.log(result);
        insertUsers(result.users, bansContainer, page);
        localStorage.setItem('page', page + 1);
        if(alone) {
            spinner.addClass('d-none');
            isLoading = false;
        }
    }, type: "GET", contentType: "application/json", error: function(err){
        console.log(err.message);
        if(alone) {
            spinner.addClass('d-none');
            isLoading = false;
        }
    }});
}

const insertUsers = (users, bansContainer, page) => {
    if(users.length === 0) {
        bansContainer.append(`<h2>No ${page ? "More" : ""} Users To show</h2>`);
        localStorage.setItem('RemUsers', false);
        return;
    }
    for(let i = 0; i < users.length; i++) {
        let user = users[i];
        let userHtml = `<article class="background2 rounded chat" id="${user._id}">
                <div class="row">
                    <div class="col" style="flex: 0;">
                        <img src="${user.profile_pic ? user.profile_pic : "./src/question_mark_icon.png"}" alt="profile pic" class="chat-icon">
                    </div>
                    <div class="chat-info">
                        <div class="chat-message">
                            <h5 class="chat-name">${user.f_name + " " + user.l_name}</h5>
                            <small class="chat-text">${user.banReason}</small>
                        </div>
                    </div>
                </div>
            </article>`;
        bansContainer.append(userHtml);
        let userArticle = $(`#${user._id}`);
        userArticle.click(function() {
            window.location.href = `?id=${user._id}#ban-info`;
        });
    }
}


export {fetchBanData};