// --- 1. OBSŁUGA INTERFEJSU (PŁEĆ, MENU) ---
var selector = document.querySelector(".selector_box");
if (selector) {
  selector.addEventListener("click", () => {
    selector.classList.toggle("selector_open");
  });
}

document.querySelectorAll(".date_input").forEach((element) => {
  element.addEventListener("click", () => {
    const dateBox = document.querySelector(".date");
    if (dateBox) dateBox.classList.remove("error_shown");
  });
});

var sex = "m";
document.querySelectorAll(".selector_option").forEach((option) => {
  option.addEventListener("click", () => {
    sex = option.id;
    const selectedText = document.querySelector(".selected_text");
    if (selectedText) selectedText.innerHTML = option.innerHTML;
  });
});

// --- 2. OBSŁUGA ZDJĘCIA (SZYBKIE PRZETWARZANIE) ---
var upload = document.querySelector(".upload");
var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = "image/*";

if (upload) {
  upload.addEventListener("click", () => {
    imageInput.click();
    upload.classList.remove("error_shown");
  });
}

imageInput.addEventListener("change", (event) => {
  if (upload) {
    upload.classList.add("upload_loading");
  }
  var file = imageInput.files[0];
  var reader = new FileReader();
  reader.onload = (e) => {
    var url = e.target.result;
    if (upload) {
      upload.setAttribute("selected", url);
      upload.classList.remove("upload_loading");
      upload.classList.add("upload_loaded");
      const imgPreview = upload.querySelector(".upload_uploaded");
      if (imgPreview) imgPreview.src = url;
    }
  };
  reader.readAsDataURL(file);
});

// --- 3. PRZYWRACANIE DANYCH (ŻEBY NIE ZNIKAŁY PO ZAMKNIĘCIU) ---
document.addEventListener('DOMContentLoaded', () => {
  const savedData = localStorage.getItem('userData');
  if (savedData) {
    const data = JSON.parse(savedData);
    Object.keys(data).forEach(key => {
      const input = document.getElementById(key);
      if (input && !['image', 'sex'].includes(key)) {
        input.value = data[key];
      }
    });
    if (data.sex) {
      sex = data.sex;
      const selectedText = document.querySelector(".selected_text");
      if (selectedText) selectedText.innerHTML = (sex === 'm') ? 'Mężczyzna' : 'Kobieta';
    }
    if (data.image && upload) {
      upload.setAttribute("selected", data.image);
      upload.classList.add("upload_loaded");
      const imgPreview = upload.querySelector(".upload_uploaded");
      if (imgPreview) imgPreview.src = data.image;
    }
  }
});

// --- 4. PRZYCISK "WEJDŹ" + GENERATOR LOSOWEJ SERII I PESEL ---
const goBtn = document.querySelector(".go");
if (goBtn) {
  goBtn.addEventListener("click", (e) => {
    e.preventDefault();
    var empty = [];
    var data = {};
    data["sex"] = sex;

    // Zdjęcie
    if (upload && upload.hasAttribute("selected")) {
      data["image"] = upload.getAttribute("selected");
    } else {
      empty.push(upload);
      upload.classList.add("error_shown");
    }

    // PESEL i Data
    const dayI = document.getElementById("day");
    const monI = document.getElementById("month");
    const yeaI = document.getElementById("year");
    if (dayI.value && monI.value && yeaI.value) {
      data["day"] = dayI.value;
      data["month"] = monI.value;
      data["year"] = yeaI.value;
      const y = yeaI.value.toString();
      let m = parseInt(monI.value);
      if (parseInt(y) >= 2000) m += 20;
      const randomP = Math.floor(10000 + Math.random() * 90000);
      data["pesel"] = y.slice(-2) + m.toString().padStart(2, '0') + dayI.value.padStart(2, '0') + randomP;
    } else {
      empty.push(dayI);
    }

    // Generator losowej serii i numeru
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomSeria = chars[Math.floor(Math.random()*26)] + chars[Math.floor(Math.random()*26)] + chars[Math.floor(Math.random()*26)];
    const randomNumer = Math.floor(100000 + Math.random() * 900000);
    data["seriesAndNumber"] = randomSeria + " " + randomNumer;

    // Automatyczne daty wydania
    const today = new Date();
    const issueDate = new Date();
    issueDate.setFullYear(today.getFullYear() - 1);
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(issueDate.getFullYear() + 10);
    data["givenDate"] = issueDate.toLocaleDateString('pl-PL');
    data["expiryDate"] = expiryDate.toLocaleDateString('pl-PL');

    // Zbieranie reszty (imię, nazwisko itd.)
    document.querySelectorAll(".input_holder").forEach((element) => {
      var input = element.querySelector(".input");
      if (input) {
        if (!input.value.trim()) {
          empty.push(element);
          element.classList.add("error_shown");
        } else {
          data[input.id] = input.value;
        }
      }
    });

    if (empty.length === 0) {
      localStorage.setItem('userData', JSON.stringify(data));
      window.location.href = "./card.html"; // ← TU JEST ZMIANA
    } else {
      empty[0].scrollIntoView({ behavior: 'smooth' });
    }
  });
}

function isEmpty(v) { return /^\s*$/.test(v || ""); }