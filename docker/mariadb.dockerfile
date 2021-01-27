FROM bitnami/mariadb:latest

EXPOSE 3306

COPY util/database/ /docker-entrypoint-initdb.d