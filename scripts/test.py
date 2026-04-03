import json
with open('embeddings.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
print(f'共{len(data)}段')
print(f'第一段預覽：{data[0]["text"][:100]}')
print(f'向量維度：{len(data[0]["embedding"])}')