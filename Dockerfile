FROM node:16 as build

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install -D

# Compile project
COPY . .
RUN npm run build


# Production
FROM node:16

# Create app directory
WORKDIR /app

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY --from=build /app/dist dist

CMD [ "node", "dist/main.js" ]