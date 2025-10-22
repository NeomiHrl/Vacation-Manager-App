from flask import Flask
from models.country_model import Countries
from models.likes_model import Likes
from models.role_model import Roles
from models.user_model import Users
from models.vacation_model import Vacations
from routes.role_route import role_bp
from routes.user_route import auth_bp
from routes.country_route import country_bp
from routes.vacations_route import vacation_bp
from routes.likes_route import like_bp
from routes.admin_stats_route import admin_stats_bp
from flask_cors import CORS


app=Flask(__name__)
app.static_folder = 'uploads'
app.add_url_rule('/uploads/<path:filename>', endpoint='uploads', view_func=app.send_static_file)
CORS(app)

app.register_blueprint(role_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(country_bp)
app.register_blueprint(vacation_bp)
app.register_blueprint(like_bp)
app.register_blueprint(admin_stats_bp)


# יצירת טבלאות 

# Roles.create_table()
# Countries.create_table()
# Users.create_table()
# Vacations.create_table()
# Likes.create_table()



if __name__=='__main__':
    app.run(debug=True,host='0.0.0.0',port=5000)

