import { fetchImages } from './js/pixabay-api';
import {
  renderGallery,
  clearGallery,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

const searchForm = document.querySelector('.js-search-form');
const loadMoreButton = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

let currentPage = 1;
let currentQuery = '';

const handleSearch = async event => {
  event.preventDefault();

  const inputField = event.target.elements.user_query;
  currentQuery = inputField ? inputField.value.trim() : '';

  if (!currentQuery) {
    alert('Please enter a search query!');
    return;
  }

  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();

  try {
    loader.style.display = 'block';
    const data = await fetchImages(currentQuery, currentPage);

    if (data.hits.length === 0) {
      alert('No images found. Try a different query!');
      return;
    }

    renderGallery(data.hits);
    showLoadMoreButton();

    if (currentPage * 15 >= data.totalHits) {
      hideLoadMoreButton();
      alert("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    alert('Something went wrong. Please try again later.');
  } finally {
    loader.style.display = 'none';
    event.target.reset();
  }
};

const handleLoadMore = async () => {
  currentPage += 1;
  try {
    loader.style.display = 'block';
    const data = await fetchImages(currentQuery, currentPage);

    renderGallery(data.hits);

    if (currentPage * 15 >= data.totalHits) {
      hideLoadMoreButton();
      alert("We're sorry, but you've reached the end of search results.");
    }

    const { height: cardHeight } = document
      .querySelector('.gallery .photo-card')
      .getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    console.error('Error loading more images:', error);
    alert('Something went wrong. Please try again later.');
  } finally {
    loader.style.display = 'none';
  }
};

if (searchForm) {
  searchForm.addEventListener('submit', handleSearch);
}

if (loadMoreButton) {
  loadMoreButton.addEventListener('click', handleLoadMore);
}
