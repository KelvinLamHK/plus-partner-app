FROM node:16-alpine

# Set the working directory to /app inside the container
WORKDIR /app

# Copy app files
COPY . .

# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile get installed)
RUN npm ci

# Build the app
RUN npm run build

# ==== RUN =======
# Expose the desired port on which the app will be running
ENV PORT 3000
EXPOSE 3000

# Set NODE_ENV to production to suppress warning messages
ENV NODE_ENV production

# Start the app
CMD ["npx", "serve", "-s", "build", "-l", "tcp://0.0.0.0:3000"]