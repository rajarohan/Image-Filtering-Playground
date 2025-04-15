# backend/filters.py
import cv2
import numpy as np

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