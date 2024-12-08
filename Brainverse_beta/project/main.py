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
