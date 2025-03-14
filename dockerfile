FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV VITE_BACKEND_API=http://38.242.208.242:3001
ENV VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwY3Z5YnN1bWdseWNvdWp6eHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NDMxNDYsImV4cCI6MjA1NjIxOTE0Nn0.1QGQ0PsqYQyURUPWkCvVWEx6RDgdmdm8IhZuDTP0lv4
ENV VITE_SUPABASE_URL=https://xpcvybsumglycoujzxts.supabase.co

RUN npm run build

RUN npm install -g serve

EXPOSE 5182

CMD ["serve", "-s", "dist", "-l", "5182"]
