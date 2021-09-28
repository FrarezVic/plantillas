#################################################################################
#Fecha de Creación:  2020-06-23
#Autor: Eduardo Natanael Castillo Caballero [encastillo@frd.org.mx]
#Actualizaciones:
#Versión: 1.0
#################################################################################
FROM node:12.2.0

ENV         TZ                America/Mexico_City
RUN         ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

#Se asigna el usuario que ejecutará la aplicación
USER node

# Create app directory
WORKDIR /home/node

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY imagen/package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY imagen .

EXPOSE 8080
CMD [ "npm", "start" ]