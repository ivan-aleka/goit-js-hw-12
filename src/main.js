import { fetchImages } from './js/pixabay-api';
import {
  renderGallery,
  clearGallery,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('.js-search-form');
const loadMoreButton = document.querySelector('.load-more');
const initialLoader = document.querySelector('#initial-loader');
const loadMoreLoader = document.querySelector('#load-more-loader');

let currentPage = 1;
let currentQuery = '';
let isLoading = false;

const showInitialLoader = () => {
  initialLoader.style.display = 'block';
  loadMoreButton.style.display = 'none';
};

const hideInitialLoader = () => {
  initialLoader.style.display = 'none';
};

const showLoadMoreLoader = () => {
  loadMoreLoader.style.display = 'block';
  loadMoreButton.style.display = 'none';
};

const hideLoadMoreLoader = () => {
  loadMoreLoader.style.display = 'none';
};

const handleSearch = async event => {
  event.preventDefault();

  const inputField = event.target.elements.user_query;
  currentQuery = inputField ? inputField.value.trim() : '';

  if (!currentQuery) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  hideLoadMoreLoader();

  try {
    showInitialLoader();
    const data = await fetchImages(currentQuery, currentPage);

    if (data.hits.length === 0) {
      iziToast.info({
        title: 'Info',
        message: 'No images found. Try a different query!',
        position: 'topRight',
      });
      return;
    }

    renderGallery(data.hits);
    showLoadMoreButton();

    if (currentPage * 15 >= data.totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideInitialLoader();
    event.target.reset();
  }
};

const handleLoadMore = async () => {
  if (isLoading) return;

  isLoading = true;
  currentPage += 1;

  showLoadMoreLoader();

  try {
    const data = await fetchImages(currentQuery, currentPage);
    renderGallery(data.hits);

    const galleryItems = document.querySelectorAll('.photo-card');
    if (galleryItems.length > 0) {
      const cardHeight = galleryItems[0].getBoundingClientRect().height;

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    if (currentPage * 15 >= data.totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.error('Error loading more images:', error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    isLoading = false;
    hideLoadMoreLoader();
  }
};

if (searchForm) {
  searchForm.addEventListener('submit', handleSearch);
}

if (loadMoreButton) {
  loadMoreButton.addEventListener('click', handleLoadMore);
}
