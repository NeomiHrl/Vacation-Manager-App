from flask import Blueprint,jsonify,request
from controllers.likes_controller import LikesController
from auth_decorator import require_auth, require_admin

like_bp=Blueprint('like',__name__)


# ראוט לייק שמקבל vacation_id מה-body ומזהה user_id מתוך הטוקן
@like_bp.route('/likes', methods=['POST'])
@require_auth
def add_like():
    data = request.get_json()
    vacation_id = data.get('vacation_id')
    user_id = request.user_info.get('user_id')
    return LikesController.add_like(user_id, vacation_id)
    
@like_bp.route('/likes',methods=['GET'])
def get_all_likes():
    return LikesController.get_all_likes()

@like_bp.route('/likes/names',methods=['GET'])
def get_all_likes_with_names():
    return LikesController.get_all_likes_with_names()


# ראוט אנלייק שמזהה את המשתמש מתוך הטוקן ומקבל vacation_id מה-URL
@like_bp.route('/likes/<int:vacation_id>', methods=['DELETE'])
@require_auth
def delete_like(vacation_id):
    user_id = request.user_info.get('user_id')
    return LikesController.remove_like(user_id, vacation_id)

@like_bp.route('/likes/count/<int:vacation_id>', methods=['GET'])
def get_likes_count(vacation_id):
    return LikesController.get_likes_count(vacation_id)
