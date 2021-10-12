FROM nginx:stable-alpine
LABEL org.opencontainers.image.source="https://github.com/navikt/tpts-inngang-flate"
LABEL org.opencontainers.image.title="tpts-inngang-flate-labs"
COPY build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
