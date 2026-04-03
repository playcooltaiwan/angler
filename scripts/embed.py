import voyageai
import json
import re
import time
import os

VOYAGE_API_KEY = os.environ.get("VOYAGE_API_KEY", "")

vo = voyageai.Client(api_key=VOYAGE_API_KEY)

# 讀取起訴書
with open("indictment.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

# 清理函數
def clean_line(line):
    line = line.strip()
    line = line.replace('超訴', '起訴')
    line = line.replace('維織', '組織')
    line = line.replace('棠', '黨')
    line = line.replace('煮', '黨')
    line = line.replace('窯', '黨')
    line = line.replace('鈿部', '細部')
    line = line.replace('緬部', '細部')
    line = line.replace('束區', '東區')
    line = line.replace('束興路', '東興路')
    return line

def is_section_start(line):
    line = line.strip()
    patterns = [
        r'^[壹貳參肆伍陸柒捌玖拾][、丶，]',
        r'^[一二三四五六七八九十][、丶，]',
        r'^（[一二三四五六七八九十]）',
        r'^[①②③④⑤⑥⑦⑧⑨]',
        r'^®',
        r'^[A-Z]\.',
        r'^\d+\.',
    ]
    return any(re.match(p, line) for p in patterns)

def is_noise(line):
    line = line.strip()
    if not line or len(line) < 3:
        return True
    if re.match(r'^\d+\s*$', line):
        return True
    if re.match(r'^[|l\[\]I\s\d]+$', line):
        return True
    if re.match(r'^[zZi\(\)\[\]`\'\,\.\s]+$', line):
        return True
    return False

# 按自然段落切分
chunks = []
current_chunk = []
current_size = 0
MIN_CHUNK = 150
MAX_CHUNK = 800

for line in lines:
    cleaned = clean_line(line)
    if is_noise(cleaned):
        continue
    if is_section_start(cleaned) and current_size > MIN_CHUNK:
        if current_chunk:
            chunks.append('\n'.join(current_chunk))
        current_chunk = [cleaned]
        current_size = len(cleaned)
    else:
        current_chunk.append(cleaned)
        current_size += len(cleaned)
        if current_size > MAX_CHUNK:
            chunks.append('\n'.join(current_chunk))
            current_chunk = []
            current_size = 0

if current_chunk:
    chunks.append('\n'.join(current_chunk))

print(f"切出 {len(chunks)} 段，平均 {sum(len(c) for c in chunks)//len(chunks)} 字")

# 建embedding
print("建embedding中...")
embeddings = []
batch_size = 10

for i in range(0, len(chunks), batch_size):
    batch = chunks[i:i+batch_size]
    result = vo.embed(batch, model="voyage-law-2", input_type="document")
    embeddings.extend(result.embeddings)
    print(f"進度：{min(i+batch_size, len(chunks))}/{len(chunks)}")
    time.sleep(1)

# 存成JSON
data = []
for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
    data.append({
        "id": i,
        "text": chunk,
        "embedding": embedding
    })

with open("embeddings.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False)

print(f"完成！共{len(data)}段")