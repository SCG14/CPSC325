from ultralytics import YOLO
#https://docs.ultralytics.com/quickstart/#use-ultralytics-with-python
# Create a new YOLO model from scratch
model = YOLO('yolov8n.yaml')

# Load a pretrained YOLO model (recommended for training)
model = YOLO('yolov8n.pt')

# Train the model using the 'coco128.yaml' dataset for 3 epochs
# C:\Users\santi\Desktop\Spring 2024\yoloTest\.venv\Lib\site-packages\ultralytics\cfg\datasets\coco128.yaml
results = model.train(data='coco128.yaml', epochs=3)

# Evaluate the model's performance on the validation set
results = model.val()

# # Perform object detection on an image using the model
# results = model('https://ultralytics.com/images/bus.jpg')
#
# # Export the model to ONNX format
success = model.export(format='onnx')