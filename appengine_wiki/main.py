# Web
import webapp2

# Local dependencies
from handlers import Signup, Login, Logout, EditPage, WikiPage

PAGE_RE = r'(/(?:[a-zA-Z0-9_-]+/?)*)'
app = webapp2.WSGIApplication([
    ('/signup', Signup),
    ('/login', Login),
    ('/logout', Logout),
    ('/_edit' + PAGE_RE, EditPage),
    (PAGE_RE, WikiPage),
    ], debug=True)
