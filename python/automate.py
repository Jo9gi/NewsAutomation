import pandas as pd
import numpy as np
import datetime
# from GoogleNews import GoogleNews
from newsdata_fetcher import fetch_positive_news
from utils.helper import newsfeed
from utils.arg_parse import parse_arguments
from models.sentiment_analysis_model import create_sentiment_analysis_model
from models.text_summarization_model import create_text_summarization_model
from web_scraper import WebScraper

scraper = WebScraper()
sentiment_model = create_sentiment_analysis_model()
summarization_model = create_text_summarization_model()


def summarize_article(url):
    scraper = WebScraper()
    # summarizer = TextSummarizationModel()
    article_text = scraper.scrape(url)
    return summarization_model.summarize(article_text)


def analyse_sentiment(title):
    return sentiment_model.apply_model(title)

def main():
    print("🔍 Fetching positive IT innovation news from NewsData.io...")
    news_list = fetch_positive_news()

    if not news_list:
        print("😕 No positive news found.")
        return

    df = pd.DataFrame(news_list)

    # Add timestamp columns
    now = datetime.datetime.now()
    df["Processed Date"] = now.strftime("%Y-%m-%d")
    df["Processed Time"] = now.strftime("%H:%M:%S")

    try:
        df['Sentiment'] = df['title'].apply(analyse_sentiment)
        df['Summary'] = df['link'].apply(summarize_article)
    except Exception as e:
        print("⚠️ Error during NLP processing:", e)

    # Auto-name CSV file with correct path
    filename = f"d:\\downloads\\codeKrafters\\trae\\data\\headline_{now.strftime('%Y-%m-%d')}.csv"

    try:
        df.to_csv(filename, index=False)
        print(f"✅ Results saved to {filename}")
    except Exception as e:
        print("❌ Failed to save CSV:", e)

if __name__ == "__main__":
    main()