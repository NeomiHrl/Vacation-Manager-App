import mysql.connector
from env_config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

class Users:
    @staticmethod
    def get_db_connection():
        return mysql.connector.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            charset='utf8mb4'
        )
   
# יצירת טבלת משתמשים
    @staticmethod
    def create_table():
        with Users.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''CREATE TABLE IF NOT EXISTS users (
                    user_id INT AUTO_INCREMENT PRIMARY KEY,
                    first_name VARCHAR(100) NOT NULL,
                    last_name VARCHAR(100) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    role_id INT NOT NULL,
                    FOREIGN KEY (role_id) REFERENCES roles(role_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'''
            cursor.execute(sql)
            cursor.close()

# הוספת משתמש
    @staticmethod
    def create(first_name,last_name,email,password,role_id):
        with Users.get_db_connection() as connection:
            cursor=connection.cursor()
            cursor.execute('''
            INSERT INTO users (first_name,last_name,email,password,role_id) VALUES(%s,%s,%s,%s,%s)
            ''',(first_name,last_name,email,password,role_id))
            user_id=cursor.lastrowid
            connection.commit()
            cursor.close()
            return{
                'user_id':user_id,
                'first_name':first_name,
                'last_name':last_name,
                'email':email,
                'password':password,
                'role_id':role_id
            }   

# החזרת כל המשתמשים
    @staticmethod 
    def get_all():
        with Users.get_db_connection() as connection:
            cursor=connection.cursor()
            cursor.execute('SELECT * FROM users')
            users=cursor.fetchall()
            cursor.close()
            return[
                dict(user_id=user[0],
                first_name=user[1],
                last_name=user[2],
                email=user[3],
                role_id=user[5])for user in users
            ]

# החזרת משתמש לפי ID  
    @staticmethod
    def get_by_id(user_id):
        with Users.get_db_connection() as connection:
            cursor=connection.cursor()
            cursor.execute('SELECT * FROM users WHERE user_id=%s',(user_id,))
            user=cursor.fetchone()
            cursor.close()
            if user:
                return[
                    dict(user_id=user[0],
                first_name=user[1],
                last_name=user[2],
                email=user[3],
                role_id=user[5])
                ]
            return None

# כניסת משתמש למערכת לפי מייל וסיסמה   
    @staticmethod
    def login(email,password):
        with Users.get_db_connection() as connection:
            cursor=connection.cursor()
            cursor.execute('SELECT * FROM users WHERE email=%s AND password=%s',(email,password))
            user=cursor.fetchone()
            cursor.close()
            if user:
                return[
                    dict(user_id=user[0],
                first_name=user[1],
                last_name=user[2],
                email=user[3],
                password=user[4],
                role_id=user[5])
                ]
            return None

    # כניסת משתמש למערכת לפי מייל בלבד (לבדיקת סיסמה מוצפנת בקונטרולר)
    @staticmethod
    def get_user_by_email(email):
        with Users.get_db_connection() as connection:
            cursor = connection.cursor()
            cursor.execute('SELECT * FROM users WHERE email=%s', (email,))
            user = cursor.fetchone()
            cursor.close()
            if user:
                return {
                    'user_id': user[0],
                    'first_name': user[1],
                    'last_name': user[2],
                    'email': user[3],
                    'password': user[4],  # סיסמה מוצפנת
                    'role_id': user[5]
                }
            return None

# עדכון משתמש
    @staticmethod
    def update_user(user_id, first_name, last_name, email, password, role_id):
        with Users.get_db_connection() as connection:
            cursor = connection.cursor()
            cursor.execute('''
                UPDATE users
                SET first_name = %s, last_name = %s, email = %s, password = %s, role_id = %s
                WHERE user_id = %s
            ''', (first_name, last_name, email, password, role_id, user_id))
            connection.commit()
            cursor.close()
            return {'message': 'User updated successfully'}
            
# מחיקת משתמש
    @staticmethod
    def delete(user_id):
        with Users.get_db_connection() as connection:
            cursor=connection.cursor()
            cursor.execute('SELECT * FROM users WHERE user_id=%s',(user_id,))
            if not cursor.fetchone():
                cursor.close()
                return None
            sql='DELETE FROM users WHERE user_id=%s'
            cursor.execute(sql,(user_id,))
            connection.commit()
            cursor.close()
            return{'message':f"user {user_id} row deleted successfully"}




