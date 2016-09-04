# Web
import webapp2

# Templates
import os
import jinja2

# Local dependencies
import tools

# Jinja2 setup
template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
                               autoescape=True)


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
        # check hash value if NOT empty
        hash_value = self.request.cookies.get(name)
        if hash_value:
            return check_hash(hash_value)
