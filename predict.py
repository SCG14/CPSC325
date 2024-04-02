from ultralytics import YOLO
from PIL import Image
import json
import cv2

# load premade model
model = YOLO("yolov8n.pt")
# from PIL
im1 = Image.open("../../yoloTest/tmp.jpg")

results = model.predict(source=im1, save=True, classes=[9])  # save plotted images
