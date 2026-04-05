"""
把 embeddings.json 和 xu_chunying_embeddings.json 搬到 Supabase pgvector。
執行前確認 Supabase SQL Editor 已跑過建表 SQL。

用法：
  python scripts/migrate_to_supabase.py
"""

import json
import os
import sys
import requests

SUPABASE_URL = "https://psmconhawlgdofaecnig.supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

BATCH_SIZE = 50

FILES = [
    ("public/embeddings.json",           "jinghuacheng_indictment"),
    ("public/xu_chunying_embeddings.json", "xu_chunying_indictment"),
]


def insert_batch(rows: list[dict]) -> None:
    res = requests.post(
        f"{SUPABASE_URL}/rest/v1/documents",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
        json=rows,
        timeout=60,
    )
    if res.status_code not in (200, 201):
        print(f"  ERROR {res.status_code}: {res.text[:200]}")
        sys.exit(1)


def migrate(path: str, case_id: str) -> None:
    with open(path, encoding="utf-8") as f:
        data = json.load(f)

    print(f"{case_id}: {len(data)} chunks")

    for i in range(0, len(data), BATCH_SIZE):
        batch = data[i : i + BATCH_SIZE]
        rows = [
            {
                "case_id": case_id,
                "text": item["text"],
                # pgvector REST API accepts vector as string "[x,y,...]"
                "embedding": str(item["embedding"]).replace(" ", ""),
            }
            for item in batch
        ]
        insert_batch(rows)
        print(f"  inserted {i + len(batch)}/{len(data)}")

    print(f"  done\n")


if __name__ == "__main__":
    if not SUPABASE_KEY:
        print("ERROR: set SUPABASE_SERVICE_KEY env var first")
        print('  export SUPABASE_SERVICE_KEY="sb_secret_..."')
        sys.exit(1)

    for path, case_id in FILES:
        migrate(path, case_id)

    print("Migration complete!")
