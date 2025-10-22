from flask import Blueprint, request, jsonify
from controllers.admin_stats_controller import AdminStatsController
from auth_decorator import require_admin

admin_stats_bp = Blueprint('admin_stats', __name__)

# Route לביצוע Login ע"י אימייל וסיסמה - רק אדמין יכול להיכנס
@admin_stats_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    return AdminStatsController.admin_login(data)

# Route לביצוע Logout מהמערכת
@admin_stats_bp.route('/admin/logout', methods=['POST'])
@require_admin
def admin_logout():
    return AdminStatsController.admin_logout()

# Route להחזרת סטטיסטיקות חופשות (עבר, הווה, עתיד)
@admin_stats_bp.route('/admin/stats/vacations', methods=['GET'])
@require_admin
def get_vacation_stats():
    return AdminStatsController.get_vacation_stats()

# Route להחזרת מספר המשתמשים במערכת
@admin_stats_bp.route('/admin/stats/users', methods=['GET'])
@require_admin
def get_users_stats():
    return AdminStatsController.get_users_stats()

# Route להחזרת מספר הלייקים במערכת
@admin_stats_bp.route('/admin/stats/likes', methods=['GET'])
@require_admin
def get_likes_stats():
    return AdminStatsController.get_likes_stats()

# Route להחזרת התפלגות לייקים לפי יעדי חופשות
@admin_stats_bp.route('/admin/stats/likes-distribution', methods=['GET'])
@require_admin
def get_likes_distribution():
    return AdminStatsController.get_likes_distribution()