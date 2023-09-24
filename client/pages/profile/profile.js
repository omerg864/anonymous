import { dateToString } from "../../utils/globalfunctions.js";

// TODO: add time to date


// get token from local storage
const token = localStorage.getItem('token');

const getData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    if(!id) {
        id = '';
    }
    const main = $('#main');
    const spinner = $('#spinner');
    console.log(id);
    main.addClass('d-none');
    spinner.removeClass('d-none');
    $.ajax({url: `http://localhost:5600/api/user/profile/${id}`, headers: {
        authorization: `Bearer ${token}`
    }, success: function(result){
        console.log(result);
        insertPosts(result.posts, result.editable);
        insertUserData(result.user, result.editable);
        main.removeClass('d-none');
        spinner.addClass('d-none');
    }, type: "GET", contentType: "application/json", error: function(err){
        console.log(err);
        main.removeClass('d-none');
        spinner.addClass('d-none');
    }});
}

const insertPosts = (posts, editable) => {
    if(editable) {
        const postsContainer = $('#posts');
        if(posts.length === 0) {
            postsContainer.append(`<h2>No Posts To show</h2>`);
        } else {
            for(let i = 0; i< posts.length; i++) {
                if(posts[i].type == 'text'){
                    postsContainer.append(
                            `<article class="post background2 rounded">
                                <div class="row">
                                <div class="col" style="flex: 0;">
                                    <img src="/src/question_mark_icon.png" alt="profile pic" class="post-icon">
                                    </div>
                                    <div class="post-info">
                                        <small>Anonymous (${posts[i].user.f_name} ${posts[i].user.l_name})</small>
                                        <small>${dateToString(new Date(posts[i].updatedAt))}</small>
                                    </div>
                                </div>
                                <p class="post-main-content">${posts[i].content}</p>
                            </article>`);
                } else if(posts[i].media) {
                    postsContainer.append(
                        `<article class="post background2 rounded">
                            <div class="row">
                            <div class="col" style="flex: 0;">
                                <img src="/src/question_mark_icon.png" alt="profile pic" class="post-icon">
                                </div>
                                <div class="post-info">
                                    <small>Anonymous (${posts[i].user.f_name} ${posts[i].user.l_name})</small>
                                    <small>${dateToString(new Date(posts[i].updatedAt))}</small>
                                </div>
                            </div>
                            <p class="post-main-content">${posts[i].content}</p>
                            <img src="${posts[i].media}" alt="post media" class="post-media">
                        </article>`);
                } else {
                    postsContainer.append(
                        `<article class="post background2 rounded">
                            <div class="row">
                            <div class="col" style="flex: 0;">
                                <img src="/src/question_mark_icon.png" alt="profile pic" class="post-icon">
                                </div>
                                <div class="post-info">
                                    <small>Anonymous (${posts[i].user.f_name} ${posts[i].user.l_name})</small>
                                    <small>${dateToString(new Date(posts[i].updatedAt))}</small>
                                </div>
                            </div>
                            <div style="padding: 1rem;">
                                <canvas id="canvas-${i}" class="post-canvas"></canvas>
                            </div>
                        </article>`);
                    const canvas = document.getElementById(`canvas-${i}`);
                    const ctx = canvas.getContext('2d');
                    const canvas_data = posts[i].type.split(',');
                    const color = canvas_data[0];
                    const background = canvas_data[1];
                    ctx.font="3rem Comic Sans MS";
                    ctx.fillStyle = color;
                    ctx.textAlign = "center";
                    canvas.style.background = background;
                    ctx.fillText(posts[i].content, canvas.width/2, canvas.height/2);
                }
            }
        }
    } else {
        postsContainer.append(`<h2>No Posts To show</h2>`);
    }
};

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
    dob.html(userData.dob);
    if(userData.profile_pic) {
        profilePic.attr('src', userData.profile_pic);
    }
    if(!editable) {
        const editBtn = $('#edit');
        editBtn.addClass('d-none');
    }
};

if(!token) {
    window.location.href = '/login';
} else {
    getData();
}