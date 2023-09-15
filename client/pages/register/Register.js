
import { emailRegex, passwordRegex } from "../../utils/regex.js";
import { dateToString } from "../../utils/globalfunctions.js";


document.addEventListener("DOMContentLoaded", (event) => {
    let form = document.querySelector("#register-form");
    var f_name = $("#f_name");
    var f_nameError = $("#f-name-error");
    var l_name = $("#l_name");
    var l_nameError = $("#l-name-error");
    var address = $("#address");
    var addressError = $("#address-error");
    var email = $("#email");
    var emailError = $("#email-error");
    var password = $("#password");
    var passwordError = $("#password-error");
    var confirmPassword = $("#confirm-password");
    var confirmPasswordError = $("#confirm-password-error");
    var gender = $("#gender");
    var dob = $("#dob");
    dob.val("2000-01-29");
    form.addEventListener("submit", (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (checkFields()) {
            console.log("form submitted");
            register();
        } else {
            console.log("form not submitted");
            // toast error
        }
    });

    // password changed input event jquery
    password.on("input", (e) => {
        checkPassword();
        if(confirmPassword.val() !== "")
            checkConfirmPassword();
    });

    // confirm password changed input event jquery
    confirmPassword.on("input", (e) => {
        checkConfirmPassword();
    });

    // email changed input event jquery
    email.on("input", (e) => {
        checkEmail();
    });

    // first name changed input event jquery
    f_name.on("input", (e) => {
        checkEmpty(f_name, f_nameError);
    });

    // last name changed input event jquery
    l_name.on("input", (e) => {
        checkEmpty(l_name, l_nameError);
    });

    // address changed input event jquery
    address.on("input", (e) => {
        checkEmpty(address, addressError);
    });


    const register = () => {
        let data = {
            email: email.val(),
            password: password.val(),
            f_name: f_name.val(),
            l_name: l_name.val(),
            address: address.val(),
            gender: gender.val(),
            dob: dateToString(new Date(dob.val()))
        };
        $.ajax({url: "http://localhost:5600/api/user/register", success: function(result){
            console.log(result);
        }, data: JSON.stringify(data), type: "POST", contentType: "application/json"});
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

    const checkPassword = () => {
        let passwordVal = password.val();
        if(!passwordRegex.test(passwordVal)){
            passwordError.html("Password does not meet requirements");
            validateClass(password, false);
            return false;
        } else {
            passwordError.html("");
            validateClass(password, true);
            return true;
        }
    }

    const checkConfirmPassword = () => {
        let passwordVal = password.val();
        let confirmPasswordVal = confirmPassword.val();

        if(checkEmpty(confirmPassword, confirmPasswordError)){
            return false;
        }

        if(passwordVal !== confirmPasswordVal){
            confirmPasswordError.html("Passwords do not match");
            validateClass(confirmPassword, false);
            return false;
        } else {
            confirmPasswordError.html("");
            validateClass(confirmPassword, true);
            return true;
        }
    }

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

    const checkEmpty = (element, elementError) => {
        if(element.val() === ""){
            validateClass(element, false);
            elementError.html("This field is required");
            return true;
        } else {
            validateClass(element, true);
            elementError.html("");
            return false;
        }
    }

    const checkFields = () => {
        let valid = true;

        if(!checkPassword()) {
            valid = false;
        }
        if (!checkConfirmPassword()) {
            valid = false;
        }
        if (!checkEmail()) {
            valid = false;
        }
        if(checkEmpty(f_name, f_nameError)){
            valid = false;
        }

        if(checkEmpty(l_name, l_nameError)){
            valid = false;
        }

        if(checkEmpty(address, addressError)){
            valid = false;
        }

        return valid;
    }

  });

