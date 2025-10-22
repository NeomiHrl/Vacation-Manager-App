import mysql.connector
from env_config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

class Likes:
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

# יצירת טבלת לייקים
    @staticmethod
    def create_table():
        with Likes.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''CREATE TABLE IF NOT EXISTS likes (
                    user_id INT NOT NULL,
                    vacation_id INT NOT NULL,
                    PRIMARY KEY (user_id, vacation_id),
                    FOREIGN KEY (user_id) REFERENCES users(user_id),
                    FOREIGN KEY (vacation_id) REFERENCES vacations(vacation_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'''
            cursor.execute(sql)
            cursor.close()


# -Like הוספת לייק
    @staticmethod
    def create(user_id,vacation_id):
        with Likes.get_db_connection() as connection:
            cursor=connection.cursor()
            cursor.execute('''
            INSERT INTO likes (user_id,vacation_id) VALUES(%s,%s)
            ''',(user_id,vacation_id))
            connection.commit()
            cursor.close()
            return{
                'user_id':user_id,
                'vacation_id':vacation_id,
            }
# החזרת כל הלייקים 
    @staticmethod 
    def get_all():
        with Likes.get_db_connection() as connection:
            cursor=connection.cursor()
            cursor.execute('SELECT * FROM likes')
            likes=cursor.fetchall()
            cursor.close()
            return[
                dict(user_id=like[0],
                vacation_id=like[1]
                )for like in likes
            ]


# החזרת כל הלייקים עם שמות
    @staticmethod
    def get_all_likes():
        with Likes.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''
            SELECT likes.user_id, users.first_name, likes.vacation_id, vacations.description
            FROM likes
            JOIN users ON likes.user_id = users.user_id
            JOIN vacations ON likes.vacation_id = vacations.vacation_id
            '''
            cursor.execute(sql)
            likes = cursor.fetchall()
            cursor.close()
        result = []
        for like in likes:
            result.append({
                'user_id': like[0],
                'username': like[1],
                'vacation_id': like[2],
                'vacation_description': like[3]
            })

        return result

# הסרת ליק-Unlike
    @staticmethod
    def delete(user_id,vacation_id):
        with Likes.get_db_connection() as connection:
            cursor=connection.cursor()
            cursor.execute('SELECT * FROM likes WHERE user_id=%s AND vacation_id=%s',(user_id,vacation_id))
            if not cursor.fetchone():
                cursor.close()
                return None
            sql='DELETE FROM likes WHERE user_id=%s AND vacation_id=%s'
            cursor.execute(sql,(user_id,vacation_id))
            connection.commit()
            cursor.close()
            return{'message': f"Like by user {user_id} for vacation {vacation_id} deleted successfully"}

    
    @staticmethod
    def get_likes_count_by_vacation(vacation_id):
        with Likes.get_db_connection() as connection:
            cursor = connection.cursor()
            cursor.execute("SELECT COUNT(*) FROM likes WHERE vacation_id = %s", (vacation_id,))
            count = cursor.fetchone()[0]
            cursor.close()
            return count
