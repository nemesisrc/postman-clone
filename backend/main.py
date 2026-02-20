from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx
import json

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
