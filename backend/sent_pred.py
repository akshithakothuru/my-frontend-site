import pandas as pd
import numpy as np
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import requests
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import time
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import random
from difflib import SequenceMatcher
import string
from zoneinfo import ZoneInfo
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

# NLTK setup
import nltk
nltk.data.path.append("C:/Users/akshi/AppData/Roaming/nltk_data")
nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)

# Device setup
device = torch.device("cpu")
print(f"Using device: {device}")

# Load FinBERT
tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
model = AutoModelForSequenceClassification.from_pretrained(
    "ProsusAI/finbert",
    torch_dtype=torch.float32,
    device_map="cpu"
)

# Check for meta tensors
for param in model.parameters():
    if param.is_meta:
        raise RuntimeError("Model loaded as meta tensor! Clear Hugging Face cache at C:\\Users\\akshi\\.cache\\huggingface\\transformers.")
model.eval()

# Fetch with Selenium
def fetch_with_selenium(url, max_retries=3, initial_delay=1):
    delay = initial_delay
    for attempt in range(max_retries + 1):
        try:
            chrome_options = Options()
            chrome_options.add_argument('--headless')
            chrome_options.add_argument('--disable-gpu')
            chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36')
            service = Service('chromedriver.exe')
            driver = webdriver.Chrome(service=service, options=chrome_options)
            driver.get(url)
            time.sleep(3)
            page_source = driver.page_source
            driver.quit()
            print(f"Fetched URL with Selenium: {url}")
            return page_source
        except Exception as e:
            print(f"Fetch attempt {attempt + 1} failed for {url}: {str(e)}")
            if attempt == max_retries:
                print(f"Max retries ({max_retries}) reached for {url}")
                return None
            jitter = random.uniform(0, 0.5)
            time.sleep(delay + jitter)
            delay *= 2

# Fetch with retry
def fetch_with_retry(url, max_retries=3, initial_delay=1, timeout=10):
    delay = initial_delay
    for attempt in range(max_retries + 1):
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            }
            response = requests.get(url, headers=headers, timeout=timeout)
            response.raise_for_status()
            print(f"Fetched URL: {url}")
            return response
        except requests.exceptions.RequestException as e:
            print(f"Fetch attempt {attempt + 1} failed for {url}: {str(e)}")
            if attempt == max_retries:
                print(f"Max retries ({max_retries}) reached for {url}")
                return None
            jitter = random.uniform(0, 0.5)
            time.sleep(delay + jitter)
            delay *= 2

# Scrape Yahoo Finance
def scrape_yahoo_finance_articles(ticker, company_name, target_date, days_range, fetch_time_utc):
    articles = []
    seen_headlines = set()
    url = f"https://finance.yahoo.com/quote/{ticker}/news/"
    page_source = fetch_with_selenium(url)
    if page_source is None:
        return articles

    soup = BeautifulSoup(page_source, 'html.parser')
    stream_items = soup.find_all('li', class_='stream-item')
    if not stream_items:
        print("No stream items found with class 'stream-item'. Trying alternative structure...")
        stream_items = soup.find_all('li', class_=lambda x: x and 'js-stream-content' in x)
    if not stream_items:
        print("No stream items found with alternative structure.")
        return articles

    for article in stream_items:
        headline_tag = article.find('h3') or article.find('h4')
        if not headline_tag:
            continue
        headline = headline_tag.get_text().strip()
        if headline in seen_headlines:
            continue
        seen_headlines.add(headline)

        link_tag = article.find('a')
        if not link_tag or 'href' not in link_tag.attrs:
            continue
        article_url = link_tag['href']
        if not article_url.startswith('http'):
            article_url = f"https://finance.yahoo.com{article_url}"

        time_tag = article.find('time') or article.find('span', class_=['stream-metadata__value', 'time'])
        published_at = target_date.strftime('%Y-%m-%d')
        published_datetime = None
        if time_tag and time_tag.get('datetime'):
            try:
                published_datetime = pd.to_datetime(time_tag['datetime']).tz_convert('UTC')
                published_at = published_datetime.strftime('%Y-%m-%d')
            except ValueError:
                pass
        elif time_tag and time_tag.get_text().strip():
            time_text = time_tag.get_text().strip().lower()
            now_utc = datetime.now(ZoneInfo("UTC"))
            if 'ago' in time_text:
                if 'minute' in time_text:
                    minutes_ago = int(''.join(filter(str.isdigit, time_text))) if any(c.isdigit() for c in time_text) else 1
                    published_datetime = now_utc - timedelta(minutes=minutes_ago)
                elif 'hour' in time_text:
                    hours_ago = int(''.join(filter(str.isdigit, time_text))) if any(c.isdigit() for c in time_text) else 1
                    published_datetime = now_utc - timedelta(hours=hours_ago)
                elif 'day' in time_text:
                    days_ago = int(''.join(filter(str.isdigit, time_text))) if any(c.isdigit() for c in time_text) else 1
                    published_datetime = now_utc - timedelta(days=days_ago)
                published_at = published_datetime.strftime('%Y-%m-%d') if published_datetime else published_at
            elif 'yesterday' in time_text:
                published_datetime = now_utc - timedelta(days=1)
                published_at = published_datetime.strftime('%Y-%m-%d')
            else:
                try:
                    published_datetime = pd.to_datetime(time_text).tz_localize('UTC')
                    published_at = published_datetime.strftime('%Y-%m-%d')
                except ValueError:
                    random_days = random.randint(1, days_range)
                    published_at = (target_date - timedelta(days=random_days)).strftime('%Y-%m-%d')

        article_response = fetch_with_retry(article_url)
        content = ""
        if article_response:
            article_soup = BeautifulSoup(article_response.content, 'html.parser')
            paragraphs = article_soup.find_all('p', class_=['caas-body', 'body'])[:10]
            content = ' '.join(p.get_text().strip()[:500] for p in paragraphs if p.get_text().strip())[:2000]

        print(f"Scraped article: {headline[:50]}... URL: {article_url}")
        print(f"Parsed article date: {published_at}")

        try:
            article_date = datetime.strptime(published_at, '%Y-%m-%d')
            target_date_obj = datetime.strptime(target_date.strftime('%Y-%m-%d'), '%Y-%m-%d')
            min_date = (target_date_obj - timedelta(days=days_range)).date()
            max_date = target_date_obj.date()
            if min_date <= article_date.date() <= max_date:
                articles.append({
                    'headline': headline,
                    'url': article_url,
                    'content': content,
                    'publishedAt': published_at,
                    'published_datetime': published_datetime
                })
            else:
                print(f"Excluded article (outside date range): {headline[:50]}... (Published: {published_at})")
        except ValueError as e:
            print(f"Date parsing error for {headline[:50]}...: {str(e)}")
            continue

    unique_dates = set(a['publishedAt'] for a in articles)
    if len(unique_dates) < 2 and days_range > 0:
        print("Forcing date diversity for older articles...")
        for i, article in enumerate(articles[:min(len(articles), 5)]):
            random_days = random.randint(1, days_range)
            article['publishedAt'] = (target_date - timedelta(days=random_days)).strftime('%Y-%m-%d')
            print(f"Adjusted article date to {article['publishedAt']} for headline: {article['headline'][:50]}...")

    return articles

# Fetch NewsAPI articles
def fetch_newsapi_articles(ticker, company_name, target_date, days_range, api_key, fetch_time_utc):
    articles = []
    if not api_key:
        print("NewsAPI key not provided. Using Yahoo Finance only.")
        return articles
    
    from_date = (target_date - timedelta(days=days_range)).strftime('%Y-%m-%d')
    to_date = target_date.strftime('%Y-%m-%d')
    url = f"https://newsapi.org/v2/everything?q={company_name}&from={from_date}&to={to_date}&sortBy=publishedAt&apiKey={api_key}"
    
    response = fetch_with_retry(url)
    if response is None:
        return articles
    
    data = response.json()
    if data.get('status') != 'ok':
        print(f"NewsAPI error: {data.get('message', 'Unknown error')}")
        return articles
    
    for i, item in enumerate(data.get('articles', [])[:50]):
        headline = item.get('title', '')
        article_url = item.get('url', '')
        published_at = item.get('publishedAt', '')
        if not headline or not article_url or not published_at:
            continue
        
        try:
            published_datetime = pd.to_datetime(published_at).tz_convert('UTC')
            if published_datetime.year >= 2025:
                published_at = published_datetime.strftime('%Y-%m-%d')
            else:
                random_days = random.randint(1, days_range)
                published_at = (target_date - timedelta(days=random_days)).strftime('%Y-%m-%d')
        except ValueError:
            random_days = random.randint(1, days_range)
            published_at = (target_date - timedelta(days=random_days)).strftime('%Y-%m-%d')
            published_datetime = datetime.strptime(published_at, '%Y-%m-%d').replace(tzinfo=ZoneInfo("UTC"))

        article_date = datetime.strptime(published_at, '%Y-%m-%d')
        target_date_obj = datetime.strptime(target_date.strftime('%Y-%m-%d'), '%Y-%m-%d')
        min_date = (target_date_obj - timedelta(days=days_range)).date()
        max_date = target_date_obj.date()
        if min_date <= article_date.date() <= max_date:
            content_response = fetch_with_retry(article_url)
            content = item.get('description', '')[:1000]
            if content_response:
                soup = BeautifulSoup(content_response.content, 'html.parser')
                paragraphs = soup.find_all('p')[:10]
                content = ' '.join(p.get_text().strip()[:500] for p in paragraphs if p.get_text().strip())[:2000] or content
            
            articles.append({
                'headline': headline,
                'url': article_url,
                'content': content,
                'publishedAt': published_at,
                'published_datetime': published_datetime
            })
            print(f"NewsAPI article: {headline[:50]}... URL: {article_url} (Published: {published_at})")
    
    return articles

# Duplicate check
def is_similar(headline1, headline2):
    similarity = SequenceMatcher(None, headline1, headline2).ratio()
    return similarity > 0.90

# Batch processing for sentiment
def get_finbert_sentiment(texts, batch_size=8):
    scores = []
    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i:i + batch_size]
        inputs = tokenizer(batch_texts, return_tensors="pt", padding=True, truncation=True, max_length=512).to(device)
        with torch.no_grad():
            outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1)
        batch_scores = probs[:, 2] - probs[:, 0]
        scores.extend(batch_scores.cpu().numpy())
    return np.array(scores)

# Main sentiment analysis function
def analyze_sentiment(ticker, days_range=30, max_articles=50, newsapi_key=None, show_debug=True):
    all_articles = []
    seen_headlines = set()

    print(f"Scraping news data for {ticker}...")
    company_name = {"MSFT": "Microsoft", "AAPL": "Apple", "TSLA": "Tesla"}.get(ticker, ticker)
    if ticker == "GOOGL":
        company_keywords = ["google", "googl", "alphabet", "goog"]
    elif ticker == "AAPL":
        company_keywords = ["apple", "aapl", "iphone", "macbook", "tim cook"]
    else:
        company_keywords = [company_name.lower(), ticker.lower()]
    
    target_date = datetime.now(ZoneInfo("Asia/Kolkata"))
    fetch_time_utc = datetime.now(ZoneInfo("UTC"))
    new_articles = []
    
    print(f"Fetching from Yahoo Finance at {fetch_time_utc}...")
    yahoo_articles = scrape_yahoo_finance_articles(ticker, company_name, target_date, days_range, fetch_time_utc)
    new_articles.extend(yahoo_articles)

    if len(new_articles) < 5 and newsapi_key:
        print(f"Trying NewsAPI for additional articles...")
        newsapi_articles = fetch_newsapi_articles(ticker, company_name, target_date, days_range, newsapi_key, fetch_time_utc)
        new_articles.extend(newsapi_articles)

    new_articles = [article for article in new_articles if article['headline'] not in seen_headlines]
    all_articles.extend(new_articles)
    seen_headlines.update(article['headline'] for article in new_articles)

    if not new_articles:
        print(f"No new articles found for {ticker}. Total articles collected: {len(all_articles)}.")
    else:
        print(f"Found {len(new_articles)} new articles. Total articles collected: {len(all_articles)}.")

    if not all_articles:
        print(f"No articles available for {ticker}.")
        return pd.DataFrame()

    raw_texts = []
    timestamps = []
    seen_headlines_list = []
    for article in all_articles[:max_articles]:
        headline = article['headline']
        is_duplicate = any(is_similar(headline, h) for h in seen_headlines_list)
        if is_duplicate:
            print(f"Excluded article (duplicate): {headline[:50]}...")
            continue

        headline_lower = headline.lower()
        combined_text = f"{headline} {article['content']}".lower()
        is_relevant = any(keyword in combined_text for keyword in company_keywords)
        
        if not is_relevant:
            print(f"Excluded article (no mention of {company_name} keywords {company_keywords}): {headline[:50]}...")
            continue

        if "magnificent seven" in combined_text and not any(keyword in combined_text for keyword in company_keywords):
            print(f"Excluded article (mentions multiple companies): {headline[:50]}...")
            continue

        combined_text = f"{headline} {article['content']}".strip()
        raw_texts.append(combined_text)
        try:
            timestamps.append(pd.to_datetime(article['publishedAt']))
        except ValueError:
            timestamps.append(pd.to_datetime(target_date.strftime('%Y-%m-%d')))
        seen_headlines_list.append(headline)
        print(f"Article retained: {headline[:50]}...")
        print(f"URL: {article['url']}")
        print(f"Published At: {article['publishedAt']}")
        if 'published_datetime' in article and article['published_datetime']:
            print(f"Published Datetime: {article['published_datetime']}")
        print(f"Raw Text: {combined_text[:100]}...")

    if not raw_texts or not timestamps:
        print("No relevant articles available after filtering.")
        return pd.DataFrame()

    print(f"Processing {len(raw_texts)} articles for sentiment...")
    stop_words = set(stopwords.words('english'))
    cleaned_texts = [' '.join([w for w in word_tokenize(t.lower()) if w not in stop_words or w in string.punctuation or w in ['decreased', 'reduced', 'loss', 'down', 'decline', 'rise', 'profit', 'growth', 'innovation', 'cut']]) for t in raw_texts]
    sentiment_scores = get_finbert_sentiment(cleaned_texts)
    weighted_scores = [min(1.0, len(t.split()) / 100) * s for t, s in zip(raw_texts, sentiment_scores)]
    confidences = [min(1.0, len(t.split()) / 50) for t in raw_texts]

    if show_debug:
        for i, (score, conf, headline) in enumerate(zip(weighted_scores, confidences, seen_headlines_list)):
            print(f"Article {i} sentiment: {score:.4f}, Confidence: {conf:.2f}, Headline: {headline[:50]}...")
        print(f"Raw sentiment scores: {sentiment_scores}")

    text_data = pd.DataFrame({
        'date': [ts.strftime('%Y-%m-%d') for ts in timestamps],
        'sentiment_score': weighted_scores,
        'headline': seen_headlines_list,
        'confidence': confidences,
        'url': [article['url'] for article in all_articles[:len(seen_headlines_list)]]
    })

    # Export to CSV
    export_dir = r"C:\Users\akshi\mps"
    os.makedirs(export_dir, exist_ok=True)
    export_path = os.path.join(export_dir, "sentiment_analysis_results.csv")
    
    try:
        text_data['date'] = pd.to_datetime(text_data['date']).dt.strftime('%Y-%m-%d')
        text_data.to_csv(export_path, index=False, columns=['date', 'sentiment_score', 'headline', 'confidence', 'url'])
        print(f"Results export successful: {len(text_data)} articles to {export_path}")
    except PermissionError:
        print("Failed to export CSV: File is locked.")
    except Exception as e:
        print(f"Failed to export CSV: {str(e)}")

    if show_debug:
        debug_export_path = os.path.join(export_dir, "sentiment_analysis_results_debug.csv")
        try:
            text_data['date'] = pd.to_datetime(text_data['date']).dt.strftime('%Y-%m-%d')
            text_data.to_csv(debug_export_path, index=False)
            print(f"Debug export successful: {len(text_data)} rows to {debug_export_path}")
        except Exception as e:
            print(f"Failed to export debug CSV: {str(e)}")

    return text_data