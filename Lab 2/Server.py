#!flask/bin/python
from flask import Flask, make_response
import csv
import json

app = Flask(__name__)

@app.route('/')
def index():
    return make_response(open('index.html').read())

@app.route('/api/rms_rnd')
def apirms():
    csvfile = open('rms_random.csv', 'r')
    fieldnames = ("a", "b")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        list.append(row)
    return make_response(json.dumps(list))

@app.route('/api/rms_ada')
def apirmsada():
    csvfile = open('rms_adaptive.csv', 'r')
    fieldnames = ("a", "b")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        list.append(row)
    return make_response(json.dumps(list))

@app.route('/api/kmean')
def apikmean():
    csvfile = open('kmean.csv', 'r')
    fieldnames = ("a", "b")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        list.append(row)
    return make_response(json.dumps(list))

@app.route('/api/scr_ada')
def apiada():
    csvfile = open('eigvals_adaptive.csv', 'r')
    fieldnames = ("a", "b")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        list.append(row)
    return make_response(json.dumps(list))

@app.route('/api/scr_rnd')
def apirnd1():
    csvfile = open('eigvals_random.csv', 'r')
    fieldnames = ("a", "b")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        list.append(row)
    return make_response(json.dumps(list))

@app.route('/api/data_ada')
def apisam():
    csvfile = open('adaptive_sample.csv', 'r')
    fieldnames = ("a", "b", "c")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        list.append(row)
    return make_response(json.dumps(list))

@app.route('/api/data_rnd')
def apirnd():
    csvfile = open('random_sample.csv', 'r')
    fieldnames = ("a", "b", "c")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        list.append(row)
    return make_response(json.dumps(list))

@app.route('/api/mds_eu')
def apimdseuc():
    csvfile = open('Euclidean.csv', 'r')
    fieldnames = ("a", "b", "c")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        list.append(row)

    return make_response(json.dumps(list))

@app.route('/api/mds_cor')
def apimdscor():
    csvfile = open('Correlation.csv', 'r')
    fieldnames = ("a", "b", "c")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        list.append(row)

    return make_response(json.dumps(list))

@app.route('/api/pca')
def apipca():
    csvfile = open('PCA_data.csv', 'r')
    fieldnames = ("a", "b", "c")
    reader = csv.DictReader(csvfile, fieldnames)
    list = []
    for row in reader:
        list.append(row)

    return make_response(json.dumps(list))

if __name__ == '__main__':
    app.run(debug = True)