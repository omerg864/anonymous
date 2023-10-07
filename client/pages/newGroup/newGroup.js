import { debounce, checkEmpty, validateClass, addToast } from "../../utils/globalFunctions.js";

    const form = $("#new-group-form");
    const name = $("#name");
    const nameError = $("#name-error");

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if(!token || !user)
        window.location.href = '?#login';
    name.on("keyup", debounce((e) => {
        checkEmpty(name, nameError);
    }, 700));

    form.on('submit', (e) => {
        e.preventDefault();
        console.log('submit');
        if(checkEmpty(name, nameError))
            return;
        console.log('create group');
        createGroup();
    });


const createGroup = async () => {
    const token = localStorage.getItem('token');
    const description = $("#desc");
    const name = $("#name");
    $('#main').addClass('d-none');
    $('#spinner').removeClass('d-none');
    await $.ajax({url: `${window.location.origin}/api/group`, headers: {
        authorization: `Bearer ${token}`
    }, success: function(result){
        console.log(result);
        $('#main').removeClass('d-none');
        $('#spinner').addClass('d-none');
        window.location.href = `?id=${result.group._id}#group`;
    }, type: "POST", data: JSON.stringify({ 
        name: name.val(),
        description: description.val()
    }), contentType: "application/json", error: function(err){
        console.log(err);
        $('#main').removeClass('d-none');
        $('#spinner').addClass('d-none');
        addToast(err.responseJSON.message, 'error', 'try again later');
    }});
}