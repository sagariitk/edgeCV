from flask import Flask, render_template, request, redirect, jsonify, Response
from flask_cors import CORS
import cv2
import datetime, time
import db_operations
from flask_jwt_extended import ( JWTManager, jwt_required, create_access_token, get_jwt_identity, jwt_refresh_token_required, create_refresh_token)
from binascii import a2b_base64
from PIL import Image
import boto3
from os import listdir
import os
from os.path import isfile, join
import db_operations

app = Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY'] = 'secretkey'
jwt = JWTManager(app)

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"msg": "Flask App Working"}), 200


@app.route('/start', methods=['POST'])
@jwt_required
def start():

    total_duration = request.json.get('total_duration', None)
    split_time = request.json.get('split_time', None)
    color = request.json.get('color', None)

    total_duration = int(total_duration)
    split_time = int(split_time)

    total_pics = total_duration/split_time
    total_pics = int(total_pics)

    camera = cv2.VideoCapture(0)
    if(color == 'gray'):
        for i in range(total_pics):
            camera = cv2.VideoCapture(0)
            ret, frame = camera.read()
            greyscale = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            timestamp = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
            image_name = "Gray_"  + timestamp + '.jpg'
            cv2.imwrite("%s" % image_name, greyscale)
            time.sleep(int(split_time))
            i = i + 1
    else:    
        for i in range(total_pics):
            camera = cv2.VideoCapture(0)
            ret, frame = camera.read()
            colored = frame
            timestamp = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
            image_name = "Color_"  + timestamp + '.jpg'
            print(image_name)
            cv2.imwrite("%s" % image_name, colored)
            time.sleep(int(split_time))
            i = i + 1
    camera.release()
    uploadS3()
    return jsonify({"msg": "Completed the Frame capture"}), 200


@app.route('/images', methods=['GET'])
@jwt_required
def images():

    urlsDict = []
    urls = db_operations.getURLs()

    for url in urls:
        urlsDict.append(url[1])
    return jsonify(urlsDict), 200     


def uploadS3():
    client = boto3.client('s3',
        aws_access_key_id="AKIA2O5QQ2XD22262NWF",
        aws_secret_access_key="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",
        )
    bucket_name = 'edge-app'
    file_path = os.getcwd()
    file_list = [f for f in listdir(file_path) if isfile(join(file_path, f))]
    for filename in file_list:
        if('.jpg' in filename and 'uploaded' not in filename):
            print(filename)
            client.upload_file(filename, bucket_name, filename, ExtraArgs={'ACL':'public-read'})
            os.rename(filename, "uploaded_" + filename)
            location = client.get_bucket_location(Bucket=bucket_name)['LocationConstraint']
            url = "https://s3-%s.amazonaws.com/%s/%s" % (location, bucket_name, filename)
            db_operations.insertURL(filename, url)
        else:
            continue



@app.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)

    expires_token = datetime.timedelta(seconds=600)
    expires_refresh = datetime.timedelta(seconds=6000)
    if(username == 'admin' and password == 'admin'):
        ret = {
            'access_token': create_access_token(identity=username, expires_delta=expires_token),
            'refresh_token': create_refresh_token(identity=username, expires_delta=expires_refresh)
        }
        return jsonify(ret), 200
    elif(username == 'test' and password == 'test'):
        ret = {
            'access_token': create_access_token(identity=username, expires_delta=expires_token),
            'refresh_token': create_refresh_token(identity=username, expires_delta=expires_refresh)
        }
        return jsonify(ret), 200
    else:
        return jsonify({"msg": "Username or password is not valid"}), 401


if __name__ == '__main__':
    uploadS3()
    # app.run(debug = True, host='0.0.0.0', port=5000)


