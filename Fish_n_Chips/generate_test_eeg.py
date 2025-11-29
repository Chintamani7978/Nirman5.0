"""
Generate a sample EEG CSV file for testing
Creates 4 seconds of synthetic EEG data (16 channels, 256 Hz)
"""
import numpy as np
import csv

# Parameters
sampling_rate = 256  # Hz
duration = 4  # seconds
n_channels = 16
n_samples = sampling_rate * duration  # 1024 samples

# Channel names (standard 10-20 system)
channel_names = ['Fp1', 'Fp2', 'F3', 'F4', 'C3', 'C4', 'P3', 'P4',
                 'O1', 'O2', 'F7', 'F8', 'T3', 'T4', 'T5', 'T6']

# Generate synthetic EEG data
# Real EEG is typically in the range of -100 to +100 microvolts
# We'll generate realistic-looking signals with multiple frequency components
np.random.seed(42)  # For reproducibility

eeg_data = []
time = np.linspace(0, duration, n_samples)

for i in range(n_samples):
    sample = []
    for ch in range(n_channels):
        # Mix of different frequency bands (delta, theta, alpha, beta)
        delta = 20 * np.sin(2 * np.pi * 2 * time[i] + ch * 0.5)  # 2 Hz
        theta = 15 * np.sin(2 * np.pi * 6 * time[i] + ch * 0.3)  # 6 Hz
        alpha = 25 * np.sin(2 * np.pi * 10 * time[i] + ch * 0.2)  # 10 Hz (dominant)
        beta = 10 * np.sin(2 * np.pi * 20 * time[i] + ch * 0.1)  # 20 Hz
        noise = np.random.normal(0, 5)  # Background noise

        # Combine all components
        signal = delta + theta + alpha + beta + noise
        sample.append(round(signal, 2))

    eeg_data.append(sample)

# Save to CSV
output_file = 'sample_eeg_test.csv'
with open(output_file, 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(channel_names)  # Header
    writer.writerows(eeg_data)

print(f"✅ Generated {output_file}")
print(f"   - Channels: {n_channels}")
print(f"   - Samples: {n_samples} ({duration} seconds at {sampling_rate} Hz)")
print(f"   - File size: ~{len(eeg_data) * len(eeg_data[0]) * 6 / 1024:.1f} KB")
print(f"\nYou can now upload this file to test the EEG analysis!")
