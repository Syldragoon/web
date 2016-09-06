# Local dependencies
from handlers_base import BaseHandler
from datamodel import User
from tools import *


class Signup(BaseHandler):
    def render_signup(self, username='', email='', errors={}):
        self.render('signup.html',
                    username=username,
                    email=email,
                    error_username=errors['username'] if 'username' in errors else '',
                    error_pwd=errors['pwd'] if 'pwd' in errors else '',
                    error_email=errors['email'] if 'email' in errors else '')

    def get(self):
        self.render_signup()

    def post(self):
        # Retrieve inputs
        username = self.request.get('username')
        pwd = self.request.get('password')
        pwd_retry = self.request.get('verify')
        email = self.request.get('email')

        # Validity checks
        errors = {}
        if not valid_username(username):
            errors['username'] = 'Invalid username'
        if not valid_pwd(pwd):
            errors['pwd'] = 'Invalid password'
        elif pwd != pwd_retry:
            errors['pwd'] = 'Passwords not matching'
        if not valid_email(email):
            errors['email'] = 'Invalid Email'

        # Check if user already existing
        # if checks ok
        if not errors:
            user = User.login(username, pwd)
            if user:
                errors['username'] = 'User already existing'

        # if checks ok
        if not errors:
            # Add new user into DB
            user = User.signup(username, pwd, email)
            user.put()
            print 'New user signed up'

            # Add cookie
            self.login(user)

            # Redirect to front page
            self.redirect('/')
        else:
            # Format signup page
            # with inputs
            self.render_signup(username, email, errors)


class Login(BaseHandler):
    def render_login(self, username='', errors={}):
        self.render('login.html',
                    username=username,
                    error_username=errors['username'] if 'username' in errors else '',
                    error_pwd=errors['pwd'] if 'pwd' in errors else '')

    def get(self):
        self.render_login()

    def post(self):
        # Retrieve inputs
        username = self.request.get('username')
        pwd = self.request.get('password')

        # Validity checks
        errors = {}
        if not valid_username(username):
            errors['username'] = 'Invalid username'
        if not valid_pwd(pwd):
            errors['pwd'] = 'Invalid password'
        if self.user:
            errors['username'] = 'User already logged in'

        # Try to get user from DB
        # if checks ok
        user = None
        if not errors:
            user = User.login(username, pwd)

            # Validity checks
            if not user:
                errors['username'] = 'Unknown user'

        # If user successfully found
        if user:
            # Add cookie
            self.login(user)
            print 'User logged in'

            # Redirect to front page
            self.redirect('/')
        else:
            # Format login page
            # with inputs
            self.render_login(username, errors)


class Logout(BaseHandler):
    def get(self):
        # Remove cookie
        self.logout()
        print 'User logged out'

        # Redirect to signup page
        self.redirect('/signup')


class EditPage(BaseHandler):
    def get(self, page_url):
        self.render('edit_page.html', page_url=page_url)

    def post(self, page_url):
        self.redirect(page_url)


class WikiPage(BaseHandler):
    def get(self, page_url):
        self.render('wiki_page.html')
