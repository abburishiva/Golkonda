docker-compose down
rm -rf api
mkdir -p api
cp -R config api
cp -R controllers api
cp -R LoadTest api
cp -R models api
cp -R routes api
cp -R tests api
cp -R tests_prod api
cp -R utils api
cp -R app.js api
cp -R app.json api
cp -R Gruntfile.js api
cp -R package.json api
mkdir -p api/logs
rm -rf api/tests/config/config.json

cat > api/tests/config/config.json <<EOF
  {
  "super":{
    "app_type": "talentscreen",
    "type": "login",
    "email_address": "kumar@whitebox-learning.com",
    "password":"Excellence@123"
  },
  "employee":{
    "app_type": "talentscreen",
    "type": "login",
    "email_address": "sudha@innova-path.com",
    "password":"Excellence@123"
  },
  "candidate":{
    "app_type": "talentscreen",
    "type": "login",
    "email_address": "sudhaaa.ip@gmail.com",
    "password":"Excellence@123"
  },
  "mochaUrl":"http://192.168.86.39:8000/v1/",
  "devQaUrl":"https://api.devqa.talentscreen.io/v1/",
  "qaUrl":"http://192.168.86.39:8000/v1/",
  "stagUrl":"https://api.stag.talentscreen.io/v1/",
  "productionUrl":"https://api.talentscreen.io/v1/"
}

EOF

cat > api/script.sh <<EOF
#! /bin/sh

cd ../../../MakkahMasjid

cd EmailEngine

pm2 start node-env.json --env development

cd ../NotificationEngine

pm2 start node-env.json --env development

cd ../RecordingsUpload

pm2 start recordingsUpload.js

cd ../YoutubeService

pm2 start youtubeService.js

cd ../PushNotifications

pm2 start notifier.js

cd  /

cd /usr/src/app

node app.js

EOF

cat > api/Dockerfile <<EOF
FROM ipengr/debian

#Create a directory  container
RUN mkdir -p /usr/src/app

#go to working directory
WORKDIR /usr/src/app

#copy  all files to work directory
COPY . /usr/src/app

RUN npm install pm2 -g

RUN sed -i 's,https://api.qa.talentscreen.io,http://192.168.86.39:8000,g' config/config.json
RUN sed -i 's,api.qa.talentscreen.io,192.168.86.39:8000,g' config/config.json
RUN sed -i 's,mongo.qa.talentscreen.io:27017,192.168.86.39,g' config/config.json
RUN sed -i 's,127.0.0.1,redis,g' config/config.json
#install modules
RUN npm install

#Replaceing file
RUN grunt qa --force

#expose 8000 port
EXPOSE 8000

#go to root folder
WORKDIR /
RUN mkdir -p /Recordings/Un-encoded/
RUN mkdir -p /Recordings/Encoded/

#clone MakkahMasjid
RUN git clone http://IPENGR:K5CbwDsvrFMHmVdsWJY+eBa84CikxR30nnlLiW3bWg@review.innova-path.com/a/MakkahMasjid

WORKDIR MakkahMasjid

RUN sed  -i 's,https://api.qa.talentscreen.io,http://192.168.86.39:8000,g' config/default.json
RUN sed  -i 's,api.qa.talentscreen.io,192.168.86.39:8000,g' config/default.json
RUN sed  -i 's,mongo.qa.talentscreen.io,192.168.86.39,g' config/default.json

RUN npm install

RUN grunt qa --force



# go to email engine and install modules
WORKDIR MakkahMasjid/EmailEngine
RUN mkdir -p log-files
RUN mkdir -p test-files
RUN npm install && npm install zmq

# go to NotificationEngine and install modules
WORKDIR MakkahMasjid/NotificationEngine
RUN mkdir -p log-files 
RUN npm install && npm install agenda


RUN npm install
WORKDIR MakkahMasjid/NotificationEngine/modules
RUN mkdir -p log-files

# go to RecordingsUpload and install modules
WORKDIR MakkahMasjid/RecordingsUpload
RUN mkdir -p log-files
RUN npm install
RUN npm install chokidar


WORKDIR MakkahMasjid/Scripts
RUN mkdir -p log-files
RUN npm install

# go to RecordingsUpload and install modules
WORKDIR MakkahMasjid/YoutubeService
RUN mkdir -p test-files
RUN mkdir -p log-files
RUN npm install
RUN npm install mime

WORKDIR MakkahMasjid/PushNotifications
RUN mkdir -p test-files
RUN mkdir -p log-files
RUN npm install
RUN npm install web-push && npm install fcm-push

WORKDIR /usr/src/app

RUN chmod +x script.sh

CMD  ./script.sh


EOF

cat > docker-compose.yml <<EOF
version: "2"

services:
  api:
      build: api
      ports:
        - 8000:8000
      environment:
        - ENVTYPE=docker

  redis:
      image: redis
EOF

mkdir -p dbdump

cat > dbdump/docker-compose.yml <<EOF
version: "2"

services:
  mongodatabase:
      image: bitnami/mongodb:latest
      ports:
       - 27017:27017
      environment:
       - MONGODB_USERNAME=ipkumar
       - MONGODB_PASSWORD=kumarip131
       - MONGODB_DATABASE=talentdb  

EOF

cat > dbdump/Dockerfile <<EOF
FROM  bitnami/mongodb:latest

RUN  mongodump --host mongo.echo.talentscreen.io --authenticationDatabase talentdb --username ipkumar --password kumarip131 --db talentdb --excludeCollection tokensSharing  --out dump/talentdb

RUN mongorestore --host 192.168.86.39 --port 27017 --authenticationDatabase talentdb --username ipkumar --password kumarip131 /dump/talentdb

EOF

cd dbdump
docker-compose up -d --build
sleep 1m
docker build -t db_dump .
cd ..
docker-compose up -d --build
cd api
npm install
grunt mochaTest


