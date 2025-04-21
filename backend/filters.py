# backend/filters.py
import cv2
import numpy as np
import matplotlib.pyplot as plt
from io import BytesIO
import base64

def plot_histogram(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    hist = cv2.calcHist([gray], [0], None, [256], [0, 256])

    plt.figure(figsize=(6, 4))
    plt.plot(hist, color='gray')
    plt.title("Histogram")
    plt.xlabel("Pixel value")
    plt.ylabel("Frequency")
    plt.grid(True)

    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plt.close()

    return buffer

def histogram_stretching(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    min_val = np.min(gray)
    max_val = np.max(gray)
    stretched = (gray - min_val) * (255.0 / (max_val - min_val))
    stretched = np.clip(stretched, 0, 255).astype(np.uint8)
    return stretched

def histogram_equalization(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    equalized = cv2.equalizeHist(gray)
    return equalized
def apply_filter(img, filter_type, params):
    if filter_type == 'gaussian':
        ksize = params.get('ksize', 5)
        sigma = params.get('sigma', 1.5)
        return cv2.GaussianBlur(img, (ksize, ksize), sigma)
    
    elif filter_type == 'median':
        ksize = params.get('ksize', 5)
        return cv2.medianBlur(img, ksize)
    
    elif filter_type == 'laplacian':
        return cv2.Laplacian(img, cv2.CV_64F)
    
    elif filter_type == 'fft':
        # Implement FFT processing
        return process_fft(img, params)
    
    return img

def process_fft(img, params):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    dft = np.fft.fft2(gray)
    dft_shift = np.fft.fftshift(dft)
    magnitude_spectrum = 20 * np.log(np.abs(dft_shift))
    return magnitude_spectrum

# Add to backend/filters.py
def apply_frequency_filter(img, filter_type, cutoff):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    rows, cols = gray.shape
    crow, ccol = rows // 2, cols // 2
    
    # FFT processing
    dft = np.fft.fft2(gray)
    dft_shift = np.fft.fftshift(dft)
    
    # Create mask
    mask = np.zeros((rows, cols), np.uint8)
    if filter_type == 'lowpass':
        mask = cv2.circle(mask, (ccol, crow), cutoff, 1, -1)
    elif filter_type == 'highpass':
        mask = cv2.circle(mask, (ccol, crow), cutoff, 1, -1)
        mask = 1 - mask
    
    # Apply mask and inverse FFT
    fshift = dft_shift * mask
    f_ishift = np.fft.ifftshift(fshift)
    img_back = np.fft.ifft2(f_ishift)
    img_back = np.abs(img_back)
    
    return img_back