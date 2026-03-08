FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Install Python and required libraries for the backtesting engine
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install -r engine/requirements.txt && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "backend/server.js"]

