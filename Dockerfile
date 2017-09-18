FROM library/node:8

ENTRYPOINT ["/usr/local/bin/npm"]
CMD ["start"]

WORKDIR /usr/local/src
COPY package.json ./.
RUN npm install

COPY index.js .

