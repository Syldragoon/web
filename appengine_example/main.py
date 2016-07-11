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

form2 = '''<form method="post">
What is your birthday?
<br>
<label>
Month
<input type="text" name="month">
</label>
<label>
Day
<input type="text" name="day">
</label>
<label>
Year
<input type="text" name="year">
</label>
<br>
<br>
<input type="submit">
</form>
'''

months = ['January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December']

def valid_month(month):
    month_cap = month.capitalize()
    if month_cap in months:
        return month_cap

class MainPage(webapp2.RequestHandler):
    def get(self):
        #self.response.headers['Content-Type'] = 'text/plain'
        self.response.write(form2)

    def post(self):
        m = self.request.get("month")
        self.response.write("Month is " + m + ", validity check: " + (m if valid_month(m) else "invalid"))

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
