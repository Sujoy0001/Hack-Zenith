from ..model import user


def get_user_by_id(user_id):
    return user.get_user_by_id(user_id)

def get_user_by_email(email):
    return user.get_user_by_email(email)

def User_login(email, password):
    return user.User_login(email, password) 