import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox;

export const renderGallery = images => {
  const gallery = document.querySelector('.gallery');
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="photo-card">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" />
        </a>
        <div class="info">
          <p><span>Likes</span> ${likes}</p>
          <p><span>Views</span> ${views}</p>
          <p><span>Comments</span> ${comments}</p>
          <p><span>Downloads</span> ${downloads}</p>
        </div>
      </div>
    `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    lightbox.refresh();
  }
};

export const clearGallery = () => {
  document.querySelector('.gallery').innerHTML = '';
};

export const showLoadMoreButton = () => {
  document.querySelector('.load-more').style.display = 'block';
};

export const hideLoadMoreButton = () => {
  document.querySelector('.load-more').style.display = 'none';
};
