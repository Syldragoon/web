from google.appengine.ext import db
# Caching
from google.appengine.api import memcache

# Local dependencies
from tools import *


class User(db.Model):
    name = db.StringProperty(required=True)
    pwd_hash = db.StringProperty(required=True)
    email = db.StringProperty()

    @classmethod
    def by_id(cls, user_id):
        print 'DB query: User: select'
        return User.get_by_id(int(user_id))

    @classmethod
    def by_name(cls, name):
        print 'DB query: User: select'
        return User.all().filter('name =', name).get()

    @classmethod
    def signup_db(cls, name, pwd, email):
        user = User(name=name,
                    pwd_hash=make_hash_pw(name, pwd),
                    email=email)
        print 'DB query: User: insert'
        user.put()
        return user

    @classmethod
    def signup(cls, name, pwd, email):
        # Create new user
        user = cls.signup_db(name, pwd, email)

        # Update cache
        cache_key = 'user_%s' % str(user.key().id())
        print 'Cache: User: set key %s' % cache_key
        memcache.set(cache_key, user)

        # Return user
        return user

    @classmethod
    def login_db(cls, name, pwd):
        user = cls.by_name(name)
        if user and check_hash_pw(name, pwd, user.pwd_hash):
            return user

    @classmethod
    def login(cls, name, pwd):
        # Login not using cached user
        # as user ID unknown
        # TODO: find a way to cache user for login
        return cls.login_db(name, pwd)

    @classmethod
    def get_user_db(cls, user_id):
        return cls.by_id(user_id)

    @classmethod
    def get_user(cls, user_id):
        if user_id.isdigit():
            cache_key = 'user_%s' % str(user_id)
            # Cache set
            print 'Cache: User: get key %s' % cache_key
            user = memcache.get(cache_key)
            # Cache miss
            if not user:
                # DB query
                user = cls.get_user_db(user_id)

                # Update cache
                print 'Cache: User: set key %s' % cache_key
                memcache.set(cache_key, user)

            return user


class Page(db.Model):
    page_url = db.StringProperty(required=True)
    user_id = db.IntegerProperty(required=True)
    page_content = db.TextProperty()
    created = db.DateTimeProperty(auto_now_add=True)

    @classmethod
    def by_key(cls, page_key):
        page_k = db.Key.from_path('Page', page_key)
        print 'DB query: Page: select'
        return db.get(page_k)

    @classmethod
    def query_by_url(cls, page_url):
        return Page.all().filter('page_url =', page_url).order('-created')

    @classmethod
    def insert_page_db(cls, page):
        print 'DB query: Page: insertion'
        page.put()

    @classmethod
    def new_page_db(cls, user, page_url, page_content, doInsert=False):
        page = Page(page_url=page_url,
                    user_id=user.key().id(),
                    page_content=page_content)
        if doInsert:
            cls.insert_page_db(page)
        return page

    @classmethod
    def new_page(cls, user, page_url, page_content):
        # Create new page
        # without adding to the DB
        page = cls.new_page_db(user, page_url, page_content)

        # Update cache
        # WARNING: while cache for the URL is empty, it is filled from DB;
        #          this explains why DB should be update AFTER cache.
        cache_key = 'page_list_%s' % page_url
        page_list = cls.get_page_list(page_url)
        print 'Cache: Page: set key %s' % cache_key
        # If pages already existing for given URL,
        # add new page in front of list
        if page_list:
            page_list.insert(0, page)
            memcache.set(cache_key, page_list)
        # Else, create new cache with single page list
        else:
            memcache.set(cache_key, [page])

        # Add page to DB
        cls.insert_page_db(page)

        # Return page
        return page

    @classmethod
    def get_page_list_db(cls, page_url):
        print 'DB query: Page: select'
        return cls.query_by_url(page_url).fetch(None)

    @classmethod
    def get_page_list(cls, page_url):
        cache_key = 'page_list_%s' % page_url
        # Cache set
        print 'Cache: Page: get key %s' % cache_key
        page_list = memcache.get(cache_key)
        # Cache miss
        if not page_list:
            # DB query
            page_list = cls.get_page_list_db(page_url)

            # Update cache
            print 'Cache: Page: set key %s' % cache_key
            memcache.set(cache_key, page_list)

        return page_list

    '''
    The oldest page for given url is considered to be at version 1 and
    the most recent (the recent one) has version 0.
    '''
    @classmethod
    def get_page(cls, page_url, version=0):
        page_list = cls.get_page_list(page_url)
        if page_list and page_list[-version]:
            return page_list[-version]
