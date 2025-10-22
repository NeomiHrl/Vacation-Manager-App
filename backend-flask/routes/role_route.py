from flask import Blueprint,jsonify
from controllers.role_controller import RoleController

role_bp=Blueprint('role',__name__)

@role_bp.route('/roles',methods=['POST'])
def create_role():
    return RoleController.create_role()
    
@role_bp.route('/roles', methods=['GET'])
def get_all_roles():
    return RoleController.get_all_roles()

@role_bp.route('/roles/<int:role_id>', methods=['GET'])
def get_role_by_id(role_id):
    return RoleController.get_role_by_id(role_id)
    
