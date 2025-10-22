from models.admin_stats_model import AdminStats
from models.user_model import Users
from flask import jsonify, request
from werkzeug.security import check_password_hash
import jwt
from datetime import datetime, timedelta
import mysql.connector

class AdminStatsController:

    @staticmethod
    def create_jwt_token(user_data):
        """Create JWT token for admin user"""
        try:
            secret_key = 'your_super_secret_key_here_change_in_production_12345'
            
            payload = {
                'user_id': user_data['user_id'],
                'email': user_data['email'],
                'role_id': user_data['role_id'],
                'exp': datetime.utcnow() + timedelta(hours=2),  # 2 hours for admin
                'iat': datetime.utcnow()
            }
            
            token = jwt.encode(payload, secret_key, algorithm='HS256')
            return token
        except Exception as e:
            print(f"Error creating JWT token: {e}")
            return None

    @staticmethod
    def verify_admin_token():
        """בדיקת טוקן אדמין"""
        token = request.headers.get('Authorization')
        if not token:
            return None, jsonify({'error': 'Authorization required'}), 401
        
        if token.startswith('Bearer '):
            token = token[7:]
        
        try:
            secret_key = 'your_super_secret_key_here_change_in_production_12345'
            payload = jwt.decode(token, secret_key, algorithms=['HS256'])
            
            if payload.get('role_id') != 1:
                return None, jsonify({'error': 'Admin privileges required'}), 403
            
            return payload, None, None
        except jwt.ExpiredSignatureError:
            return None, jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return None, jsonify({'error': 'Invalid token'}), 401
        except Exception as e:
            return None, jsonify({'error': 'Authorization failed'}), 401

    @staticmethod
    def admin_login(data):
        """
        Login לאדמין בלבד
        """
        try:
            if not all(k in data for k in ('email', 'password')):
                return jsonify({'error': 'Missing email or password'}), 400

            email = data['email']
            password = data['password']

            if not email.strip() or not password.strip():
                return jsonify({'error': 'Email and password are required'}), 400

            # בדיקת משתמש במסד נתונים
            user = Users.get_user_by_email(email)
            if not user:
                return jsonify({'error': 'Invalid credentials'}), 401

            # בדיקת סיסמה
            if not check_password_hash(user['password'], password):
                return jsonify({'error': 'Invalid credentials'}), 401

            # בדיקה שהמשתמש הוא אדמין (role_id = 1)
            if user['role_id'] != 1:
                return jsonify({'error': 'Access denied. Admin privileges required.'}), 403

            # יצירת token
            token = AdminStatsController.create_jwt_token(user)
            if token:
                return jsonify({
                    'message': 'Admin login successful!',
                    'user_id': user['user_id'],
                    'first_name': user['first_name'],
                    'last_name': user['last_name'],
                    'email': user['email'],
                    'role': 'Admin',
                    'token': token
                }), 200
            else:
                return jsonify({'error': 'Failed to create token'}), 500

        except mysql.connector.Error as e:
            return jsonify({'error': f'Database error: {str(e)}'}), 500
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def admin_logout():
        """
        Logout מהמערכת (עם בדיקת טוקן)
        """
        # בדוק טוקן תקין
        payload, error_response, status_code = AdminStatsController.verify_admin_token()
        if error_response:
            return error_response, status_code
        
        return jsonify({'message': 'Logout successful!'}), 200

    @staticmethod
    def get_vacation_stats():
        """
        החזרת סטטיסטיקות חופשות (עם בדיקת הרשאות)
        """
        # בדוק טוקן אדמין
        payload, error_response, status_code = AdminStatsController.verify_admin_token()
        if error_response:
            return error_response, status_code
        
        try:
            stats = AdminStats.get_vacation_stats()
            if stats:
                return jsonify(stats), 200
            else:
                return jsonify({'error': 'Failed to get vacation stats'}), 500
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def get_users_stats():
        """
        החזרת מספר המשתמשים במערכת (עם בדיקת הרשאות)
        """
        # בדוק טוקן אדמין
        payload, error_response, status_code = AdminStatsController.verify_admin_token()
        if error_response:
            return error_response, status_code
        
        try:
            stats = AdminStats.get_users_stats()
            if stats:
                return jsonify(stats), 200
            else:
                return jsonify({'error': 'Failed to get users stats'}), 500
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def get_likes_stats():
        """
        החזרת מספר הלייקים במערכת (עם בדיקת הרשאות)
        """
        # בדוק טוקן אדמין
        payload, error_response, status_code = AdminStatsController.verify_admin_token()
        if error_response:
            return error_response, status_code
        
        try:
            stats = AdminStats.get_likes_stats()
            if stats:
                return jsonify(stats), 200
            else:
                return jsonify({'error': 'Failed to get likes stats'}), 500
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @staticmethod
    def get_likes_distribution():
        """
        החזרת התפלגות לייקים לפי יעדי חופשות (עם בדיקת הרשאות)
        """
        # בדוק טוקן אדמין
        payload, error_response, status_code = AdminStatsController.verify_admin_token()
        if error_response:
            return error_response, status_code
        
        try:
            distribution = AdminStats.get_likes_distribution()
            if distribution is not None:
                return jsonify(distribution), 200
            else:
                return jsonify({'error': 'Failed to get likes distribution'}), 500
        except Exception as e:
            return jsonify({'error': str(e)}), 500