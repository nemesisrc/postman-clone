from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx
import json
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/proxy")
async def proxy_request(request: Request):
    data = await request.json()
    method = data.get("method", "GET").upper()
    url = data.get("url")
    headers = data.get("headers", {})
    body = data.get("body", "")

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            if method == "GET":
                resp = await client.get(url, headers=headers)
            elif method in ["POST", "PUT", "PATCH", "DELETE"]:
                resp = await client.request(method, url, headers=headers, content=body)
            else:
                return {"error": f"Method {method} not supported"}
            
            return {
                "status": resp.status_code,
                "headers": dict(resp.headers),
                "data": resp.text,
                "is_json": "application/json" in resp.headers.get("content-type", "").lower()
            }
        except Exception as e:
            return {"error": str(e)}

@app.post("/analyze")
async def analyze_api_call(request: Request):
    data = await request.json()
    request_info = data.get("request", {})
    response_info = data.get("response", {})
    
    if not api_key:
        return {"error": "GEMINI_API_KEY not set in .env"}

    prompt = f"""
    You are an expert API debugger and developer assistant. Analyze the following API request and response:
    
    REQUEST:
    Method: {request_info.get('method')}
    URL: {request_info.get('url')}
    Headers: {json.dumps(request_info.get('headers'), indent=2)}
    Body: {request_info.get('body')}
    
    RESPONSE:
    Status Code: {response_info.get('status')}
    Headers: {json.dumps(response_info.get('headers'), indent=2)}
    Data: {response_info.get('data')}
    Error (if any): {response_info.get('error')}
    
    Tasks:
    1. Identify any errors (HTTP status errors, potential payload issues, header problems, etc.).
    2. Suggest specific corrections (e.g., correct JSON format, missing headers, wrong endpoint).
    3. Provide the corrected request details if applicable.
    
    Keep the output concise and developer-friendly. Use Markdown.
    """
    
    try:
        model = genai.GenerativeModel("gemini-3.1-pro")
        response = model.generate_content(prompt)
        return {"analysis": response.text}
    except Exception as e:
        return {"error": f"AI analysis failed: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8001)
