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
import cgi

rot13Form = """
<form method="post" action="/rot13">
  <h1>Convert on ROT13</h1>
  <textarea name="text">%s</textarea>
  <input type="submit" value="Convert">
</form>
"""

def formatForm(form, value = ""):
    return form % value

def escape(text):
    return cgi.escape(text, quote=True)

def convertRot13(text):
    # Loop on characters from text
    for i, c in enumerate(text):
        # Consider only ASCII letters
        if (ord(c) < 128) and c.isalpha():
            # Get first letter depending
            # on case
            firstLetter = 'a' if c.islower() else 'A'

            # Find 13th letter after
            # using ASCII code
            newLetter = chr( ord(firstLetter) + ((ord(c) - ord(firstLetter) + 13) % 26) )

            # Replace coresponding letter in text
            text = text[:i] + newLetter + text[i+1:]

    return text

#newText = ''

class Rot13FormRequest(webapp2.RequestHandler):
    def get(self):
        inText = self.request.get('text')
        escText = escape(inText)
        self.response.out.write(formatForm(rot13Form, escText))

    def post(self):
        inText = self.request.get('text')
        escText = escape(inText)
        newText = convertRot13(escText)
        #print "IN: %s, ESC: %s, NEW: %s" % (inText, escText, newText)
        self.redirect('/rot13?text=' + newText)

app = webapp2.WSGIApplication([
    ('/rot13', Rot13FormRequest),
], debug=True)
