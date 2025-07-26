from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime, timedelta
import requests

# Chrome Setup
options = Options()
# options.add_argument("--headless=new")
# options.add_argument("--disable-gpu")
# options.add_argument("--no-sandbox")
driver = webdriver.Chrome(options=options)

BACKEND_API_URL = "http://localhost:5000/import/actuaryjobs"

def scrape_jobs():
    total_scraped = 0
    seen_jobs = set()  # Track duplicates in current run based on title + company

    for page in range(1, 3):
        print(f"🔀 Scraping Page {page}...")
        driver.get(f"https://www.actuarylist.com/?page={page}")

        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CLASS_NAME, "Job_job-card__YgDAV"))
            )
        except:
            print("Job cards did not load.")
            continue

        cards = driver.find_elements(By.CLASS_NAME, "Job_job-card__YgDAV")

        if not cards:
            print("No job cards found.")
            continue

        for card in cards:
            try:
                title = card.find_element(By.CLASS_NAME, "Job_job-card__position__ic1rc").text.strip()
                company = card.find_element(By.CLASS_NAME, "Job_job-card__company__7T9qY").text.strip()
                location = card.find_element(By.CLASS_NAME, "Job_job-card__locations__x1exr").text.replace("\n", ", ").strip()

                # Extract tags
                try:
                    tags_wrapper = card.find_element(By.CLASS_NAME, "Job_job-card__tags__zfriA")
                    tag_elements = tags_wrapper.find_elements(By.TAG_NAME, "a")
                    tag_texts = [tag.text.strip() for tag in tag_elements if tag.text.strip()]
                except:
                    tag_texts = []

                job_type = tag_texts[0] if tag_texts else "Unknown"
                tags = ", ".join(tag_texts[1:]) if len(tag_texts) > 1 else ""

                # Extract posting date
                try:
                    meta_text = card.find_element(By.CLASS_NAME, "Job_job-card__posted-on__NCZ3a").text.strip().lower()
                    posting_date = datetime.utcnow()
                    if "d" in meta_text:
                        num = int(meta_text.replace("d ago", "").strip())
                        posting_date -= timedelta(days=num)
                    elif "w" in meta_text:
                        num = int(meta_text.replace("w ago", "").strip())
                        posting_date -= timedelta(weeks=num)
                    elif "h" in meta_text:
                        num = int(meta_text.replace("h ago", "").strip())
                        posting_date -= timedelta(hours=num)
                except:
                    posting_date = datetime.utcnow()

                # Skip duplicates based on title+company only
                unique_key = f"{title}_{company}".lower()
                if unique_key in seen_jobs:
                    print(f"🔁 Skipping duplicate in session: {title} at {company}")
                    continue
                seen_jobs.add(unique_key)

                # Final payload
                job_data = {
                    "title": title,
                    "company": company,
                    "location": location,
                    "posting_date": posting_date.isoformat(),
                    "job_type": job_type,
                    "tags": tags
                }

                response = requests.post(BACKEND_API_URL, json=job_data)
                if response.status_code == 201:
                    print(f"✅ Posted: {title} at {company}")
                    total_scraped += 1
                elif response.status_code == 409:
                    print(f"⚠️ Duplicate in DB (title + company): {title} at {company}")
                else:
                    print(f"⚠️ Failed to post: {response.status_code} — {response.text}")

            except Exception as e:
                print(f"Skipped job due to error: {e}")

    driver.quit()
    print(f"\n Total jobs scraped and posted: {total_scraped}")

if __name__ == "__main__":
    scrape_jobs()
