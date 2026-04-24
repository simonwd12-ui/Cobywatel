const upload_grid = document.querySelector('.upload_grid');
const upload_uploaded = document.querySelector('.upload_uploaded');
const upload_uploading = document.querySelector('.upload_uploading');

upload_grid.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Pokazujemy animację ładowania
            upload_uploading.style.display = 'block';

            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Image = event.target.result;

                // Ustawiamy podgląd zdjęcia
                upload_uploaded.src = base64Image;
                upload_uploaded.style.display = 'block';
                
                // Ukrywamy kółko i przycisk dodawania
                upload_uploading.style.display = 'none';
                upload_grid.style.display = 'none';

                // ZAPISUJEMY ZDJĘCIE W PAMIĘCI (żeby nie zniknęło na show.html)
                localStorage.setItem('user_photo', base64Image);
            };
            reader.readAsDataURL(file);
        }
    };
    fileInput.click();
});
