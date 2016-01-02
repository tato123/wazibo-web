FROM node:0.12

MAINTAINER Jonathan Fontanez<fontanezj1@gmail.com>

# Commands will run in this directory
WORKDIR /wazibo-web/src

# Add all our code inside that directory that lives in the container
ADD . /wazibo-web/src

RUN npm install gulp jshint bower -g;npm install; bower --allow-root install

# Expose our port for mapping
EXPOSE  9080
# Run the application
CMD ["npm", "run", "start"]