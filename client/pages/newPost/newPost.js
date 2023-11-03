import { checkEmpty, debounce } from "../../utils/globalFunctions.js";

const form = $('#new-post-form');
const text = $('text');
const text_error = $('#text-error');
const type = $('#type');
const fileContainer = $('#fileContainer');
const file = $('#file');
const file_error = $('#file-error');
const colorContainer = $('#colorContainer');
const fontColor = $('#fontColor');
const backgroundColor = $('#backgroundColor');
const color_error = $('#color-error');
const fontContainer = $('#fontContainer');
const font = $('#font');
const font_error = $('#font-error');
const canvasContainer = $('#canvasContainer');
const canvas = $('#canvas');

const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
if(!token || !user)
    window.location.href = '?#login';

text.on("keyup", debounce((e) => {
    checkEmpty(text, text_error);
}, 700));

type.on('change', (e) => {
    console.log(type.val());
    switch(type.val()) {
        case 'text':
            fileContainer.addClass('d-none');
            colorContainer.addClass('d-none');
            fontContainer.addClass('d-none');
            canvasContainer.addClass('d-none');
            break;
        case 'image':
            fileContainer.removeClass('d-none');
            colorContainer.addClass('d-none');
            fontContainer.addClass('d-none');
            canvasContainer.addClass('d-none');
            break;
        case 'video':
            fileContainer.removeClass('d-none');
            colorContainer.addClass('d-none');
            fontContainer.addClass('d-none');
            canvasContainer.addClass('d-none');
            break;
        case 'canvas':
            fileContainer.addClass('d-none');
            colorContainer.removeClass('d-none');
            fontContainer.removeClass('d-none');
            canvasContainer.removeClass('d-none');
            break;
        case 'view':
            fileContainer.addClass('d-none');
            colorContainer.removeClass('d-none');
            fontContainer.removeClass('d-none');
            canvasContainer.addClass('d-none');
            break;
    }
});


form.on('submit', (e) => {
    e.preventDefault();
    if(checkEmpty(text, text_error)) {
        return;
    }
    createPost();
});

const createPost = async () => {
    const token = localStorage.getItem('token');
    const text = $("#text");
    $('#main').addClass('d-none');
    $('#spinner').removeClass('d-none');
    await $.ajax({url: `${window.location.origin}/api/post/new`, headers: {
        authorization: `Bearer ${token}`
    }, success: function(result){
        console.log(result);
        $('#main').removeClass('d-none');
        $('#spinner').addClass('d-none');
        window.location.href = `?#profile`;
    }, type: "POST", data: JSON.stringify({ 
        text: text.val()
    }), contentType: "application/json", error: function(err){
        console.log(err);
        $('#main').removeClass('d-none');
        $('#spinner').addClass('d-none');
        addToast(err.responseJSON.message, 'error', 'try again later');
    }});
}