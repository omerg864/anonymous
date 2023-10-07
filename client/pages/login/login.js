import { addToast } from "../../utils/globalFunctions.js";
import {emailRegex} from "../../utils/regex.js";

var userError = $("#user-Error");
var emailError = $("#email-error");
const checkEmail = () => {
    let emailVal = email.val();
    if(!emailRegex.test(emailVal)){
        emailError.html("Email is not valid");
        validateClass(email, false);
        return false;
    } else {
        emailError.html("");
        validateClass(email, true);
        return true;
    }
}
const LoginPage = () => {
    let form = document.querySelector("#Login-form");

    console.log(form);
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        login();
});

}

const login = () => {
    var password = $("#password");
    var email = $("#email");
    let data = {
        email: email.val(),
        password: password.val(),
    };
    $.ajax({
        url: `${window.location.origin}/api/user/login`, success: function (result) {
            console.log(result);
            localStorage.setItem("user",JSON.stringify(result.user))
            localStorage.setItem("token",result.user.token)
            window.location.href="#home";
        }, data: JSON.stringify(data), type: "POST", contentType: "application/json", error: function (err) {
            addToast(err.responseJSON.message, "Error", "try again");
            toastNum++;
        }
    });



}
export { LoginPage };
