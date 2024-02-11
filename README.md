# Youtube Studio GPT

Welcome to the Youtube Studio GPT, an innovative tool designed to revolutionize the way you create YouTube video descriptions. This guide will help you set up the application for local development, introduce its functionalities, and demonstrate how to utilize its features to enhance your video content effectively.

![Screenshot 2024-02-11 at 2 05 36 PM](https://github.com/rthomas24/YoutubeStudio-GPT/assets/44555719/87a27b00-a975-41f2-9a47-5e152a1e58a0)


## Getting Started

### Prerequisites

Before diving in, ensure you have the following installed on your system:
- Git
- Node.js (version 14 or later)
- npm (which usually comes with Node.js)
### Installation and Setup

To get the application up and running, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the application directory.
3. Install the required dependencies by running `npm install`.
4. Start the application server in development mode by executing `npm start`. This will set up all the necessary endpoints for the application to function properly.
5. Once the server is up and running, you need to start the frontend. Run `ng serve` in your terminal. This command will compile the Angular application and serve it, usually on `http://localhost:4200`.

After completing these steps, the application should be accessible at `http://localhost:4200`.

## How to Use

The Youtube Studio GPT offers two main functionalities: the Description Builder and the Chat Bot. Here's how you can make the most out of these features:

### Description Builder

1. **Paste a YouTube URL**: In the URL input box, paste the URL of your YouTube video or any other video from YouTube into the designated field.
2. **Customize Your Description**: Utilize the available text fields and tools to craft a detailed and engaging description for your video.
3. **Choose Description Detail Level**: Decide whether you want to use the **Full Transcript** or **Summary** for generating your description.
   - **Full Transcript**: Selecting this option will provide more detailed and accurate descriptions, leveraging the complete video transcript. However, it will consume more tokens.
   - **Summary**: Opting for the summary will use fewer tokens but might result in descriptions that lack some important information unless specified in the instructions or key terms.
4. **AI Assistance**: By clicking on the "AI Button," you will activate the AI's creative suggestions and ideas. The AI will generate content based on the video URL you've provided and your choice of detail level, aiding you in creating a unique and compelling description.
5. **Generate Descriptions**: After filling out the description builder steps, click the "Generate" button. This action will introduce a new button at the top part of the container, allowing you to navigate between your generated descriptions and the description builder. You can click the "Generate" button as many times as you wish to produce multiple descriptions, enhancing your options and creativity.

### Chat Bot

1. **Access the Chat Bot**: Navigate to the Chat Bot tab from the main interface.
2. **Enter Your YouTube Video URL**: Paste the URL of the video you wish to inquire about.
3. **Interact with the AI**: Start asking questions or expressing concerns related to the video content. The AI will analyze the video and provide you with informative and relevant responses.

## Use Cases

The Youtube Studio GPT is designed to cater to a wide range of users, including:

- **Content Creators**: Elevate your video descriptions with SEO-friendly content that accurately reflects the essence of your videos, thereby attracting more viewers.
- **Marketing Professionals**: Generate compelling descriptions for promotional videos to boost engagement and conversion rates.
- **Educators and Students**: Summarize educational content or lectures for enhanced accessibility and understanding.

By integrating AI-powered tools, the application offers a unique approach to content creation and interaction, making it an invaluable resource for anyone looking to improve their video's visibility or seeking creative inspiration.

For further assistance or to report issues, please visit our [GitHub Issues](https://github.com/your/repository/issues) page or contact support.

Thank you for choosing Youtube Studio GPT. Happy content creating!
