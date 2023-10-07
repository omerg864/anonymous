import { dateToString, insertPosts } from "../../utils/globalFunctions.js";


// Const
var isLoading = true;
const main = $('#main');
const spinner = $('#spinner');
var user = null;

    window.getProfileMap = async () => {
        var map = new Microsoft.Maps.Map('#address-map');
        await fetchProfileData();
        if(user && user.location) {
            let location = user.location;
            let latLon = new Microsoft.Maps.Location(location.coordinates[1], location.coordinates[0]);
            let pin = new Microsoft.Maps.Pushpin(latLon);
            map.entities.push(pin);
            map.setView({ mapTypeId: Microsoft.Maps.MapTypeId.roadId,
                center: new Microsoft.Maps.Location(location.coordinates[1], location.coordinates[0]),
                zoom: 12 });
        } else {
            let latLon = new Microsoft.Maps.Location(25, -71);
            let pin = new Microsoft.Maps.Pushpin(latLon);
            map.entities.push(pin);
            map.setView({ mapTypeId: Microsoft.Maps.MapTypeId.roadId,
                center: new Microsoft.Maps.Location(25, -71),
                zoom: 5 });
        }
    }

$(window).scroll(function() {
    let hash = window.location.hash;
    hash = hash.substring(1);
    if(hash === 'profile'){
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            let rem = localStorage.getItem('RemPosts') === 'true';
            if(!isLoading && rem){
                getMorePosts(true);
            }
        }
    }
 });

const semiProfile = () => {
    const post = $('#post');
    const postsContainer = $('#posts');
    post.parent().addClass('d-none');
    postsContainer.append('No Posts to show');
    localStorage.setItem('RemPosts', false);
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    if(!id) {
        id = '';
    }
    if(id) {
        const message = $('#message');
        const token = localStorage.getItem('token');
        message.on("click", async ()=> {
            isLoading = true;
            spinner.removeClass('d-none');
            main.addClass('d-none');
            await $.ajax({url: `${window.location.origin}/api/chat/${id}`, headers: {
                authorization: `Bearer ${token}`
            }, success: function(result){
                console.log(result);
                spinner.addClass('d-none');
                main.removeClass('d-none');
                isLoading = false;
                window.location.href = `?id=${result.chatId}#chat`;
            }, type: "GET", contentType: "application/json", error: function(err){
                console.log(err);
                    spinner.addClass('d-none');
                    main.removeClass('d-none');
                    isLoading = false;
            }});
        });
    }
}

const fetchProfileData = async () => {
    const newPost = $('#post');
    newPost.on("click", ()=> {
        window.location.href = '?#newPost'
    });
    localStorage.setItem('RemPosts', true);
    localStorage.setItem('page', 0);
    await Promise.allSettled([getUserData(), getMorePosts()])
    main.removeClass('d-none');
    spinner.addClass('d-none');
    isLoading = false;
}

// get User data
const getUserData = async () => {
    const token = localStorage.getItem('token');
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    if(!id) {
        id = '';
    }
    main.addClass('d-none');
    spinner.removeClass('d-none');
    let data = {func: 'getUserData'};
    await $.ajax({url: `${window.location.origin}/api/user/profile/${id}`, headers: {
        authorization: `Bearer ${token}`
    }, success: function(result){
        console.log(result);
        insertUserData(result.user, result.editable);
        user = result.user;
    }, type: "GET", contentType: "application/json", error: function(err){
        if(err.responseJSON.message !== 'User not found') {
            semiProfile();
        } else {
            main.html(`<h2>${err.responseJSON.message}</h2>`);
        }
    }});
    return data;
}


const getMorePosts = async (alone=false) => {
    const token = localStorage.getItem('token');
    const postsContainer = $('#posts');
    if(alone) {
        isLoading = true;
        spinner.removeClass('d-none');
    }
    const urlParams = new URLSearchParams(window.location.search);
    let page = parseInt(localStorage.getItem('page', 0));
    let id = urlParams.get('id');
    if(!id) {
        id = '';
    }
    await $.ajax({url: `${window.location.origin}/api/post/${id}?page=${page}`, headers: {
        authorization: `Bearer ${token}`
    }, success: function(result){
        console.log(result);
        insertPosts(result.posts, postsContainer, result.editable, page);
        localStorage.setItem('page', page + 1);
        if(alone) {
            spinner.addClass('d-none');
            isLoading = false;
        }
    }, type: "GET", contentType: "application/json", error: function(err){
        console.log(err.responseJSON);
        if(alone) {
            spinner.addClass('d-none');
            isLoading = false;
        }
    }});
}

const insertUserData = (userData, editable) => {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    if(!id) {
        id = '';
    }
    const profilePic = $('#profilePic');
    const f_name = $('#f_name');
    const l_name = $('#l_name');
    const email = $('#email');
    const gender = $('#gender');
    const address = $('#address');
    const dob = $('#dob');
    const message = $('#message');
    const newPostContainer = $('#new-post-btn-container');
    f_name.html(userData.f_name + "&nbsp;");
    l_name.html(userData.l_name);
    email.html(userData.email);
    gender.html(userData.gender);
    address.html(userData.address);
    dob.html(dateToString(new Date(userData.dob)));
    if(userData.profile_pic) {
        profilePic.attr('src', userData.profile_pic);
    }
    if(!editable) {
        const editBtn = $('#edit');
        editBtn.addClass('d-none');
        if(id) {
            const token = localStorage.getItem('token');
            message.on("click", async ()=> {
                isLoading = true;
                spinner.removeClass('d-none');
                main.addClass('d-none');
                await $.ajax({url: `${window.location.origin}/api/chat/${id}`, headers: {
                    authorization: `Bearer ${token}`
                }, success: function(result){
                    console.log(result);
                    spinner.addClass('d-none');
                    main.removeClass('d-none');
                    isLoading = false;
                    window.location.href = `?id=${result.chatId}#chat`;
                }, type: "GET", contentType: "application/json", error: function(err){
                    console.log(err);
                        spinner.addClass('d-none');
                        main.removeClass('d-none');
                        isLoading = false;
                }});
            });
        }
        newPostContainer.addClass('d-none');
    } else {
        message.parent().addClass('d-none');
    }
};
