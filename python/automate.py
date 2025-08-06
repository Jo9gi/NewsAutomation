import pandas as pd
import numpy as np
import datetime
import os
# from GoogleNews import GoogleNews
from newsdata_fetcher import fetch_positive_news
from utils.helper import newsfeed
from utils.arg_parse import parse_arguments
from models.sentiment_analysis_model import create_sentiment_analysis_model
from models.text_summarization_model import create_text_summarization_model
from web_scraper import WebScraper
from cache_manager import CacheManager

scraper = WebScraper()
sentiment_model = create_sentiment_analysis_model()
summarization_model = create_text_summarization_model()
cache_manager = CacheManager()

def summarize_article(url):
    scraper = WebScraper()
    # summarizer = TextSummarizationModel()
    article_text = scraper.scrape(url)
    return summarization_model.summarize(article_text)

def analyse_sentiment(title):
    return sentiment_model.apply_model(title)

def main():
    print("🔍 Checking for fresh news data...")
    
    # Check if we need to fetch new data (default: 6 hours cache)
    if not cache_manager.should_fetch_new_data("news", max_age_hours=6):
        print("✅ Using cached data - no need to fetch new data")
        
        # Get the latest CSV file
        latest_file = cache_manager.get_latest_csv_file()
        if latest_file and os.path.exists(latest_file):
            print(f"📊 Loading data from: {latest_file}")
            df = pd.read_csv(latest_file)
            print(f"✅ Loaded {len(df)} articles from cache")
            return df
        else:
            print("⚠️ Cache indicates fresh data but file not found, fetching new data...")
    
    print("🔍 Fetching positive IT innovation news from NewsData.io...")
    news_list = fetch_positive_news()

    if not news_list:
        print("😕 No positive news found.")
        return None

    df = pd.DataFrame(news_list)

    # Add timestamp columns
    now = datetime.datetime.now()
    df["Processed Date"] = now.strftime("%Y-%m-%d")
    df["Processed Time"] = now.strftime("%H:%M:%S")

    try:
        print("🤖 Processing sentiment analysis...")
        df['Sentiment'] = df['title'].apply(analyse_sentiment)
        print("📝 Generating article summaries...")
        df['Summary'] = df['link'].apply(summarize_article)
    except Exception as e:
        print("⚠️ Error during NLP processing:", e)

    # Auto-name CSV file with correct path
    filename = f"data/headline_{now.strftime('%Y-%m-%d')}.csv"

    try:
        # Ensure data directory exists
        os.makedirs("data", exist_ok=True)
        df.to_csv(filename, index=False)
        
        # Update cache metadata
        cache_manager.update_cache_metadata("news", filename, len(df))
        
        print(f"✅ Results saved to {filename}")
        print(f"📊 Processed {len(df)} articles")
        return df
    except Exception as e:
        print("❌ Failed to save CSV:", e)
        return None

if __name__ == "__main__":
    main()