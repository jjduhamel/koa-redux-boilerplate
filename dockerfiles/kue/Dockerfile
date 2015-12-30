from node:0.12
maintainer John Duhamel <john.duhamel@gmail.com>
env NODE_PATH=/usr/local/lib/node_modules
run npm install -g nodemon express kue kue-ui
run mkdir /app
run mkdir /app/tasks
add server.js /app/server.js
workdir /app
expose 3000
cmd nodemon --harmony --ext js server.js
