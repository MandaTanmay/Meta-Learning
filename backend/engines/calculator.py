import re
import logging

def calculate(query: str):
    nums = list(map(float, re.findall(r"\d+\.\d+|\d+", query)))
    answer = None
    ql = query.lower()
    logging.info(f"Calculator query: {query}")
    logging.info(f"Extracted numbers: {nums}")
    if "multiply" in ql and len(nums) >= 2:
        answer = str(nums[0] * nums[1])
        logging.info(f"Calculation type: multiply | Answer: {answer}")
    elif "add" in ql and len(nums) >= 2:
        answer = str(sum(nums))
        logging.info(f"Calculation type: add | Answer: {answer}")
    elif ("percentage" in ql or "percent" in ql) and len(nums) == 2:
        answer = f"{round((nums[0] / nums[1]) * 100, 2)}%"
        logging.info(f"Calculation type: percentage | Answer: {answer}")
    elif ("average" in ql or "cgpa" in ql or "gpa" in ql) and len(nums) >= 2:
        answer = f"{round(sum(nums) / len(nums), 2)}"
        logging.info(f"Calculation type: average/cgpa/gpa | Answer: {answer}")
    else:
        answer = "Calculation not supported."
        logging.info(f"Calculation type: unsupported | Answer: {answer}")
    return {
        "answer": answer,
        "confidence": 1.0,
        "source": "calculator"
    }
