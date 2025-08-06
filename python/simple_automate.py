import pandas as pd
import datetime
import os
from newsdata_fetcher import fetch_positive_news

def main():
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

    # Add placeholder columns for ML processing (to be added later)
    df['Sentiment'] = 'NEUTRAL'  # Placeholder
    df['Summary'] = df['description'].str[:200] + '...'  # Simple truncation

    # Auto-name CSV file with correct path
    filename = f"data/headline_{now.strftime('%Y-%m-%d')}.csv"

    try:
        # Ensure data directory exists
        os.makedirs("data", exist_ok=True)
        df.to_csv(filename, index=False)
        
        print(f"✅ Results saved to {filename}")
        print(f"📊 Processed {len(df)} articles")
        return df
    except Exception as e:
        print("❌ Failed to save CSV:", e)
        return None

if __name__ == "__main__":
    main() 