from flask import Blueprint,jsonify,request
from controllers.vacations_controller import VacationController
from auth_decorator import require_auth, require_admin


vacation_bp=Blueprint('vacations',__name__)

@vacation_bp.route('/vacations',methods=['POST'])
@require_admin
def create_vacation():
    return VacationController.create_vacation()

@vacation_bp.route('/vacations',methods=['GET'])
def get_all_vacations():
    return VacationController.get_all_vacations()

@vacation_bp.route('/vacations/<int:vacation_id>',methods=['GET'])
def get_vacation_by_id(vacation_id):
    return VacationController.get_vacation_by_id(vacation_id)


@vacation_bp.route('/vacations/<int:vacation_id>',methods=['DELETE'])
@require_admin
def delete_vacation(vacation_id): 
    return VacationController.delete_vacation(vacation_id)

@vacation_bp.route('/vacations/<int:vacation_id>',methods=['PUT'])
@require_admin
def update_vacation(vacation_id):
    return VacationController.update_vacation(vacation_id)

@vacation_bp.route('/vacations/upload-image', methods=['POST'])
@require_admin
def upload_vacation_image():
    return VacationController.upload_image()