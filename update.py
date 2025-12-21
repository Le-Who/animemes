import json
import requests
import time
import random
import os

# Основной URL API
API_URL = "https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1"

# Список User-Agent, чтобы притворяться разными браузерами
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0'
]

def get_data(tag):
    try:
        # Выбираем случайный User-Agent
        headers = {
            'User-Agent': random.choice(USER_AGENTS),
            'Accept': 'application/json',
            'Referer': 'https://gelbooru.com/'
        }
        
        # 1. Запрос списка постов (сортировка по score для качества)
        url = f"{API_URL}&tags={tag} sort:score:desc&limit=20"
        print(f"Fetching: {tag}...")
        
        response = requests.get(url, headers=headers, timeout=15)
        
        if response.status_code == 403:
            print(f"⚠️ 403 Forbidden for {tag}. IP blocked?")
            return None, None
            
        if response.status_code != 200:
            print(f"⚠️ Error {response.status_code} for {tag}")
            return None, None

        # Обработка ответа
        # Gelbooru иногда возвращает пустую строку или некорректный JSON при ошибках
        try:
            data = response.json()
        except json.JSONDecodeError:
            print(f"⚠️ Invalid JSON for {tag}")
            return None, None
            
        if 'post' not in data:
            print(f"⚠️ No posts found for {tag}")
            return None, None

        posts = data['post']
        
        # Берем случайную картинку из топ-20, чтобы было разнообразие
        # Фильтруем те, у которых нет file_url (бывает редко)
        valid_posts = [p for p in posts if 'file_url' in p]
        
        if not valid_posts:
            return 0, None
            
        random_post = random.choice(valid_posts)
        image_url = random_post['file_url']
        
        # Пытаемся получить count из атрибутов, если есть, иначе считаем сами
        # В этом API count часто лежит в корне: data['@attributes']['count']
        # Но для простоты вернем число, которое мы знаем (или заглушку, если API изменился)
        # Лучший способ для Gelbooru узнать точное число - отдельный запрос тегов, 
        # но чтобы не спамить запросами, возьмем 'count' из атрибутов, если есть.
        
        total_count = 0
        if '@attributes' in data and 'count' in data['@attributes']:
             total_count = int(data['@attributes']['count'])
        else:
             # Если count не пришел, это странно, но вернем хотя бы >0
             # Можно сделать второй запрос к tags API, но велик риск бана.
             # Оставим старое значение, если оно было > 0, или поставим заглушку 1000+
             total_count = 1000 
             
             # ПОПЫТКА 2: Запросить API тегов (осторожно)
             try:
                tag_url = f"https://gelbooru.com/index.php?page=dapi&s=tag&q=index&json=1&names={tag}"
                tag_resp = requests.get(tag_url, headers=headers, timeout=10)
                tag_data = tag_resp.json()
                if 'tag' in tag_data:
                    total_count = tag_data['tag'][0]['count']
             except:
                pass

        return total_count, image_url

    except Exception as e:
        print(f"❌ Error fetching {tag}: {e}")
        return None, None

def update_database():
    print("🚀 Starting database update...")
    
    # Путь к файлу (абсолютный путь для надежности в GitHub Actions)
    file_path = os.path.join(os.getcwd(), 'characters.json')
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            db = json.load(f)
    except FileNotFoundError:
        print("❌ characters.json not found!")
        exit(1)

    updated_db = []
    success_count = 0
    
    for char in db:
        # Небольшая пауза перед каждым запросом (Anti-Spam)
        time.sleep(random.uniform(1.0, 3.0))
        
        count, img = get_data(char['tag'])
        
        if count is not None and img is not None:
            char['posts'] = int(count)
            char['image'] = img
            success_count += 1
            print(f"✅ Updated {char['name']}: {count} posts")
        else:
            print(f"⚠️ Skipped {char['name']} (keep old data)")
            
        updated_db.append(char)

    # Сохраняем ТОЛЬКО если хоть что-то обновилось или если файл был пустым
    if success_count > 0 or len(db) > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(updated_db, f, indent=4, ensure_ascii=False)
        print(f"💾 Database saved! Updated {success_count}/{len(db)} characters.")
    else:
        print("🤔 No data updated. Something is wrong.")

if __name__ == "__main__":
    update_database()
