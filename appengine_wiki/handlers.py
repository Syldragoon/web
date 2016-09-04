# Local dependencies
from handlers_base import BaseHandler


class Signup(BaseHandler):
    def render_signup(self, username = '', email = '', errors = {}):
        self.render('signup.html', username=username, email=email, errors=errors)

    def get(self):
        self.render_signup()

    def post(self):
        pass


class Login(BaseHandler):
    def render_login(self, username = '', errors = {}):
        self.render('login.html', username=username, errors=errors)

    def get(self):
        self.render_login()

    def post(self):
        pass


class Logout(BaseHandler):
    def get(self):
        self.redirect('/signup')


class EditPage(BaseHandler):
    def get(self, page_url):
        self.render('edit_page.html', page_url=page_url)

    def post(self, page_url):
        self.redirect(page_url)


class WikiPage(BaseHandler):
    def get(self, page_url):
        self.render('wiki_page.html')
