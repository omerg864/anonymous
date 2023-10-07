

const dateToString = (date, type=undefined) => {
    return date.toLocaleDateString(type, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });

};

const timeToString = (date) => {
    return date.toLocaleTimeString("en-GB");
}


// TODO: add progress bar
const addToast = (message, header, sub_header) => {
    const num = Math.floor(Math.random() * 1000000);
    const toastContainer = $("#toast-container");
    const toastHtml = `<div class="toast toast-tran" role="alert" aria-live="assertive" aria-atomic="true" id="errorToast-${num}" style="opacity: 0;">
                <div class="toast-header">
                    <img src="../../src/Anonymous_logo.png" height="20px" width="20px" class="rounded me-2" alt="..."><img>
                    <strong class="me-auto" id="toast-header">${header}</strong>
                    <small id="toast-sub-header">${sub_header}</small>
                    <button type="button" class="btn-close" id="close-toast-${num}" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body" id="toast-body">
                ${message}
                </div>
            </div>`
    toastContainer.prepend(toastHtml)
    const toast = $(`#errorToast-${num}`);
    const closeToast = $(`#close-toast-${num}`);
    closeToast.click(() => {
        hideToast(num);
    });
    toast.show();
    toast.css('opacity', '0');
    setTimeout(() => {
        toast.css('opacity', '1');
    }, 100);
    setTimeout(() => {
        hideToast(num);
    }, 5000);
}

const hideToast = (num) => {
    const toast = $(`#errorToast-${num}`);
    toast.css('opacity', '0');
    setTimeout(() => {
        toast.remove();
    }, 500);
}

// TODO: add editable
const insertPosts = (posts, postsContainer, editable, page) => {
        if(posts.length === 0) {
            postsContainer.append(`<h2>No ${page ? "More" : ""} Posts To show</h2>`);
            localStorage.setItem('RemPosts', false);
        } else {
            for(let i = 0; i< posts.length; i++) {
                let content = '';
                let isCanvas = false;
                let type = posts[i].type.split(',');
                switch(type[0]) {
                    case 'text':
                        content = `<p class="post-main-content">${posts[i].content}</p>`;
                        break;
                    case 'image':
                        content = `<p class="post-main-content">${posts[i].content}</p>
                            <img src="${posts[i].media}" alt="post media" class="post-media">`;
                        break;
                    case 'video':
                        //TODO: add video tag
                        content = `<p class="post-main-content">${posts[i].content}</p>`;
                        break;
                    case 'canvas':
                        isCanvas = true;
                        content = `<div style="padding: 1rem;">
                                    <canvas id="canvas-${i}" class="post-canvas"></canvas>
                                </div>`
                        break;
                    case 'view':
                        content = `<div style="padding: 1rem; ${type[1]}">${posts[i].content}</div>`;
                        break;
                }
                let liked = posts[i].liked ? 
                `<i class='bx bxs-like' style="color: var(--primary-color)"></i>` :
                `<i class='bx bx-like' style="color: white;"></i>` ;
                let postArticle = `<article class="post background2 rounded">
                                        <div class="row">
                                            <div class="col" style="flex: 0;">
                                                <img src="/src/question_mark_icon.png" alt="profile pic" class="post-icon">
                                            </div>
                                            <div class="post-header">
                                                <div class="post-info">
                                                    <small>Anonymous (${posts[i].approved ? posts[i].f_name : ""} ${posts[i].approved ? posts[i].l_name : ""})</small>
                                                    <small>${dateToString(new Date(posts[i].updatedAt))} ${timeToString(new Date(posts[i].updatedAt))}</small>
                                                </div>
                                                <div class="position-relative">
                                                    <button type="button" class="btn btn-icon">
                                                        <i class='bx bx-dots-vertical'></i>
                                                    </button>
                                                    <ul class="dropdown-menu drop-position">
                                                        <li><a class="dropdown-item save" id="save-${posts[i]._id}">${posts[i].saved ? "remove from saved": "save"}</a></li>
                                                        ${editable ? `<li><a class="dropdown-item" href="?id=${posts[i]._id}#editPost">Edit</a></li>` : ""}
                                                        <li><a class="dropdown-item" href="?postId=${posts[i]._id}#report">Report</a></li>
                                                        ${editable ? `<li><a class="dropdown-item delete" id="delete-${posts[i]._id}" >Delete</a></li>` : ""}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        ${content}
                                        <div class="post-reactions">
                                        <small class="post-counter" id="likes-counter-${posts[i]._id}">
                                        <i class='bx bxs-like' style="color: var(--primary-color)"></i>
                                        ${posts[i].likes}</small>
                                        <small class="post-counter">
                                            ${posts[i].comments}
                                            <i class='bx bxs-comment' style="color: white;"></i>
                                        </small>
                                        </div>
                                        <div class="post-btns">
                                            <button class="btn btn-success post-btn" id="like-${posts[i]._id}">
                                                ${liked}
                                                Like
                                            </button>
                                            <button class="btn btn-success post-btn" id="comment-${posts[i]._id}">
                                            <i class='bx bx-comment' style="color: white;"></i>
                                            Comment
                                            </button>
                                        </div>
                                    </article>`
                postsContainer.append(postArticle);
                const likeBtn = $(`#like-${posts[i]._id}`);
                const commentBtn = $(`#comment-${posts[i]._id}`);
                const deleteBtn = $(`#delete-${posts[i]._id}`);
                const saveBtn = $(`#save-${posts[i]._id}`);
                saveBtn.on('click', async () => {
                    const token = localStorage.getItem('token');
                    saveBtn.css( "pointer-events", "none" );
                    await $.ajax({url: `${window.location.origin}/api/user/save/post/${posts[i]._id}`, headers: {
                        authorization: `Bearer ${token}`
                    }, success: function(result){
                        console.log(result);
                        if(result.saved) {
                            saveBtn.html(`remove from saved`);
                        } else {
                            saveBtn.html(`save`);
                        }
                    }, type: "PUT", contentType: "application/json", error: function(err){
                        addToast(err.responseJSON.message, "Error", "try again later");
                    }});
                    saveBtn.css( "pointer-events", "all" );
                });
                likeBtn.on('click', async () => {
                    const token = localStorage.getItem('token');
                    const likesCounter = $(`#likes-counter-${posts[i]._id}`);
                    likeBtn.prop( "disabled", true );
                    await $.ajax({url: `${window.location.origin}/api/post/like/${posts[i]._id}`, headers: {
                        authorization: `Bearer ${token}`
                    }, success: function(result){
                        console.log(result);
                        if(result.liked) {
                            likeBtn.html(`<i class='bx bxs-like' style="color: var(--primary-color)"></i>Like`);
                        } else {
                            likeBtn.html(`<i class='bx bx-like' style="color: white;"></i>Like`);
                        }
                        likesCounter.html(`<i class='bx bxs-like' style="color: var(--primary-color)"></i>${result.likes}`);
                    }, type: "PUT", contentType: "application/json", error: function(err){
                        addToast(err.responseJSON.message, "Error", "try again later");
                    }});
                    likeBtn.prop( "disabled", false );
                });
                commentBtn.on('click', () => {
                    window.location.href = `?id=${posts[i]._id}#post`;
                });
                deleteBtn.on('click', () => {
                    // TODO: open modal to delete
                });
                if(isCanvas) {
                    // TODO: canvas
                }
            }
        }
};

const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

const validateClass = (element, isValid) =>{
    if(isValid) {
        element.hasClass("is-invalid") ? element.removeClass("is-invalid") : null;
        element.hasClass("is-valid") ? null : element.addClass("is-valid");
    } else {
        element.hasClass("is-valid") ? element.removeClass("is-valid") : null;
        element.hasClass("is-invalid") ? null : element.addClass("is-invalid");
    }
}

const checkEmpty = (element, elementError) => {
    if(element.val() === ""){
        validateClass(element, false);
        elementError.html("Please fill this");
        return true;
    } else {
        validateClass(element, true);
        elementError.html("&nbsp;");
        return false;
    }
}


export {dateToString, timeToString, insertPosts, debounce, addToast, validateClass, checkEmpty};