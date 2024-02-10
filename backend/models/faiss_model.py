import face_recognition
import faiss
import numpy as np
import os

def generate_embeddings(folder_path):
    embeddings = []
    names = []
    print(os.listdir(folder_path))
    for img_name in os.listdir(folder_path):
        img_path = os.path.join(folder_path, img_name)
        print(img_path)
        img = face_recognition.load_image_file(img_path)
        encoding = face_recognition.face_encodings(img)
        if encoding:
            embeddings.append(encoding[0])
            names.append(img_name)
    return np.array(embeddings), names


def create_faiss_index(embeddings):
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)
    return index

def find_similar_faces(query_img_path, index, embeddings, names, k=1):
    query_img = face_recognition.load_image_file(query_img_path)
    query_embedding = face_recognition.face_encodings(query_img)[0]
    D, I = index.search(np.array([query_embedding]), k)
    return [(names[i], D[0][j]) for j, i in enumerate(I[0])]


def get_prediction(query_img_path, embeddings, names):
    # Create and train the FAISS index
    index = create_faiss_index(embeddings)

    # Find the most similar face(s) for the input image
    similar_faces = find_similar_faces(query_img_path, index, embeddings, names, k=1)
    print("Most similar faces:", similar_faces)
    return similar_faces


# folder_path = '../images'
# query_img_path = '../test.jpg'

# # # # Generate embeddings for the images in the folder
# embeddings, names = generate_embeddings(folder_path)
# get_prediction(query_img_path, embeddings)

