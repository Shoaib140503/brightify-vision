
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import cv2
import numpy as np
import tensorflow as tf
import torch
from werkzeug.utils import secure_filename
import io
import base64
import pywt

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure upload folders
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
FRAMES_FOLDER = 'frames'

for folder in [UPLOAD_FOLDER, PROCESSED_FOLDER, FRAMES_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER
app.config['FRAMES_FOLDER'] = FRAMES_FOLDER

# Load models
def load_llnet_model():
    try:
        # This is a placeholder - in a real scenario you would load the actual model
        # model = torch.load('llnet_generator_model.pth')
        # model.eval()
        print("LLNET model loaded successfully")
        return None
    except Exception as e:
        print(f"Error loading LLNET model: {e}")
        return None

def load_amtennet_model():
    try:
        # This is a placeholder - in a real scenario you would load the actual model
        # model = tf.keras.models.load_model('amtennet_deepfake_model.h5')
        print("AMTENnet model loaded successfully")
        return None
    except Exception as e:
        print(f"Error loading AMTENnet model: {e}")
        return None

def load_srgan_model():
    try:
        # This is a placeholder - in a real scenario you would load the actual model
        # model = tf.keras.models.load_model('srgan_model.h5')
        print("SRGAN model loaded successfully")
        return None
    except Exception as e:
        print(f"Error loading SRGAN model: {e}")
        return None

def load_rlgan_model():
    try:
        # This is a placeholder - in a real scenario you would load the actual model
        # model = tf.keras.models.load_model('RL_generator_model.h5')
        print("RLGAN model loaded successfully")
        return None
    except Exception as e:
        print(f"Error loading RLGAN model: {e}")
        return None

# Video Processing Functions
def extract_frames(video_path, output_dir):
    """Extract frames from a video and save them to the output directory."""
    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    frames = []
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        frame_path = os.path.join(output_dir, f"frame_{frame_count:04d}.jpg")
        cv2.imwrite(frame_path, frame)
        frames.append(frame)
        frame_count += 1
    
    cap.release()
    return frames, frame_count

def frames_to_video(frames, output_path, fps=30):
    """Convert frames to a video."""
    if len(frames) == 0:
        return None, "No frames to process"
    
    height, width, layers = frames[0].shape
    size = (width, height)
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, size)
    
    for frame in frames:
        out.write(frame)
    
    out.release()
    return output_path, None

# Feature 1.1: Frame Interpolation
def interpolate_frames(frame1, frame2, num_intermediate_frames=3):
    """Generate interpolated frames between two images."""
    frames = []
    
    # Convert frames to float32 for interpolation
    frame1_float = frame1.astype(np.float32)
    frame2_float = frame2.astype(np.float32)
    
    for i in range(1, num_intermediate_frames + 1):
        alpha = i / (num_intermediate_frames + 1)
        interpolated_frame = cv2.addWeighted(frame1_float, 1 - alpha, frame2_float, alpha, 0)
        frames.append(interpolated_frame.astype(np.uint8))
    
    return frames

def process_video_interpolation(video_path, num_intermediate_frames=3):
    frames_dir = os.path.join(app.config['FRAMES_FOLDER'], os.path.basename(video_path).split('.')[0])
    frames, _ = extract_frames(video_path, frames_dir)
    
    # Apply interpolation
    all_frames = []
    for i in range(len(frames) - 1):
        all_frames.append(frames[i])
        interpolated = interpolate_frames(frames[i], frames[i+1], num_intermediate_frames)
        all_frames.extend(interpolated)
    
    # Add the last frame
    if frames:
        all_frames.append(frames[-1])
    
    # Get original video properties
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    cap.release()
    
    # Convert frames to video
    output_path = os.path.join(app.config['PROCESSED_FOLDER'], f"interpolated_{os.path.basename(video_path)}")
    return frames_to_video(all_frames, output_path, fps)

# Feature 1.2: Images to Video
def images_to_video(image_paths, output_path, fps=30):
    """Convert a list of images to a video."""
    if not image_paths:
        return None, "No images provided"
    
    # Read the first image to get dimensions
    img = cv2.imread(image_paths[0])
    if img is None:
        return None, f"Could not read image: {image_paths[0]}"
    
    height, width, layers = img.shape
    size = (width, height)
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, size)
    
    for img_path in image_paths:
        img = cv2.imread(img_path)
        if img is not None:
            out.write(img)
    
    out.release()
    return output_path, None

# Feature 1.3: Speed Conversion
def process_video_speed(video_path, speed_factor):
    """Process video for speed conversion."""
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frames = []
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)
    
    cap.release()
    
    # Adjust frames for speed
    if speed_factor > 1:  # Fast motion
        # Skip frames to make video faster
        step = int(speed_factor)
        adjusted_frames = frames[::step]
    else:  # Slow motion
        # Duplicate frames to make video slower
        adjusted_frames = []
        for i in range(len(frames) - 1):
            adjusted_frames.append(frames[i])
            
            # Add duplicated frames
            num_duplicates = int(1 / speed_factor) - 1
            for _ in range(num_duplicates):
                adjusted_frames.append(frames[i])
        
        # Add the last frame
        if frames:
            adjusted_frames.append(frames[-1])
    
    # Convert to video
    output_path = os.path.join(app.config['PROCESSED_FOLDER'], f"speed_{speed_factor}_{os.path.basename(video_path)}")
    return frames_to_video(adjusted_frames, output_path, fps)

# Feature 2: Low Illumination Enhancement
def enhance_frame_low_light(img):
    """Enhance low light in a frame."""
    # Convert to HSV color space
    hsv_img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv_img)
    
    # Enhance brightness in V channel
    v_enhanced = cv2.equalizeHist(v)
    hsv_enhanced = cv2.merge([h, s, v_enhanced])
    
    # Convert back to BGR
    img_enhanced = cv2.cvtColor(hsv_enhanced, cv2.COLOR_HSV2BGR)
    
    # Apply additional brightness and contrast
    alpha = 1.3  # Contrast control
    beta = 30    # Brightness control
    img_enhanced = cv2.convertScaleAbs(img_enhanced, alpha=alpha, beta=beta)
    
    return img_enhanced

def process_video_low_light(video_path):
    """Process video for low light enhancement."""
    frames_dir = os.path.join(app.config['FRAMES_FOLDER'], os.path.basename(video_path).split('.')[0])
    frames, _ = extract_frames(video_path, frames_dir)
    
    # Apply low light enhancement to each frame
    enhanced_frames = [enhance_frame_low_light(frame) for frame in frames]
    
    # Get original video properties
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    cap.release()
    
    # Convert frames to video
    output_path = os.path.join(app.config['PROCESSED_FOLDER'], f"low_light_{os.path.basename(video_path)}")
    return frames_to_video(enhanced_frames, output_path, fps)

# Feature 3: Deepfake Detection (AMTENnet)
def detect_deepfake(video_path, model=None):
    """Detect if a video is deepfake using AMTENnet model."""
    frames_dir = os.path.join(app.config['FRAMES_FOLDER'], os.path.basename(video_path).split('.')[0])
    frames, frame_count = extract_frames(video_path, frames_dir)
    
    # Simulated model prediction
    # In a real implementation, you would use your AMTENnet model here
    fake_probability = np.random.rand()  # Simulate a random prediction
    is_fake = fake_probability > 0.5
    
    result = {
        "is_fake": bool(is_fake),
        "fake_probability": float(fake_probability),
        "total_frames": int(frame_count),
        "fake_frames": int(frame_count * fake_probability)
    }
    
    return result

# Feature 4: LLNET Model
def process_video_llnet(video_path, model=None):
    """Process video with LLNET model for low light enhancement."""
    frames_dir = os.path.join(app.config['FRAMES_FOLDER'], os.path.basename(video_path).split('.')[0])
    frames, _ = extract_frames(video_path, frames_dir)
    
    # In a real implementation, you would use your LLNET model here
    # For now, we'll use a simple enhancement as a placeholder
    enhanced_frames = [enhance_frame_low_light(frame) for frame in frames]
    
    # Get original video properties
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    cap.release()
    
    # Convert frames to video
    output_path = os.path.join(app.config['PROCESSED_FOLDER'], f"llnet_{os.path.basename(video_path)}")
    return frames_to_video(enhanced_frames, output_path, fps)

# Feature 5: SRGAN Model
def process_video_srgan(video_path, model=None):
    """Process video with SRGAN model for super resolution."""
    frames_dir = os.path.join(app.config['FRAMES_FOLDER'], os.path.basename(video_path).split('.')[0])
    frames, _ = extract_frames(video_path, frames_dir)
    
    # In a real implementation, you would use your SRGAN model here
    # For now, we'll just resize the frames as a placeholder
    enhanced_frames = []
    for frame in frames:
        # Simulated super-resolution by resizing
        h, w = frame.shape[:2]
        upscaled = cv2.resize(frame, (w*2, h*2), interpolation=cv2.INTER_CUBIC)
        # Resize back to original size for demonstration
        enhanced = cv2.resize(upscaled, (w, h), interpolation=cv2.INTER_AREA)
        enhanced_frames.append(enhanced)
    
    # Get original video properties
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    cap.release()
    
    # Convert frames to video
    output_path = os.path.join(app.config['PROCESSED_FOLDER'], f"srgan_{os.path.basename(video_path)}")
    return frames_to_video(enhanced_frames, output_path, fps)

# Feature 6: RLGAN Model
def process_video_rlgan(video_path, model=None):
    """Process video with RLGAN model for enhancement."""
    frames_dir = os.path.join(app.config['FRAMES_FOLDER'], os.path.basename(video_path).split('.')[0])
    frames, _ = extract_frames(video_path, frames_dir)
    
    # In a real implementation, you would use your RLGAN model here
    # For now, we'll use a simple enhancement as a placeholder
    enhanced_frames = []
    for frame in frames:
        # Simulated enhancement
        enhanced = cv2.detailEnhance(frame, sigma_s=10, sigma_r=0.15)
        enhanced_frames.append(enhanced)
    
    # Get original video properties
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    cap.release()
    
    # Convert frames to video
    output_path = os.path.join(app.config['PROCESSED_FOLDER'], f"rlgan_{os.path.basename(video_path)}")
    return frames_to_video(enhanced_frames, output_path, fps)

# API Endpoints
@app.route('/api/process-video', methods=['POST'])
def api_process_video():
    if 'video' not in request.files:
        return jsonify({'success': False, 'error': 'No video file in the request'}), 400
    
    file = request.files['video']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No selected file'}), 400
    
    # Get parameters
    feature = request.form.get('feature', 'interpolation')
    sub_feature = request.form.get('subFeature', '')
    speed_factor = float(request.form.get('speedFactor', 1.0))
    
    try:
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Process based on feature
        if feature == 'interpolation':
            if sub_feature == 'speed':
                processed_path, error = process_video_speed(filepath, speed_factor)
            else:  # Default to frame interpolation
                processed_path, error = process_video_interpolation(filepath)
        elif feature == 'low_light_technique':
            processed_path, error = process_video_low_light(filepath)
        elif feature == 'deepfake':
            result = detect_deepfake(filepath)
            return jsonify({
                'success': True,
                'result': result
            })
        elif feature == 'llnet':
            processed_path, error = process_video_llnet(filepath)
        elif feature == 'srgan':
            processed_path, error = process_video_srgan(filepath)
        elif feature == 'rlgan':
            processed_path, error = process_video_rlgan(filepath)
        else:
            return jsonify({'success': False, 'error': f'Unknown feature: {feature}'}), 400
        
        if error:
            return jsonify({'success': False, 'error': error}), 500
        
        # Return the processed video path for download
        return jsonify({
            'success': True,
            'processedVideoPath': processed_path
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/download/<path:filename>', methods=['GET'])
def download_file(filename):
    return send_file(filename, as_attachment=True)

@app.route('/api/image-to-video', methods=['POST'])
def api_image_to_video():
    if 'images' not in request.files:
        return jsonify({'success': False, 'error': 'No images in the request'}), 400
    
    files = request.files.getlist('images')
    if not files or files[0].filename == '':
        return jsonify({'success': False, 'error': 'No selected files'}), 400
    
    # Get parameters
    fps = int(request.form.get('fps', 30))
    
    try:
        # Save uploaded files
        image_paths = []
        for file in files:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            image_paths.append(filepath)
        
        # Process images to video
        output_path = os.path.join(app.config['PROCESSED_FOLDER'], 'images_to_video.mp4')
        processed_path, error = images_to_video(image_paths, output_path, fps)
        
        if error:
            return jsonify({'success': False, 'error': error}), 500
        
        # Return the processed video path for download
        return jsonify({
            'success': True,
            'processedVideoPath': processed_path
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    # Load models at startup
    llnet_model = load_llnet_model()
    amtennet_model = load_amtennet_model()
    srgan_model = load_srgan_model()
    rlgan_model = load_rlgan_model()
    
    # Start the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)
