from flask import Flask, jsonify, request
from models.country_model import Countries
import mysql.connector

class CountryController:
    @staticmethod
    def create_country():
        try:
            data = request.get_json()
            if not data or 'name' not in data:
                return jsonify({'error': 'name is required'}), 400
            
            name = data['name'].strip()
            if not name:
                return jsonify({'error': 'name cannot be empty'}), 400
                
            result = Countries.create(name)
            if result:
                return jsonify(result), 201
            return jsonify({'error': 'could not create country'}), 500
            
        except mysql.connector.IntegrityError as e:
            if 'Duplicate entry' in str(e):
                return jsonify({'error': 'Country already exists'}), 409
            return jsonify({'error': 'Database integrity error'}), 400
        except mysql.connector.Error as err:
            return jsonify({'error': f'Database error: {str(err)}'}), 500
        except Exception as e:
            return jsonify({'error': f'Server error: {str(e)}'}), 500
    
    @staticmethod
    def get_all_countries():
        try:
            countries = Countries.get_all()
            return jsonify({'countries': countries}), 200
        except mysql.connector.Error as err:
            return jsonify({'error': f'Database error: {str(err)}'}), 500
        except Exception as e:
            return jsonify({'error': f'Server error: {str(e)}'}), 500
    

    @staticmethod
    def get_country_by_id(id):
        try:
            country = Countries.get_by_id(id)
            if country is None:
                return jsonify({'error': 'Country not found'}), 404
            return jsonify({'country': country}), 200
        except mysql.connector.Error as err:
            return jsonify({'error': f'Database error: {str(err)}'}), 500
        except Exception as e:
            return jsonify({'error': f'Server error: {str(e)}'}), 500
    

    
    @staticmethod
    def delete_country(country_id):
        try:
            result = Countries.delete(country_id)
            if result is None:
                return jsonify({'error': 'Country not found'}), 404
            return jsonify(result), 200
        except mysql.connector.Error as err:
            return jsonify({'error': f'Database error: {str(err)}'}), 500
        except Exception as e:
            return jsonify({'error': f'Server error: {str(e)}'}), 500
    
    
    @staticmethod
    def update_country(country_id):
        try:
            data = request.get_json()
            if not data or 'name' not in data:
                return jsonify({'error': 'name is required'}), 400
                
            name = data['name'].strip()
            if not name:
                return jsonify({'error': 'name cannot be empty'}), 400
                
            result = Countries.update(country_id, name)
            if result is None:
                return jsonify({'error': 'Country not found'}), 404
            return jsonify(result), 200
            
        except mysql.connector.IntegrityError as e:
            if 'Duplicate entry' in str(e):
                return jsonify({'error': 'Country name already exists'}), 409
            return jsonify({'error': 'Database integrity error'}), 400
        except mysql.connector.Error as err:
            return jsonify({'error': f'Database error: {str(err)}'}), 500
        except Exception as e:
            return jsonify({'error': f'Server error: {str(e)}'}), 500
    
    
