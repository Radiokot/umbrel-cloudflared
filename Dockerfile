# use LTS Node image to use as a builder
FROM node:lts-slim AS builder

# work under the /app directory
WORKDIR /app

# copy npm files first
COPY package.json package-lock.json ./

# install the production dependencies
RUN npm install -p

# copy all the sources
COPY . .

# build the app
RUN npm run build

# take the distroless Node 18 image
FROM gcr.io/distroless/nodejs18-debian11

# work under the /app directory
WORKDIR /app

# copy the built app
COPY --from=builder /app/build/ ./

# expose the app server port
EXPOSE 3000

# run the app server
CMD ["index.js"]
