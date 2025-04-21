import cv2
import numpy as np
import matplotlib
# Set the backend to Agg before importing pyplot
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from io import BytesIO

def plot_histogram(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    hist = cv2.calcHist([gray], [0], None, [256], [0, 256])

    # Create figure without using pyplot's state machine
    fig = plt.figure(figsize=(8, 5))
    ax = fig.add_subplot(111)
    ax.plot(hist, color='black')
    ax.set_title("Grayscale Histogram", fontsize=14)
    ax.set_xlabel("Pixel Intensity", fontsize=12)
    ax.set_ylabel("Frequency", fontsize=12)
    ax.grid(True, linestyle='--', alpha=0.7)
    ax.set_xlim([0, 256])

    buffer = BytesIO()
    fig.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
    buffer.seek(0)
    plt.close(fig)  # Explicitly close the figure to free memory

    return buffer

def histogram_stretching(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    min_val = np.min(gray)
    max_val = np.max(gray)
    stretched = (gray - min_val) * (255.0 / (max_val - min_val))
    stretched = np.clip(stretched, 0, 255).astype(np.uint8)
    return cv2.cvtColor(stretched, cv2.COLOR_GRAY2BGR)

def histogram_equalization(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    equalized = cv2.equalizeHist(gray)
    return cv2.cvtColor(equalized, cv2.COLOR_GRAY2BGR)

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
    
    return cv2.cvtColor(img_back.astype(np.uint8), cv2.COLOR_GRAY2BGR)