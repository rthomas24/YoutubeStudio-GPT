**Notes**

- The project is still under development, and additional features and changes will be introduced in the future.

**YouTube Studio GPT**

Welcome to the **YouTube Studio GPT**! This tool helps you generate YouTube video descriptions using AI and also provides a chat interface to interact with the AI for further customization. Here's how to get started:

**Prerequisites**

Before you begin, make sure you have the following installed:

- Node.js
- Angular CLI
- Firebase CLI (for cloud functions)

**Installation**

1. Clone the repository to your local machine.
2. Navigate to the project directory and install the dependencies:

```npm install```

3. Set up Firebase functions by navigating to the functions directory and running:

```npm install```

**Configuration**

1. Create a .env file in the functions directory with your OpenAI API key and a custom API key for securing your endpoints:

```
OPENAI_KEY=your_openai_api_key
API_KEY=your_custom_api_key
```

2. Update the environment files in the src/environments/ directory with the API endpoints and your custom API key.

**Running the Application**

1. Start the Angular development server:

```npm start```

2. Deploy the Firebase functions:

```firebase deploy --only functions```

3. Open your browser and navigate to http://localhost:4200 to view the application.

**Using the Description Generator**

1. Enter the YouTube video URL to fetch the video information and transcript.
2. Select the desired tone for the AI-generated description from the provided options.
3. Adjust the word count slider to set the length of the description.
4. Add any specific keywords or phrases you want to include in the description.
5. Click the "Generate Description" button to request the AI to create a description based on your inputs.

**Using the Chat Interface**

1. After generating a description, you can use the chat interface to refine it further.
2. Type your message or request in the chat input and send it to the AI.
3. The AI will respond based on the context of the video and your previous interactions.


Enjoy creating engaging and tailored YouTube video descriptions with the power of AI!