from flask import Flask, request, render_template, jsonify
from PIL import Image
from ultralytics import YOLO
import os
import shutil
import json

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

    # Get array of objects
    selected_objects_json = request.form.get('selectedObjects')  # Get the selectedObjects array as JSON string
    selected_objects = json.loads(selected_objects_json) if selected_objects_json else []
    selected_numbers = class_processing(selected_objects)

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
    results = model.predict(source='tmp.jpg', save=True, classes=selected_numbers)

    image_path = os.path.join(predict_folder_path, 'tmp.jpg')
    with open(image_path, 'rb') as f:
        image_data = f.read()

    # Return the image data for display in the frontend
    return image_data


def class_processing(selected_objects):
    classes = {
        "person": 0,
        "bicycle": 1,
        "car": 2,
        "motorcycle": 3,
        "bus": 5,
        "train": 6,
        "truck": 7,
        "boat": 8,
        "traffic light": 9,
        "cat": 15,
        "fire hydrant": 10,
        "stop sign": 11,
        "parking meter": 12,
        "bench": 13,
        "bird": 14
    }

    selected_numbers = []
    for thing in selected_objects:
        selected_numbers.append(int(classes[thing]))

    if not selected_numbers:
        selected_numbers = list(classes.values())

    return selected_numbers
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
