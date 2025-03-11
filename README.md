# AI Knowledge Base Analysis

A comprehensive solution for analyzing and improving your knowledge base using AI. This project includes a frontend for managing documents and a backend for document analysis and OpenAI fine-tuning.

## Overview

This project provides tools to:

1. **Upload and manage knowledge base documents** (PDF, Word, TXT, etc.)
2. **Fine-tune OpenAI models** on your specific documentation
3. **Analyze documents** to identify content gaps and areas for improvement
4. **Generate recommendations** to enhance your knowledge base
5. **Provide insights** about the overall quality and coverage of your documentation

## Project Structure

- **Frontend**: React application for document management and visualization of analysis results
- **Backend**: Node.js/Express server for document processing, OpenAI fine-tuning, and analysis

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- OpenAI API key

### Installation

1. Clone the repository
2. Set up the backend:
   ```
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   mkdir uploads
   ```
3. Set up the frontend:
   ```
   cd ..
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd server
   npm run dev
   ```
2. Start the frontend development server:
   ```
   cd ..
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:5173`

## Features

### Document Management

- Upload documents in various formats
- Organize documents with tags
- Search and filter documents
- View document details and analysis results

### Fine-Tuning

- Select documents for fine-tuning
- Create and manage fine-tuning jobs
- Monitor fine-tuning progress
- Use fine-tuned models for analysis

### Document Analysis

- Analyze individual documents
- Identify content gaps and missing information
- Get recommendations for improvement
- View quality metrics and scores

### Knowledge Base Analysis

- Analyze the entire knowledge base
- Identify overall coverage gaps
- Detect content redundancies
- Get recommendations for new content

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, MongoDB
- **AI**: OpenAI API, GPT-3.5/GPT-4 fine-tuning
- **Document Processing**: PDF.js, Mammoth.js

## License

MIT 