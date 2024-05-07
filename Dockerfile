FROM node:20-alpine as base

WORKDIR /src
COPY package*.json ./
EXPOSE 4000

# Install cron, FFmpeg, Chromium, and set up permissions
RUN apk update && \
    apk add --no-cache dcron ffmpeg chromium

# Copy crons
COPY startup.sh /startup.sh
COPY crons/airtable_watcher.sh /src/crons/airtable_watcher.sh


# Give permissions to the cron job
RUN chmod u+x /src/crons/airtable_watcher.sh


# Add crontab file in the cron directory
COPY crons/crontab /etc/crontabs/root

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . /src

CMD ["/bin/sh", "/startup.sh"]
