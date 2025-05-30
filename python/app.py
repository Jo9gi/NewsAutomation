from flask import Flask, render_template, request
import os
import pandas as pd
import datetime
from automate import summarize_article, analyse_sentiment

app = Flask(__name__)

def get_today_csv():
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    filename = f"headline_{today}.csv"
    if os.path.exists(filename):
        return pd.read_csv(filename)
    return pd.DataFrame(columns=['title', 'description', 'link', 'Sentiment', 'Summary'])

@app.route('/', methods=['GET', 'POST'])
def home():
    summary = ''
    sentiment = ''
    url_result = False

    if request.method == 'POST':
        url = request.form.get('url')
        if url:
            summary = summarize_article(url)
            sentiment = analyse_sentiment(summary)
            url_result = True

    news_df = get_today_csv()

    return render_template(
        'home.html',
        news=news_df.to_dict(orient='records'),
        summary=summary,
        sentiment=sentiment,
        url_result=url_result
    )
#this is the api route for the news for the frontend 
@app.route('/api/news', methods=['GET'])
def api_news():
    news_df = get_today_csv()
    news_json = news_df.to_dict(orient='records')
    return {"news": news_json}

if __name__ == '__main__':
    app.run(debug=True)
