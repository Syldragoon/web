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
import re

rot13Form = """
<form method="post" action="/rot13">
  <h1>Convert on ROT13</h1>
  <textarea name="text">%s</textarea>
  <input type="submit" value="Convert">
</form>
"""

signUpForm = """
<form method="post" action="/signup">
  <h1>Sign up</h1>
  <label>
    User name:
    <input type="text" name="username" value="%(username)s">
    <span name="errorUsername" style="color: red">%(errorUsername)s</span>
  </label>
  <br>
  <label>
    Password:
    <input type="password" name="password">
  </label>
  <br>
  <label>
    Re-type pasword:
    <input type="password" name="verify">
    <span name="errorPwd" style="color: red">%(errorPwd)s</span>
  </label>
  <br>
  <label>
    Email address:
    <input type="text" name="email" value="%(email)s">
    <span name="errorEmail" style="color: red">%(errorEmail)s</span>
  </label>
  <br>
  <br>
  <label>
    <input type="submit" value="Create account">
  </label>
</form>
"""

SignUpSuccessHtml = """
<h1>Welcome, %s!</h1>
"""

def formatForm(form, value = ""):
    return form % value

def formatSignUpForm(dic = {'username': '',
                            'email': '',
                            'errorUsername': '',
                            'errorPwd': '',
                            'errorEmail': ''}):
    return signUpForm % dic

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

USER_RE = re.compile(r"^[a-zA-Z0-9_-]{3,20}$")
PWD_RE = re.compile(r"^.{3,20}$")
EMAIL_RE = re.compile(r"^[\S]+@[\S]+.[\S]+$")

def valid_username(username):
    return USER_RE.match(username)

def valid_pwd(pwd):
    return PWD_RE.match(pwd)

def valid_email(email):
    return EMAIL_RE.match(email)

class Rot13FormRequest(webapp2.RequestHandler):
    def get(self):
        inText = self.request.get('text')
        escText = escape(inText)
        self.response.out.write(formatForm(rot13Form, escText))

    def post(self):
        inText = self.request.get('text')
        escText = escape(inText)
        newText = convertRot13(escText)
        self.redirect('/rot13?text=' + newText)

class SignUpFormRequest(webapp2.RequestHandler):
    def get(self):
        self.response.out.write(formatSignUpForm())

    def post(self):
        esc_username = escape(self.request.get('username'))
        esc_pwd1 = escape(self.request.get('password'))
        esc_pwd2 = escape(self.request.get('verify'))
        esc_email = escape(self.request.get('email'))

        validUserName = valid_username(esc_username)
        validPwd = valid_pwd(esc_pwd1) and valid_pwd(esc_pwd2) and (esc_pwd1 == esc_pwd2)
        validEmail = valid_email(esc_email)

        if validUserName and validPwd and validEmail:
            self.redirect('/signup/welcome?username=' + esc_username)
        else:
            self.response.out.write(formatSignUpForm({'username': esc_username,
                                                  'email': esc_email,
                                                  'errorUsername': "That's not a valid username." if not validUserName else '',
                                                  'errorPwd': "Your passwords didn't match." if not validPwd else '',
                                                  'errorEmail': "That's not a valid email address." if not validEmail else ''}))

class SignUpSuccessRequest(webapp2.RequestHandler):
    def get(self):
        esc_username = escape(self.request.get('username'))
        self.response.out.write(SignUpSuccessHtml % esc_username)

app = webapp2.WSGIApplication([
    ('/rot13', Rot13FormRequest),
    ('/signup', SignUpFormRequest),
    ('/signup/welcome', SignUpSuccessRequest)
], debug=True)
