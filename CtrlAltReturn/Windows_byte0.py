import sys
from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                             QLabel, QComboBox, QPushButton, QProgressBar, 
                             QTextEdit, QMessageBox)
from PyQt6.QtCore import QTimer, Qt
from PyQt6.QtGui import QFont
class Phase1Window(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("BYTE-0 (Prototype)")
        self.resize(600, 500)
        self.setStyleSheet("""
            QMainWindow { background-color: #2b2b2b; color: #ffffff; }
            QLabel { color: #dddddd; font-size: 14px; font-family: Segoe UI; }
            QComboBox { padding: 6px; font-size: 14px; background-color: #3b3b3b; color: white; border: 1px solid #555; }
            QPushButton { background-color: #d32f2f; color: white; font-weight: bold; padding: 12px; border-radius: 4px; }
            QPushButton:hover { background-color: #b71c1c; }
            QTextEdit { background-color: #1e1e1e; color: #00ff00; font-family: Consolas; border: 1px solid #444; }
            QProgressBar { text-align: center; font-weight: bold; border: 1px solid #444; background-color: #1e1e1e; color: white; }
            QProgressBar::chunk { background-color: #d32f2f; }
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout(central_widget)
        layout.setSpacing(15)
        layout.setContentsMargins(20, 20, 20, 20)
        title = QLabel("BYTE-0: SECURE SANITIZATION")
        title.setStyleSheet("font-size: 22px; font-weight: bold; color: #ef5350;")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(title)
        layout.addWidget(QLabel("Target Drive:"))
        self.drive_combo = QComboBox()
        self.drive_combo.addItems(["Disk 1: Samsung Portable T5 (500GB)", "Disk 2: SanDisk Cruzer (32GB)"])
        layout.addWidget(self.drive_combo)
        self.btn_wipe = QPushButton("INITIATE ZERO-FILL PROTOCOL")
        self.btn_wipe.setCursor(Qt.CursorShape.PointingHandCursor)
        self.btn_wipe.clicked.connect(self.start_sim)
        layout.addWidget(self.btn_wipe)
        self.progress = QProgressBar()
        layout.addWidget(self.progress)
        layout.addWidget(QLabel("Operation Log:"))
        self.log_box = QTextEdit()
        self.log_box.setReadOnly(True)
        self.log_box.setText("System Initialized. Ready for input.")
        layout.addWidget(self.log_box)
        self.timer = QTimer()
        self.timer.timeout.connect(self.update_sim)
        self.sim_val = 0
    def start_sim(self):
        self.log_box.append("Scanning drive geometry...")
        self.log_box.append("Locking volume handles...")
        self.btn_wipe.setEnabled(False)
        self.sim_val = 0
        self.timer.start(50)
    def update_sim(self):
        self.sim_val += 1
        self.progress.setValue(self.sim_val)
        if self.sim_val % 20 == 0:
            self.log_box.append(f"Writing zeros... {self.sim_val}% complete.")
        if self.sim_val >= 100:
            self.timer.stop()
            self.log_box.append("WIPE COMPLETE. VERIFIED.")
            QMessageBox.information(self, "Success", "Drive Sanitized (Simulation).")
            self.btn_wipe.setEnabled(True)
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = Phase1Window()
    window.show()
    sys.exit(app.exec())
