from models.user_model import Users
from flask import jsonify, request
import re
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
import mysql.connector


class UserController:

    @staticmethod
    def create_jwt_token(user_data):
        """Create JWT token for user"""
        try:
            # Get secret key from environment or use default
            secret_key = 'your_super_secret_key_here_change_in_production_12345'
            
            # Token payload
            payload = {
                'user_id': user_data['user_id'],
                'email': user_data['email'],
                'role_id': user_data['role_id'],
                'exp': datetime.utcnow() + timedelta(minutes=60),  # 60 minutes expiration
                'iat': datetime.utcnow()
            }
            
            # Create token
            token = jwt.encode(payload, secret_key, algorithm='HS256')
            return token
        except Exception as e:
            print(f"Error creating JWT token: {e}")
            return None

    @staticmethod
    def verify_jwt_token(token):
        """Verify JWT token and return payload"""
        try:
            secret_key = 'your_super_secret_key_here_change_in_production_12345'
            payload = jwt.decode(token, secret_key, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None  # Token expired
        except jwt.InvalidTokenError:
            return None  # Invalid token
        except Exception as e:
            print(f"Error verifying JWT token: {e}")
            return None

    @staticmethod
    def create_user(data):
        required_fields = ['first_name', 'last_name', 'email', 'password']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        first_name = data['first_name']
        last_name = data['last_name']
        email = data['email']
        password = data['password']
        role_id = data.get('role_id', 2)  # Default to regular user

        # Check for empty fields
        if not all([first_name.strip(), last_name.strip(), email.strip(), password.strip()]):
            return jsonify({'error': 'All fields are required'}), 400

        # Validate email format
        email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if not re.match(email_pattern, email):
            return jsonify({'error': 'Invalid email format'}), 400
       
        if len(password) < 4:
            return jsonify({'error': 'Password must be at least 4 characters'}), 400
        
        existing_user = Users.get_user_by_email(email)
        if existing_user:
            return jsonify({'error': 'Email already exists'}), 409

        # Hash the password before saving
        hashed_password = generate_password_hash(password)

        try:
            new_user = Users.create(first_name, last_name, email, hashed_password, role_id)
            # Don't return the hashed password in response
            return jsonify({
                'message': 'User created successfully!',
                'user_id': new_user['user_id'],
                'first_name': new_user['first_name'],
                'last_name': new_user['last_name'],
                'email': new_user['email'],
                'role_id': new_user['role_id']
            }), 201
        except mysql.connector.IntegrityError as e:
            if 'Duplicate entry' in str(e):
                return jsonify({'error': 'Email already exists'}), 409
            return jsonify({'error': 'Database integrity error'}), 400
        except mysql.connector.Error as e:
            return jsonify({'error': f'Database error: {str(e)}'}), 500
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def login_user(data):
        if not all(k in data for k in ('email', 'password')):
            return jsonify({'error': 'Missing email or password'}), 400

        email = data['email']
        password = data['password']

        if not email.strip() or not password.strip():
            return jsonify({'error': 'Email and password are required'}), 400

        user = Users.get_user_by_email(email)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Check password using werkzeug's check_password_hash
        if not check_password_hash(user['password'], password):
            return jsonify({'error': 'Incorrect password'}), 401

        # Create JWT token for the logged-in user
        token = UserController.create_jwt_token(user)
        if token:
            return jsonify({
                'message': 'Login successful!',
                'user_id': user['user_id'],
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'email': user['email'],
                'role_id': user['role_id'],
                'token': token
            }), 200
        else:
            return jsonify({'error': 'Failed to create JWT token'}), 500

    @staticmethod
    def get_all_users():
        try:
            users = Users.get_all()
            return jsonify({'users': users}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def get_user_by_id(user_id):
        try:
            user = Users.get_by_id(user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 404
            return jsonify(user), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def delete_user(user_id):
        try:
            # בדוק תחילה אם המשתמש קיים
            user = Users.get_by_id(user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            # מחק תחילה את כל הלייקים של המשתמש
            connection = mysql.connector.connect(
                host='localhost',
                port=3306,
                database='vacations_db',
                user='root',
                password='123456'
            )
            
            cursor = connection.cursor()
            
            # מחק לייקים של המשתמש
            cursor.execute('DELETE FROM likes WHERE user_id = %s', (user_id,))
            deleted_likes = cursor.rowcount
            
            # עכשיו מחק את המשתמש
            cursor.execute('DELETE FROM users WHERE user_id = %s', (user_id,))
            connection.commit()
            
            cursor.close()
            connection.close()
            
            return jsonify({
                'message': 'User deleted successfully!',
                'deleted_likes': deleted_likes,
                'info': f'Also deleted {deleted_likes} likes by this user'
            }), 200
            
        except mysql.connector.Error as e:
            return jsonify({'error': f'Database error: {str(e)}'}), 500
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def update_user(user_id):
        try:
            # בדוק תחילה אם המשתמש קיים
            user = Users.get_by_id(user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            data = request.get_json()
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            email = data.get('email')
            password = data.get('password')
            role_id = data.get('role_id')

            if not all([first_name, last_name, email, password, role_id]):
                return jsonify({'error': 'All fields are required.'}), 400

            email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
            if not re.match(email_pattern, email):
                return jsonify({'error': 'Invalid email format'}), 400

            # בדוק אם הסיסמה כבר מוצפנת (מתחילה ב-$pbkdf2)
            if not str(password).startswith('$pbkdf2'):  # werkzeug מוסיף $pbkdf2 ל-hash
                hashed_password = generate_password_hash(password)
            else:
                hashed_password = password

            result = Users.update_user(user_id, first_name, last_name, email, hashed_password, role_id)
            
            # בדוק אם העדכון השפיע על רשומות
            if result and hasattr(result, 'get') and result.get('affected_rows', 0) == 0:
                return jsonify({'error': 'User not found or no changes made'}), 404
                
            return jsonify({'message': 'User updated successfully!'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
