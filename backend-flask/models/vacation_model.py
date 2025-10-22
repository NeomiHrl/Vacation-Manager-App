import mysql.connector
from env_config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

class Vacations:
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

# יצירת טבלת חופשות
    @staticmethod
    def create_table():
        with Vacations.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''CREATE TABLE IF NOT EXISTS vacations (
                    vacation_id INT AUTO_INCREMENT PRIMARY KEY,
                    country_id INT NOT NULL,
                    description TEXT NOT NULL,
                    start_date DATE NOT NULL,
                    finish_day DATE NOT NULL,
                    price DECIMAL(10,2) NOT NULL,
                    image_filename VARCHAR(255) NOT NULL,
                    FOREIGN KEY (country_id) REFERENCES countries(country_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'''
            cursor.execute(sql)
            cursor.close()
# הוספת חופשה   
    @staticmethod
    def create(country_id,description,start_date,finish_day,price,image_filename):
        with Vacations.get_db_connection() as connection:
            cursor=connection.cursor()
            cursor.execute('''
            INSERT INTO vacations (country_id,description,start_date,finish_day,price,image_filename) 
            VALUES(%s,%s,%s,%s,%s,%s)
            ''',(country_id,description,start_date,finish_day,price,image_filename))
            vacation_id=cursor.lastrowid
            connection.commit()
            cursor.close()
            return{
                'vacation_id':vacation_id,
                'country_id':country_id,               
                'description':description,
                'start_date':start_date,
                'finish_day':finish_day,
                'price':price,
                'image_filename':image_filename
            }  
            
# החזרת כלל החופשות עם JOIN לשם העיר
    @staticmethod 
    def get_all():
        with Vacations.get_db_connection() as connection:
            cursor = connection.cursor()
            cursor.execute('''
                SELECT v.vacation_id, v.country_id, v.description, v.start_date, v.finish_day, v.price, v.image_filename, c.name
                FROM vacations v
                JOIN countries c ON v.country_id = c.country_id
                ORDER BY v.start_date ASC
            ''')
            vacations = cursor.fetchall()
            cursor.close()
            return [
                dict(
                    vacation_id=vacation[0],
                    country_id=vacation[1],
                    description=vacation[2],
                    start_date=vacation[3],
                    finish_day=vacation[4],
                    price=vacation[5],
                    image_filename=vacation[6],
                    name=vacation[7]  # שם העיר
                ) for vacation in vacations
            ]

# החזרת חופשה לפי הID עם JOIN לשם העיר
    @staticmethod
    def get_by_id(vacation_id):
        with Vacations.get_db_connection() as connection:
            cursor = connection.cursor()
            cursor.execute('''
                SELECT v.vacation_id, v.country_id, v.description, v.start_date, v.finish_day, v.price, v.image_filename, c.name
                FROM vacations v
                JOIN countries c ON v.country_id = c.country_id
                WHERE v.vacation_id = %s
            ''', (vacation_id,))
            vacation = cursor.fetchone()
            cursor.close()
            if vacation:
                return [
                    dict(
                        vacation_id=vacation[0],
                        country_id=vacation[1],
                        description=vacation[2],
                        start_date=vacation[3],
                        finish_day=vacation[4],
                        price=vacation[5],
                        image_filename=vacation[6],
                        name=vacation[7]  # שם העיר
                    )
                ]
            return None

# עדכון חופשה   
    @staticmethod
    def update(vacation_id, country_id, description, start_date, finish_day, price, image_filename):
        with Vacations.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''
                UPDATE vacations
                SET country_id = %s, description = %s, start_date = %s, finish_day = %s, price = %s, image_filename = %s
                WHERE vacation_id = %s
            '''
            cursor.execute(sql, (country_id, description, start_date, finish_day, price, image_filename, vacation_id))
            connection.commit()
            cursor.close()
            return {'message': 'Vacation updated successfully'}

# מחיקת חופשה 
    @staticmethod
    def delete(vacation_id):
        with Vacations.get_db_connection() as connection:
            cursor=connection.cursor()
            cursor.execute('SELECT * FROM vacations WHERE vacation_id=%s',(vacation_id,))
            if not cursor.fetchone():
                cursor.close()
                return None
            cursor.execute('DELETE FROM likes WHERE vacation_id = %s', (vacation_id,))
            cursor.execute('DELETE FROM vacations WHERE vacation_id = %s', (vacation_id,))
            connection.commit()
            cursor.close()
            return{'message':f"vacation {vacation_id} deleted successfully"}