from flask import Flask, request, render_template, jsonify
from PIL import Image
from io import BytesIO
from ultralytics import YOLO
import os
import shutil

app = Flask(__name__)

# Load the YOLO model
model = YOLO("yolov8n.pt")

@app.route('/')
def index():
    return render_template('frontend.html')

@app.route('/detect', methods=['POST'])
def detect():
    # Get the image file from the request
    file = request.files['image']

    # Read the image file
    image = Image.open(file.stream)
    image_filename = os.path.join(os.getcwd(), "tmp.jpg")
    image.save(image_filename)

    predict_folder_path = os.path.join(os.path.dirname(__file__), 'runs', 'detect', 'predict')
    if os.path.exists(predict_folder_path):
        try:
            shutil.rmtree(predict_folder_path)
            print("Successfully deleted the 'predict' folder.")
        except OSError as e:
            print(f"Error: {predict_folder_path} : {e.strerror}")
    # Perform object detection
    results = model.predict(source='tmp.jpg', save=True)

    image_path = os.path.join(predict_folder_path, 'tmp.jpg')
    with open(image_path, 'rb') as f:
        image_data = f.read()

    # Return the image data for display in the frontend
    return image_data

if __name__ == '__main__':
    app.run(debug=True)
