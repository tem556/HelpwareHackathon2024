import sqlite3
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

'''
encoding for status in db
0: Unknown
1: Patient
2: Dead
'''

print("yayayyaya")
app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT"],
    allow_headers=["Content-Type", "Authorization"],
)


# Connect to sqlite3 file
conn = sqlite3.connect('health_db/health_records.db', check_same_thread=False)
cursor = conn.cursor()

get_query = ('''SELECT * FROM health_records WHERE ID = ?''')

get_all_query = ('''SELECT * FROM health_records''')

insertion_query = ('''INSERT INTO health_records (ID, PASSWORD, AGE, WEIGHT, 
                   HEIGHT, BLOOD_TYPE, ALLERGIES, SURGERIES, OTHER, STATUS)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''')

update_query = ('''UPDATE health_records SET ID = ?, PASSWORD = ?, AGE = ?, WEIGHT = ?, HEIGHT = ?, BLOOD_TYPE = ?, 
                ALLERGIES = ?, SURGERIES = ? ,OTHER = ? WHERE ID = ?''')

def get_image_64(id):
    image = Image.open('images/' + str(id) + '.jpg')

    # turn it into base64 string
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    image_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

    return image_base64

@app.get("/api/v1/user/{user_id}")
def get_user_info(user_id: str):
    # Execute the SELECT query with the ID as a parameter
    # Search for the user with the provided user_id
    cursor.execute(get_query, (user_id, ))

    # Fetch the result (assuming there is only one row)
    row = cursor.fetchone()

    # Create a dictionary from the row data
    if row:
        column_names = [description[0] for description in cursor.description]

        for i in range(len(column_names)):
            column_names[i] = column_names[i].lower()

        # get id to get image
        id = row[0]
        
        # get image if possible
        image_64 = get_image_64(id)

        row_dict = dict(zip(column_names, row))
        row_dict['image'] = image_64
        

        if (row[0] == "1"):
            row_dict['role'] = 'admin'
        
        return row_dict
    else:
        print(f"No entry found with ID {user_id}")
    



    return {"message": "User information and image received successfully", "user_id": user_id}

@app.post("/api/v1/user/{user_id}")
async def register_user(
    id: str = Form(...),
    name: str = Form(...),
    age: int = Form(...),
    weight: int = Form(...),
    height: str = Form(...),
    blood_type: str = Form(...),
    allergies: str = Form(...),
    surgeries: str = Form(...),
    other_conditions: str = Form(...),
    password: str = Form(...),
    image: UploadFile = File(...),
    status: int = Form(...)
):
    
    # Save picture locally in images folder
    contents = image.file.read()
    with open("images/" + id + ".jpg", 'wb') as f:
        f.write(contents)

    
    data_to_insert = (id, password, age, weight, height, blood_type, allergies, surgeries, other_conditions, 0)
    cursor.execute(insertion_query, data_to_insert)

    conn.commit()
    
    # Return a success message
    return {"message": "User information and image received successfully", "user_id": id}

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
    image: str = Form(None)
):
    # Process the received information for update
    # For example, update the user's information in the database
    # And save the new image if provided
    print(f'Updating user information for user: {user_id}')

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
    # Save picture locally in images folder
    contents = image.file.read()
    with open("images/" + id + ".jpg", 'wb') as f:
        f.write(contents)

    
    data_to_update = (user_id, password, age, weight, height, blood_type, allergies, surgeries, other_conditions, user_id)
    cursor.execute(update_query, data_to_update)

    conn.commit()

    # Return a response indicating success
    return {"message": "User information updated successfully", "user_id": user_id}

@app.get("/api/v1/admin/users")
def get_all_users():
    # Execute the SELECT query with the ID as a parameter
    # Search for the user with the provided user_id
    cursor.execute(get_all_query)

    # Fetch the result (assuming there is only one row)
    rows = cursor.fetchall()

    # Create a dictionary from the row data
    res = []
    i = 0
    if rows:
        for row in rows:
            column_names = [description[0] for description in cursor.description]

            for i in range(len(column_names)):
                column_names[i] = column_names[i].lower()

            # get image based on id (assume id is idx 0)
            id = row[0]
            print(id)
            image_base64 = get_image_64(id)

            # add images to dictionary
            row_dict = dict(zip(column_names, row))
            row_dict['image'] = image_base64
            res.append(row_dict)

            
        
        print("hererajalrkjlkajrlwkj")
        # print(res)
        json_array = json.dumps(res)


        # Print the JSON string
        print(json_array)
        return res
    
    return

@app.post("/api/v1/admin/user/img")
async def register_user(
    image: str = Form(...)
):
    # get image and save locally as test
    # for now
    # test = Image.open(BytesIO(image_data))
    # test.save("test.jpg")
    embeddings = faiss_model.generate_embeddings("images/")
    prediction = faiss_model.get_prediction("test.jpg",embeddings)

    id = prediction[0][0][0:-4]

        # Execute the SELECT query with the ID as a parameter
    # Search for the user with the provided user_id
    cursor.execute(get_query, (id, ))

    # Fetch the result (assuming there is only one row)
    row = cursor.fetchone()

    # Create a dictionary from the row data
    if row:
        column_names = [description[0] for description in cursor.description]

        # get id to get image
        id = row[0]
        
        # get image if possible
        image_64 = get_image_64(id)

        row_dict = dict(zip(column_names, row))
        row_dict['image'] = image_64

        return row_dict
    else:
        print(f"No entry found with ID {id}")

