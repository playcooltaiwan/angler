import json
import os
import numpy as np
import anthropic

VOYAGE_API_KEY = os.environ.get("VOYAGE_API_KEY", "")
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

# 載入embedding
with open('embeddings.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

texts = [d['text'] for d in data]
embeddings = np.array([d['embedding'] for d in data])

# 向量搜尋
import voyageai
vo = voyageai.Client(api_key=VOYAGE_API_KEY)

def search(question, top_k=5):
    result = vo.embed([question], model="voyage-law-2", input_type="query")
    query_vec = np.array(result.embeddings[0])
    
    # 計算相似度
    scores = np.dot(embeddings, query_vec)
    top_indices = np.argsort(scores)[-top_k:][::-1]
    
    return [texts[i] for i in top_indices]

# 問答
client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

def ask(question):
    relevant_chunks = search(question)
    context = '\n\n---\n\n'.join(relevant_chunks)
    
    message = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": f"""你是一個幫助理解台灣司法文件的助手。
根據以下起訴書段落，用白話文回答問題。
回答要簡潔清楚，像在跟朋友解釋一樣。
如果段落裡找不到答案，就說找不到。

起訴書相關段落：
{context}

問題：{question}"""
            }
        ]
    )
    
    return message.content[0].text

# 互動問答
print("起訴書問答系統啟動（輸入q離開）")
print("="*40)

while True:
    question = input("\n你想問什麼？> ")
    if question.lower() == 'q':
        break
    print("\n", ask(question))