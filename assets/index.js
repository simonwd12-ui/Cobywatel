document.addEventListener('DOMContentLoaded', () => {
    const photoInput = document.getElementById('photoInput');
    const uploadTrigger = document.getElementById('uploadTrigger');
    const preview = document.getElementById('preview');
    const placeholderGrid = document.getElementById('placeholderGrid');
    const submitBtn = document.getElementById('submitBtn');

    // 1. Obsługa kliknięcia w ramkę zdjęcia
    uploadTrigger.addEventListener('click', () => {
        photoInput.click();
    });

    // 2. Podgląd wybranego zdjęcia i zapis do pamięci
    photoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const base64Image = e.target.result;
                preview.src = base64Image;
                preview.style.display = 'block';
                placeholderGrid.style.display = 'none';
                
                // Zapisujemy zdjęcie (Base64) w localStorage
                localStorage.setItem('userPhoto', base64Image);
            }
            reader.readAsDataURL(file);
        }
    });

    // 3. Zapisywanie wszystkich danych po kliknięciu "Wejdź"
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const userData = {
            name: document.getElementById('name').value,
            surname: document.getElementById('surname').value,
            gender: document.getElementById('gender').value,
            day: document.getElementById('day').value,
            month: document.getElementById('month').value,
            year: document.getElementById('year').value,
            nationality: document.getElementById('nationality').value,
            familyName: document.getElementById('familyName').value,
            address1: document.getElementById('address1').value,
            address2: document.getElementById('address2').value,
            city: document.getElementById('city').value
        };

        // Sprawdzanie czy imię i nazwisko są wpisane
        if (userData.name === "" || userData.surname === "") {
            alert("Wypełnij imię i nazwisko!");
            return;
        }

        // Zapisujemy obiekt z danymi jako tekst JSON
        localStorage.setItem('userData', JSON.stringify(userData));

        // PRZEKIEROWANIE (zmień 'dowod.html' na nazwę swojego pliku z dokumentem)
        window.location.href = 'dowod.html'; 
    });
});
