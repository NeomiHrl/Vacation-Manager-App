from flask import Blueprint,request,jsonify
from controllers.user_controller import UserController
from auth_decorator import require_auth, require_admin


auth_bp = Blueprint('auth',__name__)

@auth_bp.route('/users',methods=['POST'])
def create_user():
    data = request.get_json()
    return UserController.create_user(data)

@auth_bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    return UserController.login_user(data)

@auth_bp.route('/users',methods=['GET'])
@require_admin
def get_all_users():
    return UserController.get_all_users()

@auth_bp.route('/users/<int:user_id>',methods=['GET'])
@require_admin
def get_user_by_id(user_id):
    return UserController.get_user_by_id(user_id)

@auth_bp.route('/users/<int:user_id>',methods=['DELETE'])
@require_admin
def delete_user(user_id):
    return UserController.delete_user(user_id)

@auth_bp.route('/users/<int:user_id>',methods=['PUT'])
@require_admin
def update_user(user_id):
    return UserController.update_user(user_id)

@auth_bp.route('/auth/check', methods=['GET'])
@require_auth
def check_token():
    return jsonify({"ok": True})


