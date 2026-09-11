/* =========================================================
   OUR LITTLE UNIVERSE
   Pure JavaScript — no libraries, no Python, no server.

   Normal chapter photos:
   photos/beginning/001.jpg ...
   photos/medan/001.jpg ...
   photos/poland/001.jpg ...
   photos/engagement/001.jpg ...
   photos/memories/001.jpg ...

   Random memory vault:
   photos/random/001.jpg ... photos/random/100.jpg
   ========================================================= */

const galleries = document.querySelectorAll('.gallery');
const loadedPhotos = [];

function pad(number) {
    return String(number).padStart(3, '0');
}

function addPhoto(folder, number, gallery) {
    const wrapper = document.createElement('figure');
    wrapper.className = 'photo';

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = 'A memory from our story';
    img.src = `photos/${folder}/${pad(number)}.jpg`;

    img.addEventListener('load', () => {
        loadedPhotos.push({ src: img.src, folder });
    });

    img.addEventListener('error', () => {
        wrapper.remove();
    });

    wrapper.appendChild(img);
    gallery.appendChild(wrapper);
}

galleries.forEach(gallery => {
    const folder = gallery.dataset.gallery;
    const count = Number(gallery.dataset.count || 20);

    for (let i = 1; i <= count; i++) {
        addPhoto(folder, i, gallery);
    }
});

/* ---------------------------------------------------------
   RANDOM MEMORY VAULT
   Exactly 100 possible filenames: 001.jpg → 100.jpg
   The first one is chosen automatically when the page opens.
   Every button click chooses another one.
   The same photo is never selected twice in a row.
   --------------------------------------------------------- */

const RANDOM_FOLDER = 'photos/random/';
const RANDOM_COUNT = 100;
let currentRandomNumber = null;
let randomPhoto = document.getElementById('randomPhoto');
let randomCaption = document.getElementById('randomCaption');
let randomButton = document.getElementById('randomMemory');

function randomNumber() {
    let number;

    do {
        number = Math.floor(Math.random() * RANDOM_COUNT) + 1;
    } while (number === currentRandomNumber && RANDOM_COUNT > 1);

    return number;
}

function showRandomMemory(shouldScroll = false) {
    const number = randomNumber();
    currentRandomNumber = number;

    const filename = `${pad(number)}.jpg`;
    const src = `${RANDOM_FOLDER}${filename}`;

    randomPhoto.classList.remove('random-photo-visible');

    randomPhoto.onload = () => {
        randomPhoto.classList.add('random-photo-visible');
        randomCaption.textContent = `A little piece of us — memory ${pad(number)} of 100. ♥`;
    };

    randomPhoto.onerror = () => {
        randomPhoto.removeAttribute('src');
        randomCaption.textContent = `I couldn't find ${filename}. Add all 100 photos to photos/random/ and it'll be ready. ♥`;
    };

    randomPhoto.src = src;

    if (shouldScroll) {
        document.getElementById('randomResult').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

randomButton.addEventListener('click', () => showRandomMemory(true));

/* Start with a random memory automatically. */
showRandomMemory();
