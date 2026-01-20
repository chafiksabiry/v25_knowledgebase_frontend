FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV VITE_BACKEND_API=https://v25knowledgebasebackend-production.up.railway.app
ENV VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwY3Z5YnN1bWdseWNvdWp6eHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NDMxNDYsImV4cCI6MjA1NjIxOTE0Nn0.1QGQ0PsqYQyURUPWkCvVWEx6RDgdmdm8IhZuDTP0lv4
ENV VITE_SUPABASE_URL=https://xpcvybsumglycoujzxts.supabase.co
#ENV VITE_RUN_MODE=in-app
ENV VITE_COMPANY_ORCHESTRATOR_URL=/app11
ENV VITE_API_URL_ONBOARDING=https://v25searchcompanywizardbackend-production.up.railway.app/api

ENV VITE_RUN_MODE=standalone
ENV VITE_STANDALONE_USER_ID=6834946acf52e87c3ad15b39
ENV VITE_STANDALONE_COMPANY_ID=683494e4641398dc582eca88
ENV VITE_GIGS_API_URL=https://v25gigsmanualcreationbackend-production.up.railway.app/api
ENV VITE_FRONT_URL=https://harxv25knowledgebasefrontend.netlify.app
RUN npm run build

RUN npm install -g serve

EXPOSE 5182

CMD ["serve", "-s", "dist", "-l", "5182"]
