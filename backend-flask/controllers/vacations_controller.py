from models.vacation_model import Vacations
from flask import Flask, jsonify, request
from datetime import datetime
import os
from werkzeug.utils import secure_filename


class VacationController:

    @staticmethod
    def create_vacation():
        data = request.get_json()
        fields = ['country_id', 'description', 'start_date', 'finish_day', 'price', 'image_filename']
        for key in fields:
            if key not in data:
                return jsonify({'error': 'some field not found'}), 400
        if data['price'] < 0 or data['price'] > 10000:
            return jsonify({'error': 'price must be between 0 to 10000'}), 400
        start_date = datetime.strptime(data['start_date'], "%Y-%m-%d")
        finish_day = datetime.strptime(data['finish_day'], "%Y-%m-%d")
        if start_date > finish_day:
            return jsonify({'error': 'finish_day must be later than start_date'}), 400
        today = datetime.today()
        if start_date < today:
            return jsonify({'error': 'the date cant be past'}), 400
        result = Vacations.create(
            country_id=data['country_id'],
            description=data['description'],
            start_date=data['start_date'],
            finish_day=data['finish_day'],
            price=data['price'],
            image_filename=data['image_filename']
        )
        return jsonify(result), 201

    @staticmethod
    def get_all_vacations():
        vacations = Vacations.get_all()
        return jsonify(vacations)

    @staticmethod
    def get_vacation_by_id(vacation_id):
        vacation = Vacations.get_by_id(vacation_id)
        if vacation is None:
            return jsonify({'error': 'vacation not found'})
        return jsonify(vacation)

    @staticmethod
    def update_vacation(vacation_id):
        try:
            data = request.get_json()
            country_id = data.get('country_id')
            description = data.get('description')
            start_date = data.get('start_date')
            finish_day = data.get('finish_day')
            price = data.get('price')
            image_filename = data.get('image_filename', '')
            old_image_filename = data.get('old_image_filename')  # ← הוסף את השורה הזו!

            if not all([country_id, description, start_date, finish_day, price]):
                return jsonify({'error': 'All fields except image_filename are required.'}), 400

            try:
                price = float(price)
            except ValueError:
                return jsonify({'error': 'Price must be a number.'}), 400

            if price < 0 or price > 10000:
                return jsonify({'error': 'Price must be between 0 and 10,000.'}), 400

            try:
                start_dt = datetime.strptime(start_date, "%Y-%m-%d")
                end_dt = datetime.strptime(finish_day, "%Y-%m-%d")
                if end_dt.date() < start_dt.date():
                    return jsonify({'error': 'End date cannot be earlier than start date'}), 400
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

            current = Vacations.get_by_id(vacation_id)
            old_filename = None
            if isinstance(current, list) and current:
                old_filename = current[0].get('image_filename')

            result = Vacations.update(vacation_id, country_id, description, start_date, finish_day, price, image_filename)

            # מחיקת תמונה ישנה אם התמונה התעדקנה
            try:
                if image_filename and old_filename and image_filename != old_filename:
                    project_root = os.path.dirname(os.path.dirname(__file__))  # vacations-project
                    images_dir = os.path.join(project_root, 'uploads', 'VacationsImages')
                    old_path = os.path.join(images_dir, old_filename)
                    if os.path.exists(old_path):
                        os.remove(old_path)
            except Exception:
                pass

            # מחק תמונה ישנה אם נשלחה
            try:
                if old_image_filename and old_image_filename.strip():
                    project_root = os.path.dirname(os.path.dirname(__file__))
                    images_dir = os.path.join(project_root, 'uploads', 'VacationsImages')
                    old_path = os.path.join(images_dir, old_image_filename)
                    if os.path.exists(old_path):
                        os.remove(old_path)
                        print(f"🔥 Deleted old image: {old_image_filename}")
                    else:
                        print(f"🔥 Old image not found: {old_path}")
            except Exception as e:
                print(f"🔥 Error deleting old image: {e}")
                # לא נחזיר שגיאה כי העדכון הצליח
                pass

            return jsonify(result), 200 if 'error' not in result else 400

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def delete_vacation(vacation_id):
        # שליפת החופשה מהמסד
        current = Vacations.get_by_id(vacation_id)
        if not current or (isinstance(current, list) and not current):
            return jsonify({"error": "Vacation not found"}), 404

        # שליפת שם קובץ התמונה
        image_filename = None
        if isinstance(current, list) and current:
            image_filename = current[0].get('image_filename')
        elif isinstance(current, dict):
            image_filename = current.get('image_filename')

        if image_filename:
            project_root = os.path.dirname(os.path.dirname(__file__))  # vacations-project
            images_dir = os.path.join(project_root, 'uploads', 'VacationsImages')
            image_path = os.path.join(images_dir, image_filename)
            if os.path.exists(image_path):
                try:
                    os.remove(image_path)
                except Exception as e:
                    print(f"Failed to delete image: {e}")

        Vacations.delete(vacation_id)
        return jsonify({"message": "Vacation deleted"}), 200

    @staticmethod
    def upload_image():
        try:
            if 'image' not in request.files:
                return jsonify({'error': 'No file part named image'}), 400
            file = request.files['image']
            if file.filename == '':
                return jsonify({'error': 'No selected file'}), 400

            filename = secure_filename(file.filename)

            allowed_ext = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
            _, ext = os.path.splitext(filename)
            if ext.lower() not in allowed_ext:
                return jsonify({'error': 'Invalid file type'}), 400

            project_root = os.path.dirname(os.path.dirname(__file__))  # vacations-project
            images_dir = os.path.join(project_root, 'uploads', 'VacationsImages')
            os.makedirs(images_dir, exist_ok=True)
            save_path = os.path.join(images_dir, filename)
            counter = 1
            base, extension = os.path.splitext(filename)
            while os.path.exists(save_path):
                filename = f"{base}_{counter}{extension}"
                save_path = os.path.join(images_dir, filename)
                counter += 1

            file.save(save_path)

            return jsonify({'filename': filename}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500