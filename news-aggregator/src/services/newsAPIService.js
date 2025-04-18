import axios from "axios";

const BASE_URL = "https://newsapi.org/v2/top-headlines";

export const fetchNewsAPIArticles = async (query, date, category, page = 1) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: query || '',
        category: category || '',
        apiKey: process.env.REACT_APP_NEWS_API_KEY,
        language: "en",
        page: page,
        ...(date && { from: date }), // Use the date directly
      },
    });
    
    console.log("NewsAPI Response:", response.data);
    
    if (response.data.status === 'ok' && response.data.articles.length > 0) {
      return response.data.articles.map((item) => ({
        title: item.title,
        description: item.description,
        url: item.url,
        imageUrl: item.urlToImage,
        publishedAt: item.publishedAt,
        source: item.source.name,
      }));
    } else {
      console.warn("No articles found for the provided query, date, or category.");
      return [];
    }
  } catch (error) {    
    return [];
  }
};
