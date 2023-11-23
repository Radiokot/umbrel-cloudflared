# use LTS Node image to use as a builder
FROM node:lts-slim AS builder

# work under the /app directory
WORKDIR /app

# copy files required to install dependencies first
COPY package.json package-lock.json svelte.config.js ./

# install the dependencies for production
RUN npm i -p

# copy all the sources
COPY . .

# build the app
RUN npm run build

# take the distroless Node 18 image
FROM gcr.io/distroless/nodejs18-debian11

# work under the /app directory
WORKDIR /app

# copy the built app, dependencies and the package file
# as described in the Svelte adapter-node docs
COPY --from=builder /app/build server/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

# expose the app server port
EXPOSE 3000

# tell Node and other code this is production
ENV NODE_ENV=production

# run the app server (entrypoint is node)
CMD ["server"]

