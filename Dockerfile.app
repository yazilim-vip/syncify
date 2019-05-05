FROM yazilimvip/syncify-base:latest

# Create app directory
WORKDIR /usr/src/syncify

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

# Bundle app source
COPY app .

EXPOSE 3000
CMD [ "npm", "start" ]