# Web
import webapp2

# Templates
import os
import jinja2

# Monitoring
import logging

# Local dependencies
from datamodel import User
from tools import *

# Jinja2 setup
template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader=jinja2.FileSystemLoader(template_dir),
                               autoescape=True)


class BaseHandler(webapp2.RequestHandler):
    def initialize(self, *a, **kw):
        webapp2.RequestHandler.initialize(self, *a, **kw)

        self.user = None
        self.page = None
        self.new_url = '/'

        user_id = self.get_cookie('user_id')
        if user_id:
            self.user = User.get_user(user_id)

    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)

    @classmethod
    def render_str(cls, template, **params):
        t = jinja_env.get_template(template)
        return t.render(params)

    def render(self, template, **kw):
        # Add always user as first argument in order
        # to notify templates whether or not user logged
        # Add page for edit url to use if defined and if user logged
        # New URL allows to keep track of the next url to use for redirection.
        self.write(self.render_str(template, user=self.user, page=self.page, new_url=self.new_url, **kw))

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

    def get_previous_url(self):
        full_url = self.request.headers.get('referer')
        if full_url:
            return '/' + '/'.join(full_url.split('/')[3:])

    '''
    Used to set new url to use for redirection
    with previous url

    If previous url is not found or is the same as one url to default,
    a default url is used.
    '''
    def set_new_url_from_previous(self, urls_to_default=[], default_url='/'):
        # Compute new url to be redirected
        # as previous url
        self.new_url = self.get_previous_url()
        # if empty or set to current url, set default one
        if not self.new_url or (self.new_url in urls_to_default):
            self.new_url = default_url
        logging.info('New url computed from previous: %s' % self.new_url)

    def login(self, user):
        self.put_cookie('user_id', user.key().id())

    def logout(self):
        self.put_cookie('user_id', '')
