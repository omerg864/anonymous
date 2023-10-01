
import { emailRegex, passwordRegex } from "../../utils/regex.js";
import { dateToString } from "../../utils/globalfunctions.js";
import { CLIENT_URL } from "../../utils/consts.js";

var map, searchManager, location;

window.getRegisterMap = () => {
    map = new Microsoft.Maps.Map('#myMap', {});

    Microsoft.Maps.loadModule(['Microsoft.Maps.AutoSuggest', 'Microsoft.Maps.Search'], function () {
        var manager = new Microsoft.Maps.AutosuggestManager({ map: map });
        manager.attachAutosuggest('#address', '#address-container', suggestionSelected);

        searchManager = new Microsoft.Maps.Search.SearchManager(map);
    });
}

const suggestionSelected = (result) => {
    //Remove previously results from the map.
    map.entities.clear();

    //Show the suggestion as a pushpin and center map over it.
    var pin = new Microsoft.Maps.Pushpin(result.location);
    map.entities.push(pin);
    location = result.location;
    console.log(location);

    map.setView({ bounds: result.bestView });
    $("#address").val(result.formattedSuggestion);
}

const geocode = () => {
    //Remove previously results from the map.
    map.entities.clear();

    //Get the users query and geocode it.
    var query = $('#address').val();

    var searchRequest = {
        where: query,
        callback: function (r) {
            if (r && r.results && r.results.length > 0) {
                var pin, pins = [], locs = [];

                //Add a pushpin for each result to the map and create a list to display.
                for (var i = 0; i < r.results.length; i++) {
                    //Create a pushpin for each result.
                    pin = new Microsoft.Maps.Pushpin(r.results[i].location, {

                        text: i + ''

                    });

                    pins.push(pin);
                    locs.push(r.results[i].location);
                }

                //Add the pins to the map
                map.entities.push(pins);

                //Determine a bounding box to best view the results.
                var bounds;

                if (r.results.length == 1) {
                    bounds = r.results[0].bestView;
                } else {
                    //Use the locations from the results to calculate a bounding box.
                    bounds = Microsoft.Maps.LocationRect.fromLocations(locs);
                }

                map.setView({ bounds: bounds, padding: 30 });
            }
        },
        errorCallback: function (e) {
        }
    };

    //Make the geocode request.
    searchManager.geocode(searchRequest);
}
    const registerPage = () => {
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
        password.on("input", () => {
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
            location = null;
            geocode();
        });
        const register = () => {
            let data = {
                email: email.val(),
                password: password.val(),
                f_name: f_name.val(),
                l_name: l_name.val(),
                address: address.val(),
                gender: gender.val(),
                dob: dateToString(new Date(dob.val()), "en-US"),
                location: location
            };
            $.ajax({url: `${CLIENT_URL}/api/user/register`, success: function(result){
                window.location.href = `#login`;
            }, data: JSON.stringify(data), type: "POST", contentType: "application/json", error: function(err){
                console.log(err);
            }});
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
                passwordError.html("&nbsp;");
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
                confirmPasswordError.html("&nbsp;");
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
                emailError.html("&nbsp;");
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
                elementError.html("&nbsp;");
                return false;
            }
        }
    
        const checkFields = () => {
            let valid = true;

            if(location == null){
                addressError.html("Please select a location from the dropdown");
                valid = false;
            }
    
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
    }

export { registerPage };
