# Web
import webapp2

# Templates
import os
import jinja2

# Local dependencies
from datamodel import User
from tools import *

# Jinja2 setup
template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
                               autoescape=True)


class BaseHandler(webapp2.RequestHandler):
    def initialize(self, *a, **kw):
        webapp2.RequestHandler.initialize(self, *a, **kw)
        user_id = self.get_cookie('user_id')
        self.user = None
        if user_id:
            self.user = User.by_id(user_id)

    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)

    @classmethod
    def render_str(cls, template, **params):
        t = jinja_env.get_template(template)
        return t.render(params)

    def render(self, template, **kw):
        # Add always user as first argument in order
        # to notify templates whether or not user logged
        self.write(self.render_str(template, user=self.user, **kw))

    def render_error(self, error_code, error_text):
        self.render('error.html', error_code=error_code, error_text=error_text)
        self.response.set_status(error_code)

    def put_cookie(self, name, value, path='/'):
        # Set cookie value with hash if value NOT empty
        cookie_value = '%s=%s; Path=%s' % (name, make_hash(str(value)) if value else '', path)
        self.response.headers.add_header('Set-Cookie', str(cookie_value))

    def get_cookie(self, name):
        # check hash value if NOT empty
        hash_value = self.request.cookies.get(name)
        if hash_value:
            return check_hash(hash_value)

    def login(self, user):
        self.put_cookie('user_id', user.key().id())

    def logout(self):
        self.put_cookie('user_id', '')
