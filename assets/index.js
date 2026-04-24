var params = new URLSearchParams(window.location.search);
var id = 0;
var sex = "m";

// Usunięto blokadę tokena dla celów działania na Vercelu
var upload = document.querySelector(".upload");

// Obsługa otwierania listy Płeć
var selector = document.querySelector(".selector_box");
if (selector) {
    selector.addEventListener('click', () => {
        var classes = selector.classList;
        if (classes.contains("selector_open")){
            classes.remove("selector_open")
        }else{
            classes.add("selector_open")
        }
    })
}

document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('click', () => {
        document.querySelector(".date").classList.remove("error_shown")
    })
})

document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        setSelectorOption(option.id)
    })
})

function setSelectorOption(id){
    sex = id;
    document.querySelectorAll(".selector_option").forEach((option) => {
        if (option.id === id){
            document.querySelector(".selected_text").innerHTML = option.innerHTML;
        }
    })
}

var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.png,.gif";

document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");
    if (input) {
        input.addEventListener('click', () => {
            element.classList.remove("error_shown");
        })
    }
});

if (upload) {
    upload.addEventListener('click', () => {
        imageInput.click();
        upload.classList.remove("error_shown")
    });
}

imageInput.addEventListener('change', (event) => {
    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");
    upload.removeAttribute("selected")

    var file = imageInput.files[0];
    var reader = new FileReader();
    reader.onload = (event) => {
        var url = event.target.result;
        upload.classList.remove("error_shown")
        upload.classList.add("upload_loaded");
        upload.classList.remove("upload_loading");
        setUpload(url);
    }
    reader.readAsDataURL(file);
})

function setUpload(url){
    upload.setAttribute("selected", url);
    upload.querySelector(".upload_uploaded").src = url;
}

// GŁÓWNA NAPRAWA PRZYCISKU "WEJDŹ"
var submitBtn = document.querySelector(".create") || document.querySelector(".go");
if (submitBtn) {
    submitBtn.addEventListener('click', () => {
        var empty = [];
        var data = {};

        data["sex"] = sex;
        
        // Sprawdzanie zdjęcia
        if (!upload.hasAttribute("selected")){
            empty.push(upload);
            upload.classList.add("error_shown")
        } else {
            data['image'] = upload.getAttribute("selected");
        }

        // Sprawdzanie daty
        var dateEmpty = false;
        document.querySelectorAll(".date_input").forEach((element) => {
            if (isEmpty(element.value)){
                dateEmpty = true;
            } else {
                data[element.id] = element.value
            }
        });

        if (dateEmpty){
            var dateElement = document.querySelector(".date");
            dateElement.classList.add("error_shown");
            empty.push(dateElement);
        }

        // Sprawdzanie reszty pól
        document.querySelectorAll(".input_holder").forEach((element) => {
            var input = element.querySelector(".input");
            if (isEmpty(input.value)){
                empty.push(element);
                element.classList.add("error_shown");
            } else {
                data[input.id] = input.value
            }
        });

        if (empty.length != 0){
            empty[0].scrollIntoView();
        } else {
            // Zapisujemy wszystko do localStorage zamiast wysyłać do bazy
            localStorage.setItem('userData', JSON.stringify(data));
            
            // Przekierowanie na show.html (zamiast dashboard)
            window.location.href = 'show.html';
        }
    });
}

function isEmpty(value){
    let pattern = /^\s*$/
    return pattern.test(value);
}
