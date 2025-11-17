FROM redis:7.2.5-alpine
ENV TZ Asia/Shanghai
COPY redis.conf /usr/local/etc/redis/redis.conf
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]

