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


class Page(db.Model):
    user_id = db.IntegerProperty(required=True)
    page_content = db.TextProperty(required=True)

    @classmethod
    def by_key(cls, page_key):
        page_k = db.Key.from_path('Page', page_key)
        return db.get(page_k)

    @classmethod
    def new_page(cls, user, page_url, page_content):
        # Page key set on purpose
        # in order to be url (should be unique)
        return Page(key_name=page_url,
                    user_id=user.key().id(),
                    page_content=page_content)

    @classmethod
    def get_page(cls, page_url):
        # Page key is url.
        return cls.by_key(page_url)
