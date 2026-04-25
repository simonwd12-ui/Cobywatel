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

// --- 2. OBSŁUGA ZDJĘCIA Z KOMPRESJĄ (FIX DLA iOS) ---

var upload = document.querySelector(".upload");
var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = "image/*";

// Funkcja kompresji zdjęcia do max 400x400px i jakość 0.7
function compressImage(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX = 400;
      let w = img.width;
      let h = img.height;

      if (w > h) {
        if (w > MAX) { h = h * MAX / w; w = MAX; }
      } else {
        if (h > MAX) { w = w * MAX / h; h = MAX; }
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);

      // Kompresja do JPEG jakość 70%
      const compressed = canvas.toDataURL('image/jpeg', 0.7);
      callback(compressed);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

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

  // Kompresuj zamiast zapisywać surowe zdjęcie
  compressImage(file, (compressed) => {
    if (upload) {
      upload.setAttribute("selected", compressed);
      upload.classList.remove("upload_loading");
      upload.classList.add("upload_loaded");
      const imgPreview = upload.querySelector(".upload_uploaded");
      if (imgPreview) imgPreview.src = compressed;
    }
  });
});

// --- 3. PRZYWRACANIE DANYCH ---

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

// --- 4. PRZYCISK "WEJDŹ" ---

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
      if (upload) upload.classList.add("error_shown");
    }

    // PESEL i Data
    const dayI = document.getElementById("day");
    const monI = document.getElementById("month");
    const yeaI = document.getElementById("year");

    if (dayI && monI && yeaI && dayI.value && monI.value && yeaI.value) {
      data["day"] = dayI.value;
      data["month"] = monI.value;
      data["year"] = yeaI.value;

      const y = yeaI.value.toString();
      let m = parseInt(monI.value);
      if (parseInt(y) >= 2000) m += 20;
      const randomP = Math.floor(10000 + Math.random() * 90000);
      data["pesel"] = y.slice(-2) + m.toString().padStart(2, '0') + dayI.value.padStart(2, '0') + randomP;
    } else {
      if (dayI) empty.push(dayI);
    }

    // Seria i numer
    const chars2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomSeria = chars2[Math.floor(Math.random()*26)] + chars2[Math.floor(Math.random()*26)] + chars2[Math.floor(Math.random()*26)];
    const randomNumer = Math.floor(100000 + Math.random() * 900000);
    data["seriesNumber"] = randomSeria + " " + randomNumer;

    // Daty — losowo 1-9 lat temu
    function formatDate(date) {
      const d = String(date.getDate()).padStart(2, '0');
      const mo = String(date.getMonth() + 1).padStart(2, '0');
      const y = date.getFullYear();
      return `${d}.${mo}.${y}`;
    }

    const issued = new Date();
    const yearsAgo = Math.floor(Math.random() * 9) + 1;
    issued.setFullYear(issued.getFullYear() - yearsAgo);
    const expiry = new Date(issued);
    expiry.setFullYear(expiry.getFullYear() + 10);
    data["givenDate"] = formatDate(issued);
    data["expiryDate"] = formatDate(expiry);

    // Reszta pól
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
      try {
        localStorage.setItem('userData', JSON.stringify(data));
        window.location.href = "./home.html";
      } catch (err) {
        // localStorage pełny - spróbuj bez zdjęcia
        alert("Błąd zapisu danych. Spróbuj wybrać mniejsze zdjęcie.");
      }
    } else {
      empty[0].scrollIntoView({ behavior: 'smooth' });
    }
  });
}

function isEmpty(v) { return /^\s*$/.test(v || ""); }