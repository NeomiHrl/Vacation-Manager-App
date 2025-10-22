from flask import Flask, jsonify, request
from models.role_model import Roles
import mysql.connector

class RoleController:
    @staticmethod
    def create_role():
        try:
            data = request.get_json()
            if not data or 'name' not in data:
                return jsonify({'error': 'name is required'}), 400
            
            result = Roles.create(data['name'])
            if result:
                return jsonify(result), 201
            return jsonify({'error': 'role already exists'}), 409
            
        except mysql.connector.Error as err:
            return jsonify({'error': f'Database error: {str(err)}'}), 500
        except Exception as e:
            return jsonify({'error': f'Server error: {str(e)}'}), 500

    @staticmethod
    def get_all_roles():
        try:
            roles = Roles.get_all()
            return jsonify({'roles': roles}), 200
        except mysql.connector.Error as err:
            return jsonify({'error': f'Database error: {str(err)}'}), 500
        except Exception as e:
            return jsonify({'error': f'Server error: {str(e)}'}), 500
    

    @staticmethod
    def get_role_by_id(id):
        try:
            role = Roles.get_by_id(id)
            if role is None:
                return jsonify({'error': 'role not found'}), 404
            return jsonify({'role': role}), 200
        except mysql.connector.Error as err:
            return jsonify({'error': f'Database error: {str(err)}'}), 500
        except Exception as e:
            return jsonify({'error': f'Server error: {str(e)}'}), 500
    



    
