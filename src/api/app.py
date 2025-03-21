
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
import tensorflow as tf
import torch
from werkzeug.utils import secure_filename
import io
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load the PyTorch model
def load_model():
    try:
        # This is a placeholder - you would load your actual model here
        # model = torch.load('llnet_generator_model.pth')
        # model.eval()
        print("Model loaded successfully")
        return None  # Return the model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

# Process image using OpenCV and PyTorch model
def process_image(image_path):
    try:
        # Read image using OpenCV
        img = cv2.imread(image_path)
        if img is None:
            return None, "Failed to read image"
        
        # Convert BGR to RGB
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Preprocess image for the model
        # This is highly model-specific, so you'll need to adjust based on your model requirements
        # For example, you might need to normalize, resize, etc.
        
        # Here we're just simulating a brightening effect
        # In a real implementation, you would pass the processed image through your model
        brightened = cv2.convertScaleAbs(img_rgb, alpha=1.3, beta=30)
        
        # Convert back to BGR for saving with OpenCV
        result = cv2.cvtColor(brightened, cv2.COLOR_RGB2BGR)
        
        # Save processed image
        output_path = os.path.join(app.config['UPLOAD_FOLDER'], 'processed_' + os.path.basename(image_path))
        cv2.imwrite(output_path, result)
        
        return output_path, None
    except Exception as e:
        print(f"Error processing image: {e}")
        return None, str(e)

@app.route('/api/process-image', methods=['POST'])
def api_process_image():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image part in the request'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No selected file'}), 400
    
    try:
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Process the image
        processed_path, error = process_image(filepath)
        
        if error:
            return jsonify({'success': False, 'error': error}), 500
        
        # Read the processed image and convert to base64
        with open(processed_path, "rb") as img_file:
            img_data = img_file.read()
            encoded_img = base64.b64encode(img_data).decode('utf-8')
        
        # Return the base64 encoded image
        return jsonify({
            'success': True, 
            'processedImageBase64': f"data:image/jpeg;base64,{encoded_img}"
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    # Load model at startup
    model = load_model()
    
    # Start the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)
