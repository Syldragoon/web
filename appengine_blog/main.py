import os
import webapp2
import jinja2
from google.appengine.ext import db
import re
import hmac


template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
                               autoescape=True)


# Regular expressions for validity checks
USER_RE = re.compile(r"^[a-zA-Z0-9_-]{3,20}$")
PWD_RE = re.compile(r"^.{3,20}$")
EMAIL_RE = re.compile(r"^[\S]+@[\S]+.[\S]+$")


def valid_username(username):
    return USER_RE.match(username)


def valid_pwd(pwd):
    return PWD_RE.match(pwd)


def valid_email(email):
    return not email or EMAIL_RE.match(email)


# Hashing methods
# for username
hash_key = 'fkahfdjkdflk'


def make_hash(value):
    return '%s|%s' % (value, hmac.new(hash_key, value).hexdigest())


def check_hash(hash_value):
    value = hash_value.split('|')[0]
    if make_hash(value) == hash_value:
        return value


# DB definition
class BlogEntry(db.Model):
    subject = db.StringProperty(required=True)
    content = db.TextProperty(required=True)


class BaseHandler(webapp2.RequestHandler):
    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)

    def render_str(self, template, **params):
        t = jinja_env.get_template(template)
        return t.render(params)

    def render(self, template, **kw):
        self.write(self.render_str(template, **kw))

    def put_cookie(self, name, value, path='/'):
        # Set cookie value with hash if value NOT empty
        cookie_value = '%s=%s; Path=%s' % (name, make_hash(value) if value else '', path)
        self.response.headers.add_header('Set-Cookie', str(cookie_value))

    def get_cookie(self, name):
        hash_value = self.request.cookies.get(name)
        if hash_value:
            return check_hash(hash_value)


class BlogFrontPage(BaseHandler):
    def get(self):
        # Run query to retrieve posts
        posts = db.GqlQuery("select * from BlogEntry")
        self.render('front_page.html', posts=posts)


class BlogNewPost(BaseHandler):
    def render_new_post(self, subject='', content='', error=''):
        self.render('new_post.html',
                    subject=subject,
                    content=content,
                    error=error)

    def get(self):
        self.render_new_post()

    def post(self):
        # Retrieve entries
        subject = self.request.get('subject')
        content = self.request.get('content')

        # Check entries
        if subject and content:
            # Success case

            # Populate DB
            e = BlogEntry(subject=subject, content=content)
            e.put()
            e_id = e.key().id()
            print "Adding new entry id %d" % e_id

            # Render post display
            self.redirect('/blog/%d' % e_id)

        else:
            # Error case
            # Render new post URL with error
            self.render_new_post(subject,
                                 content,
                                 'Please enter subject and content')


class BlogDisplayPost(BaseHandler):
    def get(self, post_id):
        # Run query to retrieve specific post
        post = BlogEntry.get_by_id(int(post_id))

        # Render post display
        self.render('display_post.html', post=post)


class BlogRegister(BaseHandler):

    def render_register(self,
                         username='',
                         email='',
                         error_username='',
                         error_pwd='',
                         error_email=''):
        self.render('register.html',
                    username=username,
                    email=email,
                    error_username=error_username,
                    error_pwd=error_pwd,
                    error_email=error_email)

    def get(self):
        self.render_register()

    def post(self):
        # Retrieve entries
        username = self.request.get('username')
        pwd = self.request.get('password')
        pwd_retry = self.request.get('verify')
        email = self.request.get('email')

        # Validity checks
        username_ok = valid_username(username)
        pwd_ok = valid_pwd(pwd) and (pwd == pwd_retry)
        email_ok = valid_email(email)

        # Check if user already exists through cookie
        # if it was ok
        username_error = "That's not a valid username."
        if username_ok:
            username_old = self.get_cookie('username')
            if username_old and (username == username_old):
                username_ok = False
                username_error = "Username already exists."

        if username_ok and pwd_ok and email_ok:

            # Add cookie with username
            self.put_cookie('username', username)

            # Show welcome page
            self.redirect('/blog/signup/welcome')
        else:
            # Show signup page with some input data and errors
            self.render_register(username,
                                 email,
                                 username_error if not username_ok else '',
                                 "Your passwords didn't match." if not pwd_ok else '',
                                 "That's not a valid email address." if not email_ok else '')


class BlogRegisterSuccess(BaseHandler):
    def get(self):
        # Read cookie
        username = self.get_cookie('username')

        # Show welcome page if cookie valid else
        # redirect to signup page
        if username:
            self.render('register_success.html', username=username)
        else:
            self.redirect('/blog/signup')


class BlogLogin(BaseHandler):
    def render_login(self, username='', error_username='', error_pwd=''):
        self.render('login.html', username=username, error_username=error_username, error_pwd=error_pwd)

    def get(self):
        self.render_login()

    def post(self):
        # Retrieve entries
        username = self.request.get('username')
        pwd = self.request.get('password')

        # Read cookie
        cookie_username = self.get_cookie('username')

        # Validity checks
        error_username = None
        error_pwd = None

        if not username:
            error_username = "That's not a valid username."
        elif not cookie_username or (username != cookie_username):
            error_username = 'Unknown username'
        if not pwd:
            error_pwd = "That's not a valid password."

        # Show welcome page in case of not error else
        # render login page
        if not (error_username or error_pwd):
            self.redirect('/blog/signup/welcome')
        else:
            self.render_login(username,
                              error_username if error_username else '',
                              error_pwd if error_pwd else '')


class BlogLogout(BaseHandler):
    def get(self):
        # Clear cookie
        self.put_cookie('username', '')

        # Show signup page
        self.redirect('/blog/signup')


app = webapp2.WSGIApplication([
    ('/blog', BlogFrontPage),
    ('/blog/newpost', BlogNewPost),
    ('/blog/([0-9]+)', BlogDisplayPost),
    ('/blog/signup', BlogRegister),
    ('/blog/signup/welcome', BlogRegisterSuccess),
    ('/blog/login', BlogLogin),
    ('/blog/logout', BlogLogout)
], debug=True)
