import axios from "axios";
import Notiflix from "notiflix";
import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css"; 

// пошук по елементам
const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('.form__input'),
    gallery: document.querySelector('.gallery'),
    btnLoadMore: document.querySelector('.load-more')
};

let page = 1;

refs.btnLoadMore.style.display = 'none';
refs.form.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onBtnLoadMore);

function onSearch(e) {
    e.preventDefault();

    page = 1;
    refs.gallery.innerHTML = '';

    const name = refs.input.value.trim();

    if (name !== '') {
        pixabay(name)
    } else {
        refs.btnLoadMore.style.display = 'none';
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
}



//робота з кнопкою LOAD MORE
function onBtnLoadMore() {
    const name = refs.input.value.trim();
    page = + 1,
    pixabay(name, page);
}






// робота з бек-ендом 
async function pixabay(name, page) {
    const API_URL = 'https://pixabay.com/api/';

    const options = {
        params: {
            key: '33939880-6980ae7d7dcf6a315ba694d35',
            q: name,
            image_type: 'photo',
            orientation: 'horizontal',
            safeserch: 'true',
            page: page,
            per_page: 40,
        },
    };

    try {
        const response = await axios.get(API_URL, options)
    
        //Повідомлення про знайдені дані
        if (response.data.hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')   
        } else {
            Notiflix.Notify.success(`Hoorray! We found ${response.data.totalHits}`)
        }
        
        //виклик функції для рендеру даних на сторінку
        createMarkup(response.data);

        if (page === 1) {
            refs.btnLoadMore.style.display = 'flex';
        }
    } catch (error) {
        console.log(error);
    } 
}

//функція для рендерингу розмітки в галерею
function createMarkup(array) {
    const markup = array.hits.map(item =>  
    `<a class='photo-link' href='${item.largeImageURL}'>
            <div class="photo-card">
        <div class="photo">
        <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
        </div>
        <div class="info">
            <p class="info-item">
            <b>Likes ${item.likes}</b>
            </p>
            <p class="info-item">
            <b>Views ${item.views}</b>
            </p>
            <p class="info-item">
            <b>Comments ${item.comments}</b>
            </p>
            <p class="info-item">
            <b>Downloads ${item.downloads}</b>
            </p>
        </div>
    </div>
</a>`
)
.join('');
    
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    simpleLightbox.refresh();
}

//екземпляр модального вікна слайдера-зображень
const simpleLightbox = new simpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
}); 