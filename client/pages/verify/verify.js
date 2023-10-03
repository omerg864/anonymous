import { CLIENT_URL } from "../../utils/consts.js"


// TODO: check verify user page
const verifyUser = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const spinner = $('#spinner');
    const main = $('#main');
    let isLoading = true;
    spinner.removeClass('d-none');
    main.addClass('d-none');
    const verify = $('#verify');
    if(id){
        await $.ajax({url: `${CLIENT_URL}/api/user/verify/${id}`, success: function(result){
            verify.html("Email verified successfully. You will be redirected to login page in 5 seconds...");
            spinner.addClass('d-none');
            main.removeClass('d-none');
            isLoading = false;
            setTimeout(() => {
                window.location.href = `?#login`;
            }, 5000);
        }, type: "GET", contentType: "application/json", error: function(err){
            verify.html(err.message);
            spinner.addClass('d-none');
            main.removeClass('d-none');
            isLoading = false;
        }});
    } else {
        spinner.addClass('d-none');
        main.removeClass('d-none');
        isLoading = false;
        verify.html('Invalid verification link');
    }
}

export { verifyUser };