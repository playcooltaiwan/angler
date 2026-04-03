"""
徐春鶯案起訴書 embedding 生成腳本
輸入：public/docs/xu_chunying/indictment.pdf（需先轉成 txt）
輸出：public/xu_chunying_embeddings.json

使用步驟：
1. 將 PDF 轉文字：python3 scripts/embed_xu.py --ocr（需要 pdfminer 或 pymupdf）
   或手動轉好後存成 public/docs/xu_chunying/indictment.txt
2. 執行：python3 scripts/embed_xu.py
"""

import voyageai
import json
import re
import time
import sys
import os

VOYAGE_API_KEY = os.environ.get("VOYAGE_API_KEY", "")
INPUT_TXT = os.path.join(os.path.dirname(__file__), '..', 'public', 'docs', 'xu_chunying', 'indictment.txt')
OUTPUT_JSON = os.path.join(os.path.dirname(__file__), '..', 'public', 'xu_chunying_embeddings.json')

# ── OCR / PDF 轉文字（可選） ──────────────────────────────
if '--ocr' in sys.argv:
    try:
        import fitz  # PyMuPDF
        pdf_path = INPUT_TXT.replace('.txt', '.pdf')
        doc = fitz.open(pdf_path)
        text = '\n'.join(page.get_text() for page in doc)
        with open(INPUT_TXT, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f'✓ PDF 轉文字完成，{len(text)} 字元 → {INPUT_TXT}')
    except ImportError:
        print('需要 PyMuPDF：pip install pymupdf')
        sys.exit(1)
    except Exception as e:
        print(f'PDF 轉換失敗：{e}')
        sys.exit(1)

# ── 讀取文字 ────────────────────────────────────────────
if not os.path.exists(INPUT_TXT):
    print(f'找不到 {INPUT_TXT}')
    print('請先執行 python3 scripts/embed_xu.py --ocr 或手動轉好 txt 檔')
    sys.exit(1)

with open(INPUT_TXT, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# ── 清理函數（OCR 雜訊修正，視需要調整） ────────────────
def clean_line(line):
    line = line.strip()
    line = line.replace('超訴', '起訴')
    line = line.replace('維織', '組織')
    return line

def is_section_start(line):
    line = line.strip()
    patterns = [
        r'^[壹貳參肆伍陸柒捌玖拾][、丶，]',
        r'^[一二三四五六七八九十][、丶，]',
        r'^（[一二三四五六七八九十]）',
        r'^[①②③④⑤⑥⑦⑧⑨]',
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
    return False

# ── 按自然段落切分 ───────────────────────────────────────
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

print(f'切出 {len(chunks)} 段，平均 {sum(len(c) for c in chunks)//len(chunks)} 字')

# ── 建 embedding ─────────────────────────────────────────
if not VOYAGE_API_KEY:
    print('需要設定環境變數 VOYAGE_API_KEY')
    sys.exit(1)

vo = voyageai.Client(api_key=VOYAGE_API_KEY)
print('建 embedding 中...')
embeddings = []
batch_size = 10

for i in range(0, len(chunks), batch_size):
    batch = chunks[i:i+batch_size]
    result = vo.embed(batch, model='voyage-law-2', input_type='document')
    embeddings.extend(result.embeddings)
    print(f'進度：{min(i+batch_size, len(chunks))}/{len(chunks)}')
    time.sleep(1)

# ── 存檔 ─────────────────────────────────────────────────
data = [
    {'id': i, 'text': chunk, 'embedding': emb}
    for i, (chunk, emb) in enumerate(zip(chunks, embeddings))
]

with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False)

print(f'✓ 完成！{len(data)} 段 → {OUTPUT_JSON}')
