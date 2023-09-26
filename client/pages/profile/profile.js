import { dateToString, insertPosts } from "../../utils/globalfunctions.js";


// Const
var isLoading = true;
const main = $('#main');
const spinner = $('#spinner');

$(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() == $(document).height()) {
        let rem = localStorage.getItem('RemPosts') === 'true';
        if(!isLoading && rem){
            getMorePosts(true);
        }
    }
 });

const fetchProfileData = async () => {
    localStorage.setItem('RemPosts', true);
    localStorage.setItem('page', 0);
    await Promise.all([getUserData(), getMorePosts()]);
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
    await $.ajax({url: `http://localhost:5600/api/user/profile/${id}`, headers: {
        authorization: `Bearer ${token}`
    }, success: function(result){
        console.log(result);
        insertUserData(result.user, result.editable);
    }, type: "GET", contentType: "application/json", error: function(err){
        console.log(err);
    }});
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
    await $.ajax({url: `http://localhost:5600/api/post/${id}?page=${page}`, headers: {
        authorization: `Bearer ${token}`
    }, success: function(result){
        console.log(result);
        insertPosts(result.posts, postsContainer, result.editable);
        localStorage.setItem('page', page + 1);
        if(alone) {
            spinner.addClass('d-none');
            isLoading = false;
        }
    }, type: "GET", contentType: "application/json", error: function(err){
        console.log(err);
        if(alone) {
            spinner.addClass('d-none');
            isLoading = false;
        }
    }});
}

const insertUserData = (userData, editable) => {
    const profilePic = $('#profilePic');
    const f_name = $('#f_name');
    const l_name = $('#l_name');
    const email = $('#email');
    const gender = $('#gender');
    const address = $('#address');
    const dob = $('#dob');
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
    }
};

export { fetchProfileData };