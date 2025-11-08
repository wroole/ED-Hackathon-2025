import random


def generate_fact() -> str:
    with open("data/facts.txt", "r", encoding="utf-8") as f:
        facts = [line.strip() for line in f if line.strip()]
    return random.choice(facts)
    
if __name__ == "__main__":
    print(generate_fact())