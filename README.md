
A brief one-sentence description of your application. E.g., "An intelligent document processing and chatbot application built with React and powered by cutting-edge AI."

  

---

  

## Live Demo & Showcase

  

Check out the live application and a video walkthrough to see it in action!

  

*  **Frontend URL:**  **https://ai-test-fe-cyan.vercel.app/**

*  **Backend URL:**  **https://ortabe.onrender.com**
note: This is a free render service which hybernates after 15 mins and take 1-2 minutes to reload. 

*  **Video Showcase:**  **https://screenrec.com/share/H6ZOuc9Vek**

*  **FronetEnd Repo:**  **https://github.com/hamidkhj/ai-test-fe**
  
*  **Backend Repo:**  **https://github.com/hamidkhj/ai-test-be**
---

  

## ✨ Key Features

  

*  **AI-Powered Chatbot:** Engage in natural conversations with a chatbot that has deep knowledge of your uploaded documents and only answers based on that knowldege.

*  **Intelligent Document Validation:** Automatically validate documents using google Document AI and and an LLM assistant.

*  **Secure & Scalable:** Built with performance and security best practices in mind.

*  **Modern UI/UX:** A clean, responsive, and user-friendly interface built with React.

  

---

  

## 🛠️ Tech Stack

  

| Category | Technology |

|---------------|-----------------------------------------------|

| **Frontend** | React, Tailwind CSS, Axios |

| **Backend** | Node.js |

| **AI Model** | Togather/Llama-3.3-70B-Instruct-Turbo, Google/Document AI |

| **Embeddings**| Cohere/embed-english-v3.0 |

| **Vector DB** | Faiss |

| **Database** | Mongoose, Redis |

| **Deployment**| Vercel (Frontend), Render (Backend) |

  

---

  

## 🏁 Getting Started

  

Follow these instructions to set up and run the project on your local machine for development and testing purposes.

  

### Installation & Setup

  

1.  **Clone the repository:**

```bash
git clone https://github.com/[your-github-username]/[your-repo-name].git
cd [your-repo-name]
```

  

2.  **Set up the Backend:**

```bash
cd ai-test-be
npm install
```

Create a `.env` file in the `root` directory and add the following environment variables:

```env
APP_ENVIRONMENT=development

COHERE_API_KEY=<Your-API-KEY>

JWT_SECRET=secret1234

MONGO_URI=<Mongo-URI>

PORT=8000

NODE_ENV=development

TOGETHER_API_KEY = <Your-API-Key>

GOOGLE_APPLICATION_CREDENTIALS=<Google-Secret-File-Name>

REDIS_URL=<Redis-Url>

GC_DOC_PATH=<Path-to-Google-Secret-File>

OCR_ENDPOINT=<Endpoint-For-Google-Document-Process>
```

  

3.  **Set up the Frontend:**

```bash
cd ai-test-fe # or your frontend folder name
npm install
```

Create a `.env.local` file in the `root` directory and add the following variable to point to your backend:

```env

REACT_APP_BACKEND_URL_LOCAL=http://localhost:8000
REACT_APP_BACKEND_URL_PROD=<your-backend-api->
REACT_APP_ENVIRONMENT=development

```

  

### Running the Application

  

1.  **Start the Backend Server:**

```bash
npm run dev
```

The backend API will be running on `http://localhost:8000` (or the port you specified).

Open Swagger at http://localhost:8000/api/docs .

2.  **Start the Frontend Development Server:**

```bash
npm start
```

The React application will open in your browser at `http://localhost:3000` .

  

---

  

## 🏛️ System Architecture & Features Explained

  

### 1. AI Chatbot Solution (RAG)

  

The chatbot uses a **Retrieval-Augmented Generation (RAG)** architecture to provide answers based on a custom knowledge base. The file was created based on FAQ section of the [https://www.ortagroup.co.uk/faqs]OrtaGroup website. 

  

*  **AI Model & API:** I am using Llama-3.3-70B-Instruct-Turbo through TagatherAI APIs. This model is amazing at following instruction and has the right size for this task. It can handle different questions while being fast and performant. 

  

*  **Vector Database:**  **Faiss** is used as the vector database. Here's the workflow:

1.  **Initialization:** To improve the performance of the appliation, the document is chunked and embedded the moment the server is starting. These vectors, along with their original text, are stored and indexed in Faiss for fast retrieval. Since the document is small, to avoid information loss, I have used a Flat index. 

2.  **Embedding:** With every chat request, the user input is embedded using the same embedding model and compared againsed the embeddings stored in the VDB. 

3.  **Retrieval:** After the similarity check, top k most relevant parts of the document is used as the context.

4.  **Generation:** The prompt is sent to the model. The model then generates a comprehensive answer based on this context or refuse to answer if there are no relevent context available. 

  

*  **Rate Limiter:** To prevent abuse and manage API costs, a rate limiter middleware using `redisio` was created. This middleware is set to stop users from sending more than a set number of requests in a set time limit and locks them out for a perios. At the moment, it is set to only allow 2 requests per minute (for Demo).

*  **Authentication:** Since the chatbot is meant for users alone, the requireauth middleware was added to the chatbot route. 

*  **Potential Improvements:**

*  **Re-Ranking:** Use a more sophisticated model (like a cross-encoder) to re-rank the initial search results before sending them to the LLM.
*  **Caching:** Implement a cache (e.g., Redis) for frequently asked questions to reduce latency and API calls.
* **Different Chunking logics** Since the FAQ section was small, the chunking is following a simple logic that fits the current document. But for larger documents, it is best to improve this logic.
* **VDB Indexing** To avoid information loss, the FAQ embeddings are stored using a FlatIndex in the Faiss database. This approach can be computationally expensive for larger documents. 

  

### 2. AI Document Validation Module

  

This module intelligently validates uploaded documents (Paassport or Drivers License) to ensure they contain the required information in the correct format.

  

*  **AI Used & How It Works:**

1.  **OCR :** The uploaded document is sent to Google Clouds Document AI processor and the information is extracted from the image. 

2.  **Structured Extraction with AI:** I am leveraging ** a structured data prompt** to generate a `json` output using the same LLM used in the chatbot. 

3.  **Prompt Engineering:** A carefully crafted prompt is sent to the AI. This prompt includes:

* The extracted text from the document.

* Instructions to return a JSON object that indicates `isValid: true/false` and extracted information if the document passes. 

4.  **Parsing the Response:** The backend parses the structured JSON response from the AI to determine the document's validity and present the specific errors to the user.

  

*  **Potential Improvements:**

*  **Specialized Models:** Use purpose-built document AI services like **Document Classification** or **ID Validation** to insure a more robust solution.  

*  **Human-in-the-Loop:** Create a UI for human review where documents that fail automatic validation can be quickly checked and corrected by a person.

*  **Fine-Tuning:** For high-volume, specific document types, fine-tuning a smaller, open-source model could provide higher accuracy and lower costs.

* **Prompt-Engineering** Due to time constraints, not many prompts were tested. This solution can improve (asking the model to validate information such as the name, whether dates have passed the current date, etc) and ask the model to return a list of all the errors observed. 
---

  

## ⚡ Performance/Security Considerations

  

*  **FAQ Embedding:** The FAQ embeddings are generated once at the server's initialization to avoid excessive calls to embedding API and the overhead. 

* **Rate Limiter** A middleware using `redisio` was added to the chatbot routes to avoid excessive use by the user. Same logic could be applied to the **Document Validation** module as well. 

*  **FAQ Embedding:** Since it was not explicitly mentioned whether the **Document Validation** module is available to the regular users (those who have not logged in) or not, the `requireAuth` middleware was not added to the routes. 
---

  

## 🎨 UI/UX Considerations

  

*  **Responsiveness:** The application is using Tailwind CSS to ensure a seamless experience.


*  **User Feedback:** Clear loading states and skeleton screens are used to keep the user informed of the application's state.

*  **Intuitive Chat Interface:** The chat interface includes features like typing indicators and message history for a familiar and engaging user experience. It also supports auto scroll. 

