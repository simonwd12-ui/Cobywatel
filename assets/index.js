// Obsługa rozwijanego menu (Płeć)
var selector = document.querySelector(".selector_box");
if (selector) {
  selector.addEventListener("click", () => {
    selector.classList.toggle("selector_open");
  });
}

// Usuwanie błędów przy kliknięciu w datę
document.querySelectorAll(".date_input").forEach((element) => {
  element.addEventListener("click", () => {
    document.querySelector(".date").classList.remove("error_shown");
  });
});

var sex = "m";

// Wybór opcji płci
document.querySelectorAll(".selector_option").forEach((option) => {
  option.addEventListener("click", () => {
    sex = option.id;
    document.querySelector(".selected_text").innerHTML = option.innerHTML;
  });
});

// Obsługa zdjęcia
var upload = document.querySelector(".upload");
var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = "image/*";

// Usuwanie błędów przy polach tekstowych
document.querySelectorAll(".input_holder").forEach((element) => {
  var input = element.querySelector(".input");
  input.addEventListener("click", () => {
    element.classList.remove("error_shown");
  });
});

upload.addEventListener("click", () => {
  imageInput.click();
  upload.classList.remove("error_shown");
});

// PRZETWARZANIE ZDJĘCIA (Lokalne - najszybsze na Vercel)
imageInput.addEventListener("change", (event) => {
  upload.classList.remove("upload_loaded");
  upload.classList.add("upload_loading");

  var file = imageInput.files[0];
  var reader = new FileReader();
  
  reader.onload = (e) => {
    var url = e.target.result;
    upload.setAttribute("selected", url);
    upload.classList.remove("upload_loading");
    upload.classList.add("upload_loaded");
    upload.querySelector(".upload_uploaded").src = url;
  };
  reader.readAsDataURL(file);
});

// PRZYCISK "WEJDŹ" (Przekazywanie wszystkich danych)
document.querySelector(".go").addEventListener("click", () => {
  var empty = [];
  var data = {};

  data["sex"] = sex;
  
  if (!upload.hasAttribute("selected")) {
    empty.push(upload);
    upload.classList.add("error_shown");
  } else {
    data["image"] = upload.getAttribute("selected");
  }

  // Zbieranie daty
  const day = document.getElementById("day");
  const month = document.getElementById("month");
  const year = document.getElementById("year");

  [day, month, year].forEach((input) => {
    if (isEmpty(input.value)) {
      document.querySelector(".date").classList.add("error_shown");
      empty.push(input);
    } else {
      data[input.id] = input.value;
    }
  });

  // Zbieranie reszty pól
  document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");
    if (isEmpty(input.value)) {
      empty.push(element);
      element.classList.add("error_shown");
    } else {
      data[input.id] = input.value;
    }
  });

  if (empty.length != 0) {
    empty[0].scrollIntoView();
  } else {
    // ZAPIS I PRZEJŚCIE
    localStorage.setItem('userData', JSON.stringify(data));
    location.href = "id.html"; // Przekierowanie na Twoją stronę z dowodem
  }
});

function isEmpty(value) {
  return /^\s*$/.test(value || "");
}

// Obsługa instrukcji (guide)
var guide = document.querySelector(".guide_holder");
if (guide) {
  guide.addEventListener("click", () => {
    guide.classList.toggle("unfolded");
  });
}