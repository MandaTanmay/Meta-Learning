import re

def calculate(query: str):
    nums = list(map(int, re.findall(r"\d+", query)))
    if "multiply" in query.lower():
        return str(nums[0] * nums[1])
    if "add" in query.lower():
        return str(sum(nums))
    return "Calculation not supported."
