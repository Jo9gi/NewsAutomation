# -*- coding: utf-8 -*-
import requests
import csv
from datetime import datetime
import os

API_KEY = os.getenv("NEWS_API_KEY", "pub_79001194bab608349b3061a81f5c91566598d")
NEWS_URL = "https://newsdata.io/api/1/news"

NEGATIVE_KEYWORDS = [
    "lawsuit", "hack", "breach", "shutdown", "failure",
    "cyberattack", "fraud", "crime", "scam", "layoffs"
]

def fetch_positive_news(query="IT innovation", category="technology", language="en"):
    params = {
        "apikey": API_KEY,
        "q": query,
        "language": language,
        "category": category
    }

    response = requests.get(NEWS_URL, params=params)
    if response.status_code != 200:
        print(f"[ERROR] Error fetching data: {response.status_code}")
        return []

    articles = response.json().get("results", [])
    positive_news = []

    for article in articles:
        title = article.get("title", "")
        description = article.get("description", "")
        link = article.get("link", "")
        pub_date = article.get("pubDate", "")

        full_text = f"{title} {description}".lower()
        if any(bad in full_text for bad in NEGATIVE_KEYWORDS):
            continue

        positive_news.append({
            "title": title,
            "description": description,
            "link": link,
            "pubDate": pub_date
        })

    return positive_news

def save_to_csv(news_list, filename="headlines.csv"):
    keys = news_list[0].keys() if news_list else []
    with open(filename, 'w', newline='', encoding='utf-8') as output_file:
        dict_writer = csv.DictWriter(output_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(news_list)

if __name__ == "__main__":
    positive_articles = fetch_positive_news()
    if positive_articles:
        today_date = datetime.now().strftime('%Y-%m-%d')
        print(f"Current date being used: {today_date}")
        # Construct the path relative to the script's directory
        script_dir = os.path.dirname(os.path.abspath(__file__))
        data_dir = os.path.join(script_dir, '../', 'data')
        filename = os.path.join(data_dir, f'headline_{today_date}.csv')
        
        # Create the data directory if it doesn't exist
        os.makedirs(data_dir, exist_ok=True)
        
        save_to_csv(positive_articles, filename)
        print(f"[SUCCESS] Successfully fetched and saved {len(positive_articles)} positive articles to {filename}")
    else:
        print("[WARNING] No positive articles found.")
