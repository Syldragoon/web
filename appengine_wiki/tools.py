# Validity checks
import re
# Hashing
import hashlib
import hmac
import random
import string

# Regular expressions for validity checks
USER_RE = re.compile(r"^[a-zA-Z0-9_-]{3,20}$")
PWD_RE = re.compile(r"^.{3,20}$")
EMAIL_RE = re.compile(r"^[\S]+@[\S]+.[\S]+$")


def valid_username(username):
    return USER_RE.match(username)


def valid_pwd(pwd):
    return PWD_RE.match(pwd)


def valid_email(email):
    return not email or EMAIL_RE.match(email)


# Hashing methods
# for username (using secret key)
hash_key = 'fkahfdjkdflk'


def make_hash(value):
    return '%s|%s' % (value, hmac.new(hash_key, value).hexdigest())


def check_hash(hash_value):
    value = hash_value.split('|')[0]
    if make_hash(value) == hash_value:
        return value


# for password (using salt)
def make_salt():
    return ''.join([random.choice(string.ascii_letters) for i in xrange(5)])


def make_hash_salt(value, salt=None):
    if not salt:
        salt = make_salt()
    return '%s|%s' % (salt, hashlib.sha256(value + hash_key + salt).hexdigest())


def check_hash_salt(value, hash_value):
    salt = hash_value.split('|')[0]
    return make_hash_salt(value, salt) == hash_value


def make_hash_pw(name, pwd, salt=None):
    return make_hash_salt(name + pwd, salt)


def check_hash_pw(name, pwd, hash_value):
    return check_hash_salt(name + pwd, hash_value)
