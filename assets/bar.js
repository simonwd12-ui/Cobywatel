var params = new URLSearchParams(window.location.search);

var bar = document.querySelectorAll(".bottom_element_grid");

var top = localStorage.getItem('top');

var bottom;

if (localStorage.getItem('bottom')){
  bottom = localStorage.getItem('bottom');
  bar.forEach((element) => {
    var image = element.querySelector('.bottom_element_image');
    var text = element.querySelector('.bottom_element_text');
    var send = element.getAttribute('send');

    if (send === bottom){
      image.classList.add(bottom + "_open");
      text.classList.add("open");
    } else {
      image.classList.remove(send + "_open");
      image.classList.add(send);
      text.classList.remove("open");
    }
  });
}

// Mapowanie nazw na pliki HTML
var pageMap = {
  'home':      'home.html',
  'documents': 'card.html',
  'card':      'card.html',
  'document':  'document.html',
  'services':  'services.html',
  'qr':        'qr.html',
  'more':      'more.html',
  'pesel':     'pesel.html',
  'shortcuts': 'shortcuts.html',
  'scan':      'scan.html',
  'show':      'show.html',
};

function sendTo(url, top, bottom){
  if (top){
    localStorage.setItem('top', top);
  }
  if (bottom){
    localStorage.setItem('bottom', bottom);
  }

  // Użyj mapowania jeśli istnieje, inaczej użyj url bezpośrednio
  var target = pageMap[url] || (url + '.html');
  window.location.href = target;
}

var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
var optionsTime = { second: '2-digit', minute: '2-digit', hour: '2-digit' };

bar.forEach((element) => {
  element.addEventListener('click', () => {
    localStorage.removeItem('top');
    localStorage.removeItem('bottom');
    sendTo(element.getAttribute("send"));
  });
});

// Strzałka Wróć - zawsze wraca do home.html
document.addEventListener('DOMContentLoaded', () => {
  var backBtn = document.querySelector('.back_text_fixed');
  var backImg = document.querySelector('.back_img_fixed');

  if (backBtn && !backBtn.getAttribute('onclick')) {
    backBtn.style.cursor = 'pointer';
    backBtn.addEventListener('click', () => {
      window.location.href = 'home.html';
    });
  }
  if (backImg) {
    backImg.style.cursor = 'pointer';
    backImg.addEventListener('click', () => {
      window.location.href = 'home.html';
    });
  }
});

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/windows phone/i.test(userAgent)) {
    return 1;
  }
  if (/android/i.test(userAgent)) {
    return 2;
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 3;
  }
  return 4;
}

if (getMobileOperatingSystem() == 2){
  document.querySelector(".bottom_bar").style.height = "70px";
}

function getRandom(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}