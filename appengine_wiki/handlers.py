# Local dependencies
from handlers_base import BaseHandler
from datamodel import User, Page
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
        # Compute new url from previous one
        self.set_new_url_from_previous(['/signup', '/login'])

        self.render_signup()

    def post(self):
        # Retrieve inputs
        username = self.request.get('username')
        pwd = self.request.get('password')
        pwd_retry = self.request.get('verify')
        email = self.request.get('email')
        new_url = str(self.request.get('new_url'))

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
            print 'New user signed up'

            # Add cookie
            self.login(user)

            # Redirect to new url
            self.redirect(new_url)
        else:
            # Format signup page
            # with inputs and errors
            self.render_signup(username, email, errors)


class Login(BaseHandler):
    def render_login(self, username='', errors={}):
        self.render('login.html',
                    username=username,
                    error_username=errors['username'] if 'username' in errors else '',
                    error_pwd=errors['pwd'] if 'pwd' in errors else '')

    def get(self):
        # Compute new url from previous one
        self.set_new_url_from_previous(['/login', '/submit'])

        self.render_login()

    def post(self):
        # Retrieve inputs
        username = self.request.get('username')
        pwd = self.request.get('password')
        new_url = str(self.request.get('new_url'))

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

            # Redirect to new url
            self.redirect(new_url)
        else:
            # Format login page
            # with inputs and errors
            self.render_login(username, errors)


class Logout(BaseHandler):
    def get(self):
        # Compute new url from previous one
        self.set_new_url_from_previous(['/logout'])

        # Remove cookie
        self.logout()
        print 'User logged out'

        # Redirect to new url
        self.redirect(self.new_url)


class EditPage(BaseHandler):
    def render_edit_page(self, page_url, page_content='', error=''):
        self.render('edit_page.html',
                    page_url=page_url,
                    page_content=page_content,
                    error=error)

    def get(self, page_url):
        # Redirect to login page if NOT logged
        if not self.user:
            self.redirect('/login')

        # Render edit page
        # Fill page content if page already existing
        page_content = ''
        self.page = Page.get_page(page_url)
        if self.page:
            print 'Page found for url %s' % page_url
            page_content = self.page.page_content

        # Render edit page
        self.render_edit_page(page_url, page_content)

    def post(self, page_url):
        # Return not authorized if NOT logged
        if not self.user:
            self.render_error(401, 'You need to be logged in order to edit page')
            return

        # Retrieve inputs
        page_content = self.request.get('page_content')

        # Validity checks
        # Allow for now any content
        error = None

        # if checks ok
        if not error:
            # Retrieve page
            # if already existing
            self.page = Page.get_page(page_url)

            # Add new page version
            # in case of new page or
            # in case of new content
            if (not self.page) or (page_content != self.page.page_content):
                self.page = Page.new_page(self.user,
                                          page_url,
                                          page_content)
                print 'Page added for url %s' % page_url

            # Redirect to wiki page
            self.redirect(page_url)
        else:
            # Format edit page
            # with inputs and errors
            self.render_edit_page(page_url, page_content, error)


class WikiPage(BaseHandler):
    def get(self, page_url):
        # Check whether or not
        # input url was already created
        self.page = Page.get_page(page_url)
        if self.page:
            # If found, display content
            print 'Page found for url %s' % page_url
            self.render('wiki_page.html', page_content=self.page.page_content)
        else:
            # If not found, redirect to edit page
            self.redirect('/_edit%s' % page_url)
