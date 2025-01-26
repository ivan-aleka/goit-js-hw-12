import axios from 'axios';

export const fetchImages = async (query, page = 1, perPage = 15) => {
  const response = await axios.get('https://pixabay.com/api/', {
    params: {
      key: '48303854-cd498063b7025b62fb7eab433',
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: perPage,
    },
  });

  if (response.status !== 200) {
    throw new Error(`Error: ${response.status}`);
  }
  return response.data;
};
