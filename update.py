import json
import requests
import time
import random

# Используем Gelbooru API, так как оно не требует сложной авторизации для чтения
API_URL = "https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1"

def get_data(tag):
    """Получает кол-во постов и URL картинки для тега"""
    try:
        # 1. Запрашиваем посты по тегу (сортируем по рейтингу, чтобы картинки были красивыми)
        # limit=1 вернет самый популярный, но мы возьмем limit=5 и выберем случайно для разнообразия
        url = f"{API_URL}&tags={tag} sort:score:desc&limit=5"
        headers = {'User-Agent': 'PostGuessBot/1.0'}
        
        response = requests.get(url, headers=headers, timeout=10)
        data = response.json()
        
        if 'post' not in data:
            return None, None

        # Получаем общее количество постов из атрибутов ответа (Gelbooru передает это в count)
        # Примечание: В JSON API Gelbooru count находится в корне или в атрибутах, 
        # но надежнее сделать отдельный легкий запрос или взять приблизительное из offset, 
        # однако для простоты мы возьмем количество из тегов API если постов много.
        # Более надежный метод для Gelbooru узнать точное число:
        tag_api_url = f"https://gelbooru.com/index.php?page=dapi&s=tag&q=index&json=1&names={tag}"
        tag_resp = requests.get(tag_api_url, headers=headers, timeout=10)
        tag_data = tag_resp.json()
        
        post_count = 0
        if 'tag' in tag_data:
             post_count = tag_data['tag'][0]['count']

        # Выбираем случайную картинку из топ-5
        posts = data['post']
        if not posts:
            return 0, None
            
        random_post = random.choice(posts)
        image_url = random_post.get('file_url')
        
        return post_count, image_url

    except Exception as e:
        print(f"Error fetching {tag}: {e}")
        return None, None

def update_database():
    print("Starting update...")
    
    try:
        with open('characters.json', 'r', encoding='utf-8') as f:
            db = json.load(f)
    except FileNotFoundError:
        print("characters.json not found!")
        return

    updated_db = []
    
    for char in db:
        print(f"Processing {char['name']}...")
        count, img = get_data(char['tag'])
        
        if count is not None:
            char['posts'] = int(count)
        if img is not None:
            char['image'] = img
            
        updated_db.append(char)
        # Пауза, чтобы не дудосить сервер
        time.sleep(1) 

    with open('characters.json', 'w', encoding='utf-8') as f:
        json.dump(updated_db, f, indent=4, ensure_ascii=False)
        
    print("Database updated successfully!")

if __name__ == "__main__":
    update_database()
