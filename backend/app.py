from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
from io import BytesIO
import json

app = Flask(__name__)
CORS(app)

@app.route('/apply-filter', methods=['POST'])
def apply_image_filter():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
        
    file = request.files['image']
    filter_type = request.form.get('filter', 'gaussian')
    params = json.loads(request.form.get('params', '{}'))
    
    try:
        # Read image file
        img_array = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        
        # Process image
        if filter_type == 'gaussian':
            ksize = int(params.get('ksize', 5))
            sigma = float(params.get('sigma', 1.5))
            processed_img = cv2.GaussianBlur(img, (ksize, ksize), sigma)
        elif filter_type == 'median':
            ksize = int(params.get('ksize', 5))
            processed_img = cv2.medianBlur(img, ksize)
        elif filter_type == 'laplacian':
            processed_img = cv2.Laplacian(img, cv2.CV_8U)
        elif filter_type == 'fft':
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            dft = np.fft.fft2(gray)
            dft_shift = np.fft.fftshift(dft)
            magnitude_spectrum = 20 * np.log(np.abs(dft_shift))
            processed_img = cv2.normalize(magnitude_spectrum, None, 0, 255, cv2.NORM_MINMAX, cv2.CV_8U)
        else:
            processed_img = img
        
        # Convert to PNG and send back
        _, buffer = cv2.imencode('.png', processed_img)
        return send_file(
            BytesIO(buffer),
            mimetype='image/png'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/histogram', methods=['POST'])
def generate_histogram():
    file = request.files['image']
    img_array = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    buffer = plot_histogram(img)
    return send_file(buffer, mimetype='image/png')

@app.route('/stretch-histogram', methods=['POST'])
def stretch_histogram():
    file = request.files['image']
    img_array = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    stretched = histogram_stretching(img)
    _, buffer = cv2.imencode('.png', stretched)
    return send_file(BytesIO(buffer), mimetype='image/png')

@app.route('/equalize-histogram', methods=['POST'])
def equalize_histogram():
    file = request.files['image']
    img_array = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    equalized = histogram_equalization(img)
    _, buffer = cv2.imencode('.png', equalized)
    return send_file(BytesIO(buffer), mimetype='image/png')
if __name__ == '__main__':
    app.run(debug=True, port=5000)