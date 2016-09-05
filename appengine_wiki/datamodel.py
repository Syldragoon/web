from google.appengine.ext import db

# Local dependencies
from tools import *


class User(db.Model):
    name = db.StringProperty(required=True)
    pwd_hash = db.StringProperty(required=True)
    email = db.StringProperty()

    @classmethod
    def by_id(cls, user_id):
        if user_id.isdigit():
            return User.get_by_id(int(user_id))

    @classmethod
    def by_name(cls, name):
        return User.all().filter('name =', name).get()

    @classmethod
    def signup(cls, name, pwd, email):
        return User(name=name,
                    pwd_hash=make_hash_pw(name, pwd),
                    email=email)

    @classmethod
    def login(cls, name, pwd):
        user = cls.by_name(name)
        if user and check_hash_pw(name, pwd, user.pwd_hash):
            return user
