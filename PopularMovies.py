from bottle import route, request, response, static_file
from bottle import post, get, put, delete
from bottle import run, template, error, default_app

import json

HOST = "localhost"

@route('/')
def home():
    return static_file('templates/home.html', root='')

@route('/favicon.ico')
def home():
    return static_file('favicon.ico', root='')

@get('/APIkey')
def getAPIkey():
    CLIENT_SECRET = ''
    with open('APIkey.json') as data_file:
        data = json.load(data_file)
        CLIENT_SECRET = data['key']

    return CLIENT_SECRET

# File Referencing
@route('/static/<path:path>')
def server_static(path):
    "Routes static files (HTML, CSS, JS or images) references to their correct file path"
    return static_file(path, root='')

@error(404)
@error(405)
@error(500)
def error_page(error=404):
    """Redirect to error page incase of incorrect pathing or unauthorized access"""
    return template('templates/errorPage.tpl')

run(host=HOST, port=8080, app=default_app())