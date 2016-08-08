import os
import webapp2
import jinja2
from google.appengine.ext import db


template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
                               autoescape=True)


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

            # Render new URL with blog
            self.redirect('/blog')

        else:
            # Error case
            # Render new post URL with error
            self.render_new_post(subject,
                                 content,
                                 'Please enter subject and content')


app = webapp2.WSGIApplication([
    ('/blog', BlogFrontPage),
    ('/blog/newpost', BlogNewPost)
], debug=True)
