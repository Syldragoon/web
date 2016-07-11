# Copyright 2016 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import webapp2

form = '''<form method="get" action="/FormRequest">

<select name="q">
    <option value="1">one</option>
    <option value="2">two</option>
    <option value="3">three</option>
</select>


<label>
    One
    <input type="radio" name="q" value="one">
</label>
<label>
    Two
    <input type="radio" name="q" value="two">
</label>
<label>
    Three
    <input type="radio" name="q" value="three">
</label>
<input type="submit">
</form>
'''

class MainPage(webapp2.RequestHandler):
    def get(self):
        #self.response.headers['Content-Type'] = 'text/plain'
        self.response.write(form)

class FormRequest(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write(self.request)

    def post(self):
        #self.response.headers['Content-Type'] = 'text/plain'
        self.response.write(self.request)

app = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/FormRequest', FormRequest)
], debug=True)
