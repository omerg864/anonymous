

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

const insertPosts = (posts, postsContainer, editable, page) => {
    console.log(postsContainer);
    if(editable) {
        if(posts.length === 0) {
            postsContainer.append(`<h2>No ${page ? "More" : ""} Posts To show</h2>`);
            localStorage.setItem('RemPosts', false);
        } else {
            for(let i = 0; i< posts.length; i++) {
                let content = '';
                let isCanvas = false;
                if(posts[i].type == 'text'){
                    content = `<p class="post-main-content">${posts[i].content}</p>`;
                } else if(posts[i].media) {
                    content = `<p class="post-main-content">${posts[i].content}</p>
                            <img src="${posts[i].media}" alt="post media" class="post-media">`;
                } else {
                    isCanvas = true;
                    content = `<div style="padding: 1rem;">
                                    <canvas id="canvas-${i}" class="post-canvas"></canvas>
                                </div>`
                }
                let liked = posts[i].liked ? 
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                    <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                </svg>` : 
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                    <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                </svg>`;
                let postArticle = `<article class="post background2 rounded">
                                        <div class="row">
                                            <div class="col" style="flex: 0;">
                                                <img src="/src/question_mark_icon.png" alt="profile pic" class="post-icon">
                                            </div>
                                            <div class="post-info">
                                                <small>Anonymous (${posts[i].user.f_name} ${posts[i].user.l_name})</small>
                                                <small>${dateToString(new Date(posts[i].updatedAt))} ${timeToString(new Date(posts[i].updatedAt))}</small>
                                            </div>
                                        </div>
                                        ${content}
                                        <div class="post-reactions">
                                        <small class="post-counter">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                                                <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                                            </svg>
                                        ${posts[i].likes}</small>
                                        <small class="post-counter">
                                            ${posts[i].comments}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-fill" viewBox="0 0 16 16">
                                                <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z"/>
                                            </svg>
                                        </small>
                                        </div>
                                        <div class="post-btns">
                                            <button class="btn btn-success post-btn" id="like-${posts[i]._id}">
                                                ${liked}
                                                Like
                                            </button>
                                            <button class="btn btn-success post-btn" id="comment-${posts[i]._id}">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16">
                                                <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                                            </svg>
                                            Comment
                                            </button>
                                        </div>
                                    </article>`
                postsContainer.append(postArticle);
                const likeBtn = $(`#like-${posts[i]._id}`);
                const commentBtn = $(`#comment-${posts[i]._id}`);
                if(isCanvas) {
                    const canvas = document.getElementById(`canvas-${i}`);
                    if(canvas) {
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
        }
    } else {
        postsContainer.append(`<h2>No Posts To show</h2>`);
    }
};

const debounce = (func, delay) => {
    let debounceTimer;
    return function() {
        clearTimeout(debounceTimer);
        timer = setTimeout(() => {
            func.call(this);
        }, delay);
    }
}

export {dateToString, timeToString, insertPosts, debounce};