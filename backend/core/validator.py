def validate(answer: str):
    if answer.count(answer[:10]) > 2:
        return False
    return True
