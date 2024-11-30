FROM node:latest
WORKDIR /app
COPY  package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
COPY server.js /.
CMD ["npm" ,"start"]

# Définir les variables d'environnement pour la base de données PostgreSQL
ENV PGHOST=db
ENV PGPORT=5432
ENV PGUSER=postgres
ENV PGPASSWORD=12345
ENV PGDATABASE=cenad