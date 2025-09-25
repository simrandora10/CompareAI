import axios from "axios";
import * as cheerio from "cheerio";

async function scrapeProduct(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  // Example selectors (adjust to your product site)
  const title = $("h1").first().text().trim();
  const price = $(".price").first().text().trim();
  const description = $("p").first().text().trim();

  return `${title}. ${price}. ${description}`;
}

export { scrapeProduct };
