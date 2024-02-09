import base64
from io import BytesIO
import json
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pydantic import BaseModel, Field
from typing import Optional
from models import faiss_model


# folder_path = '../images'
# query_img_path = '../test.jpg'

# # Generate embeddings for the images in the folder
# embeddings, names = generate_embeddings(folder_path)
# get_prediction(query_img_path, embeddings)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT"],
    allow_headers=["Content-Type", "Authorization"],
)

# Load initial data from JSON file
with open("data.json", "r") as file:
    data = json.load(file)


@app.get("/api/v1/user/{user_id}")
def get_user_info(user_id: int):
    # Search for the user with the provided user_id
    for user in data:
        if user["id"] == user_id:
            return user
    # If user is not found, raise HTTPException with status code 404
    raise HTTPException(status_code=404, detail="User not found")

@app.post("/api/v1/user/{user_id}")
async def register_user(
    user_id: int,
    name: str = Form(...),
    age: int = Form(...),
    weight: int = Form(...),
    height: str = Form(...),
    blood_type: str = Form(...),
    allergies: str = Form(...),
    surgeries: str = Form(...),
    other_conditions: str = Form(...),
    password: str = Form(...),
    image: UploadFile = File(...)
):
    # Create a new user dictionary
    new_user = {
        "id": user_id,
        "name": name,
        "age": age,
        "weight": weight,
        "height": height,
        "blood_type": blood_type,
        "allergies": allergies,
        "surgeries": surgeries,
        "other": other_conditions,
        "password": password,
        "image": image
    }
    

    # Save picture locally in images folder
    image_data = base64.b64decode(image)
    image = Image.open(BytesIO(image_data))
    image.save("images/" + str(id) + ".jpg")

    # Add the new user to the data list
    data.append(new_user)
    
    # Save the updated data back to the JSON file
    with open("data.json", "w") as file:
        json.dump(data, file, indent=4)
    
    # Return a success message
    return {"message": "User information and image received successfully", "user_id": user_id}

@app.put("/api/v1/user/{user_id}")
async def update_user_info(
    user_id: str,
    name: str = Form(None),
    age: int = Form(None),
    weight: int = Form(None),
    height: str = Form(None),
    blood_type: str = Form(None),
    allergies: str = Form(None),
    surgeries: str = Form(None),
    other_conditions: str = Form(None),
    password: str = Form(None),
    image: UploadFile = File(None)
):
    # Process the received information for update
    # For example, update the user's information in the database
    # And save the new image if provided
    print(f'Updating user information for user: {user_id}')
    
    # Return a response indicating success
    return {"message": "User information updated successfully", "user_id": user_id}

# @app.get("/api/v1/admin/users")
# def get_all_users():
#     data = {}  # Define your data here
#     return data

# @app.put("/api/v1/admin/user/img")
# def save_image(updated_data: dict):
#     return updated_data