Brainverse_Beta is the backend built on FastAPI. To run backend follow these steps:

# Team Documentation: API Configuration and Testing

This documentation describes the steps each team member should follow to configure and test the provided **FastAPI** code, which uses the **C4AI Command R+ 08-2024** model. Follow these steps carefully to ensure the server and APIs function correctly.

---

### **1. Prerequisites**
Before you start, make sure you have:
- Python version **3.8 or higher**.
- Access to your Hugging Face token (`API_TOKEN`).
- The following libraries installed:
  - `fastapi`
  - `uvicorn`
  - `transformers`
  - `torch` (or PyTorch)

If you don't have them, you can install them with the command:
```bash
pip install fastapi uvicorn transformers torch
```

---

### **2. Project Configuration**
1. **Create a virtual environment:**
   - On Windows:
     ```bash
     python -m venv .venv
     .\.venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

2. **Add the code to the `main.py` file:**
   - Create a directory for the project and a file named `main.py`.
   - Copy the provided code and paste it into the `main.py` file.

3. **Configure your Hugging Face API token:**
   - Replace `API_TOKEN` with your valid token.

---

### **3. Start the Server**
1. **Start the FastAPI server with Uvicorn:**
   ```bash
   uvicorn main:app --reload
   ```
   - `main` is the name of the file without the `.py` extension.
   - The `--reload` option allows the server to update automatically after code changes.

2. **Verify that the server is running:**
   - Open your browser and go to `http://127.0.0.1:8000`.
   - You should see a response like:
     ```json
     {
       "message": "The server is up and running!"
     }
     ```

---

### **4. Test the APIs**
1. **Main Endpoint for Content Generation:**
   - **URL:** `http://127.0.0.1:8000/generate-content`
   - **Method:** POST
   - **Request Body (JSON):**
     ```json
     {
       "prompt": "Write an article about the impact of AI on education."
     }
     ```
   - **Expected Result:**
     A JSON response containing a generated article, for example:
     ```json
     {
       "articles": [
         {
           "title": "Generated Article",
           "description": "This article was generated based on the provided prompt.",
           "content": "Artificial intelligence is revolutionizing education by..."
         }
       ]
     }
     ```

2. **Debug Endpoint (Optional):**
   - **URL:** `http://127.0.0.1:8000/debug`
   - **Method:** POST
   - **Request Body (JSON):**
     ```json
     {
       "prompt": "Test debug prompt"
     }
     ```
   - **Expected Result:**
     ```json
     {
       "prompt_received": "Test debug prompt"
     }
     ```

---

### **5. Troubleshooting**
#### **Error: PyTorch not found**
If you encounter an error related to PyTorch, install it with:
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

#### **Error: API Connection**
Ensure your Hugging Face token is correct and active. You can verify this by accessing your [Hugging Face account](https://huggingface.co/settings/tokens).

---

### **6. Important Notes**
- **Work Environment:**
  Each team member should use a virtual environment to isolate dependencies.
- **System Resources:**
  This model is very large (over 100 GB). Ensure you use a system with adequate resources (RAM and GPU).
- **Collaboration:**
  - **Atul:** Will need to test the API by sending POST requests to the `/generate-content` endpoint.
  - **Backend Developers:** Ensure the server handles requests correctly and returns valid responses.
  - **QA Team:** Test edge cases, such as invalid inputs or timeouts.

---

### **7. Final Goal**
- Ensure the **C4AI Command R+ 08-2024** model is correctly integrated.
- Provide a robust and functional API for AI-based content generation.

If you need further clarification or support, don't hesitate to ask! 😊

---

Here is the complete code to be added to the `main.py` file:

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from transformers import AutoTokenizer, AutoModelForCausalLM

# Hugging Face model configuration
API_TOKEN = "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"  # Replace with your valid token
MODEL_ID = "CohereForAI/c4ai-command-r-plus-08-2024"

try:
    # Load the tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, use_auth_token=API_TOKEN)
    model = AutoModelForCausalLM.from_pretrained(MODEL_ID, use_auth_token=API_TOKEN)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading the model: {e}")
    raise HTTPException(status_code=500, detail="Error loading the C4AI Command R+ 08-2024 model.")

# Define input/output models for FastAPI
class Article(BaseModel):
    title: str
    description: str
    content: str

class ArticleResponse(BaseModel):
    articles: List[Article]

class PromptInput(BaseModel):
    prompt: str

# Initialize the FastAPI application
app = FastAPI()

# Function to generate content using the model
def generate_content(prompt: str) -> str:
    try:
        print(f"Received prompt: {prompt}")  # Debug log

        # Define conversation input:
        conversation = [
            {"role": "user", "content": prompt}
        ]

        # Define tools available for the model to use:
        tools = [
          {
            "name": "internet_search",
            "description": "Returns a list of relevant document snippets for a textual query retrieved from the internet",
            "parameter_definitions": {
              "query": {
                "description": "Query to search the internet with",
                "type": 'str',
                "required": True
              }
            }
          },
          {
            'name': "directly_answer",
            "description": "Calls a standard (un-augmented) AI chatbot to generate a response given the conversation history",
            'parameter_definitions': {}
          }
        ]

        # Render the tool use prompt as a string:
        tool_use_prompt = tokenizer.apply_tool_use_template(
            conversation,
            tools=tools,
            tokenize=False,
            add_generation_prompt=True,
        )
        print(tool_use_prompt)

        # Prepare the message for the model
        messages = [{"role": "user", "content": tool_use_prompt}]
        input_ids = tokenizer.apply_chat_template(
            messages, tokenize=True, add_generation_prompt=True, return_tensors="pt"
        )

        # Generate text
        gen_tokens = model.generate(
            input_ids,
            max_new_tokens=1000,  # Maximum number of generated tokens
            temperature=0.7,  # Controls the randomness of generation
            top_p=0.9,  # Nucleus filtering
            do_sample=True,  # Allows generation based on sampling
        )

        # Decode the generated result
        gen_text = tokenizer.decode(gen_tokens[0], skip_special_tokens=True)
        print(f"Generated response: {gen_text[:200]}...")  # Log the first 200 characters
        return gen_text
    except Exception as e:
        print(f"Error generating content: {e}")
        raise HTTPException(status_code=500, detail=f"LLM model error: {e}")

# Endpoint to generate content
@app.post("/generate-content", response_model=ArticleResponse)
def generate_content_endpoint(prompt_input: PromptInput):
    prompt = prompt_input.prompt
    print(f"Received prompt via API: {prompt}")

    try:
        # Generate content
        generated_content = generate_content(prompt)
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Unknown error: {e}")
        raise HTTPException(status_code=500, detail="Unknown error during content generation.")

    # Create the article with the generated content
    article = Article(
        title="Generated Article",
        description="This article was generated based on the provided prompt.",
        content=generated_content
    )

    return ArticleResponse(articles=[article])

# Test endpoint
@app.get("/")
def read_root():
    return {"message": "The server is up and running!"}

# Debug endpoint (optional)
@app.post("/debug")
def debug_endpoint(data: PromptInput):
    print(f"Received request: {data}")
    return {"prompt_received": data.prompt}
```


---

# Detailed Guide for Structuring the Prompt

The model we are using requires a prompt structured in a specific format to generate high-quality content. Following these guidelines will help you achieve the best possible results. Here is how the prompt should be structured:

## Example of Prompt

```json
{
  "prompt": "Write an article about the applications of artificial intelligence in healthcare."
}
```

## Prompt Structure

**Prompt Key**: This key contains the text of the prompt that describes the content you want to generate. The text should be clear and specific to achieve the best results.

## Examples of Prompts

### 1. Health Article

```json
{
  "prompt": "Write an article about the impact of artificial intelligence on healthcare."
}
```

### 2. Cooking Recipe

```json
{
  "prompt": "Provide a detailed recipe for making a classic Italian lasagna."
}
```

### 3. Technology Guide

```json
{
  "prompt": "Create a guide on how to set up a home network with a router and Wi-Fi."
}
```

### 4. Short Story

```json
{
  "prompt": "Write a short story about a time-traveling detective solving a mystery in ancient Rome."
}
```

## Important Notes

### Clarity

Ensure the prompt is clear and specific. The more details you provide, the better the generated result will be. A well-structured prompt helps the model understand exactly what you want to achieve.

### Length

The prompt should not be too long. Try to keep it concise but informative. A prompt that is too long can confuse the model and lead to less accurate results.

### Context

Provide enough context to allow the model to generate relevant and coherent content. Context helps the model understand the tone, style, and subject of the content you desire.

## Example of API Request

Here is an example of how to send a POST request to the `/generate-content` endpoint with a prompt:

```bash
curl -X POST "http://127.0.0.1:8000/generate-content" -H "Content-Type: application/json" -d '{
  "prompt": "Write an article about the future of renewable energy technologies."
}'
```

## Expected Response

The response will be a JSON containing the generated article, for example:

```json
{
  "articles": [
    {
      "title": "Generated Article",
      "description": "This article was generated based on the provided prompt.",
      "content": "Renewable energy technologies are becoming increasingly important as the world seeks to reduce its dependence on fossil fuels..."
    }
  ]
}
```

## Conclusion

By following these guidelines, you will be able to structure effective prompts that will help the model generate high-quality content. If you have any other questions or need further clarification, do not hesitate to ask!

---

Brainverse-news-generator

# BrainverseNewsGenerator

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
