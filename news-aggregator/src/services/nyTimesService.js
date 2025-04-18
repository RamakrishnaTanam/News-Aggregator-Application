import axios from "axios";

const BASE_URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

export const fetchNYTimesArticles = async (query, date, category, page = 0) => {
  
  const apiKey = process.env.REACT_APP_NYTIMES_API_KEY;
  if (!apiKey) {
    console.error("NY Times API key is missing. Please check your .env file.");
    return [];
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: query || '',
        "api-key": apiKey,
        begin_date: date ? date.replace(/-/g, "") : undefined, // Format date as YYYYMMDD
        fq: category ? `news_desk:("${category}")` : undefined, // Filter by news desk category
        page: page,
      },
    });

    return response.data.response.docs.map((item) => ({
      title: item.headline.main,
      description: item.abstract || "",
      url: item.web_url,
      imageUrl:
        item.multimedia && item.multimedia.length > 0
          ? `https://static01.nyt.com/${item.multimedia[0].url}`
          : "",
      publishedAt: item.pub_date,
      source: "The New York Times",
    }));
  } catch (error) {    
    if (error.response) {
      console.error(
        `Error fetching NY Times articles: ${error.response.status} - ${error.response.statusText}`
      );
    } else {
      console.error("Error fetching NY Times articles:", error.message);
    }
    return [];
  }
};
