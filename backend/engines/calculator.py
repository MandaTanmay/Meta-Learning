import re

def calculate(query: str):
    nums = list(map(int, re.findall(r"\d+", query)))
    answer = None
    if "multiply" in query.lower() and len(nums) >= 2:
        answer = str(nums[0] * nums[1])
    elif "add" in query.lower() and len(nums) >= 2:
        answer = str(sum(nums))
    else:
        answer = "Calculation not supported."
    return {
        "answer": answer,
        "confidence": 1.0,
        "source": "calculator"
    }
