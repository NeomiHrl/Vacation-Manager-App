from flask import Blueprint,jsonify,request
from controllers.country_controller import CountryController

country_bp=Blueprint('country',__name__)

@country_bp.route('/countries',methods=['POST'])
def create_country():
    return CountryController.create_country()
    
@country_bp.route('/countries',methods=['GET'])
def get_all_countries():
    return CountryController.get_all_countries()

@country_bp.route('/countries/<int:country_id>',methods=['GET'])
def get_country_by_id(country_id):
    return CountryController.get_country_by_id(country_id)

@country_bp.route('/countries/<int:country_id>',methods=['DELETE'])
def delete_country(country_id):
    return CountryController.delete_country(country_id)

@country_bp.route('/countries/<int:country_id>',methods=['PUT'])
def update_country(country_id):
    return CountryController.update_country(country_id)