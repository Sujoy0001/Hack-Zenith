from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
import firebase_admin
from firebase_admin import credentials, storage
import io
import os

app = FastAPI()

# Initialize Firebase Admin SDK (do this once)
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase-service-account.json")  # Or use env var
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'findin-d6c16.firebasestorage.app'  # Optional if in cred
    })

# Get the default bucket
bucket = storage.bucket()

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):  # Optional: restrict types
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Create a blob (file reference in bucket)
    blob = bucket.blob(f"uploads/{file.filename}")
    
    # Upload from the uploaded file contents
    contents = await file.read()
    blob.upload_from_string(contents, content_type=file.content_type)
    
    # Make public (optional) and get URL
    blob.make_public()
    
    return {"filename": file.filename, "url": blob.public_url}

@app.get("/download/{filename}")
async def download_file(filename: str):
    blob = bucket.blob(f"uploads/{filename}")
    
    if not blob.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # Stream the file back
    file_bytes = blob.download_as_bytes()
    return StreamingResponse(io.BytesIO(file_bytes), media_type=blob.content_type)

@app.get("/")
def root():
    return {"message": "Firebase Storage with FastAPI"}