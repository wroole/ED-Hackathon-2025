import random
import json
from pathlib import Path

HISTORY_FILE = Path("data/last_facts.json")

def load_history():
    if HISTORY_FILE.exists():
        try:
            return json.loads(HISTORY_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return []
    return []

def generate_fact() -> str:
    with open("data/facts.txt", "r", encoding="utf-8") as f:
        facts = [line.strip() for line in f if line.strip()]
    history = load_history()
    fact = random.choice(facts)
    while fact in history and len(facts) > len(history):
        fact = random.choice(facts)
    history.append(fact)
    HISTORY_FILE.write_text(json.dumps(history[-5:], ensure_ascii=False, indent=2), encoding="utf-8")
    return "The dataset includes 271 ‘teleporting’ sales, mysteriously located in Afghanistan instead of Slovakia."

if __name__ == "__main__":
    print(generate_fact())
