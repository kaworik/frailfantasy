import cv2
import random
import tkinter as tk
from tkinter import filedialog
from PIL import Image, ImageTk, ImageDraw
import threading
import time

# --- Константы ---
A3_WIDTH, A3_HEIGHT = 3508, 2480  # формат A3 в пикселях (300dpi)
CAPTURE_INTERVAL = 5  # каждые 5 секунд

class PhotoCollageApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Webcam A3 Collage")

        # Холст А3
        self.canvas_image = Image.new("RGB", (A3_WIDTH, A3_HEIGHT), "white")
        self.canvas_draw = ImageDraw.Draw(self.canvas_image)

        self.tk_image = ImageTk.PhotoImage(self.canvas_image)
        self.label = tk.Label(root, image=self.tk_image)
        self.label.pack()

        # Кнопки
        self.btn_frame = tk.Frame(root)
        self.btn_frame.pack()
        self.start_btn = tk.Button(self.btn_frame, text="Start", command=self.start)
        self.start_btn.pack(side="left")
        self.stop_btn = tk.Button(self.btn_frame, text="Stop", command=self.stop)
        self.stop_btn.pack(side="left")
        self.export_btn = tk.Button(self.btn_frame, text="Export", command=self.export)
        self.export_btn.pack(side="left")

        # Камера
        self.cap = cv2.VideoCapture(0)

        # Состояния
        self.running = False
        self.photos = []  # [(x, y, w, h, PIL_image), ...]

    def start(self):
        if not self.running:
            self.running = True
            threading.Thread(target=self.capture_loop, daemon=True).start()

    def stop(self):
        self.running = False

    def capture_loop(self):
        while self.running:
            ret, frame = self.cap.read()
            if ret:
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                img = Image.fromarray(frame)

                # Случайный размер
                w = random.randint(200, 400)
                h = int(w * img.height / img.width)
                img = img.resize((w, h))

                # Найти позицию без пересечений
                pos = self.find_position(w, h)
                if pos is None:
                    # Нет места → уменьшаем композицию
                    self.scale_down()
                    pos = self.find_position(w, h)

                # Добавляем фото
                if pos:
                    x, y = pos
                    self.photos.append((x, y, w, h, img))
                    self.redraw()

            time.sleep(CAPTURE_INTERVAL)

    def find_position(self, w, h):
        """Находит свободное место для картинки."""
        for _ in range(500):  # 500 попыток
            x = random.randint(0, A3_WIDTH - w)
            y = random.randint(0, A3_HEIGHT - h)
            rect = (x, y, x + w, y + h)
            if all(not self.overlaps(rect, (px, py, px + pw, py + ph)) for px, py, pw, ph, _ in self.photos):
                return (x, y)
        return None

    def overlaps(self, r1, r2):
        """Проверяет пересечение двух прямоугольников."""
        return not (r1[2] <= r2[0] or r1[0] >= r2[2] or r1[3] <= r2[1] or r1[1] >= r2[3])

    def scale_down(self):
        """Пропорционально уменьшает всю композицию, если не хватает места."""
        scale = 0.8
        new_photos = []
        for x, y, w, h, img in self.photos:
            nw, nh = int(w * scale), int(h * scale)
            nx, ny = int(x * scale), int(y * scale)
            new_photos.append((nx, ny, nw, nh, img.resize((nw, nh))))
        self.photos = new_photos
        self.redraw()

    def redraw(self):
        """Перерисовать холст."""
        self.canvas_image = Image.new("RGB", (A3_WIDTH, A3_HEIGHT), "white")
        for x, y, w, h, img in self.photos:
            self.canvas_image.paste(img, (x, y))
        self.tk_image = ImageTk.PhotoImage(self.canvas_image)
        self.label.config(image=self.tk_image)
        self.label.image = self.tk_image

    def export(self):
        """Сохраняет результат в файл."""
        file_path = filedialog.asksaveasfilename(defaultextension=".png",
                                                 filetypes=[("PNG files", "*.png"), ("JPEG files", "*.jpg")])
        if file_path:
            self.canvas_image.save(file_path)

    def __del__(self):
        if self.cap.isOpened():
            self.cap.release()

if __name__ == "__main__":
    root = tk.Tk()
    app = PhotoCollageApp(root)
    root.mainloop()
