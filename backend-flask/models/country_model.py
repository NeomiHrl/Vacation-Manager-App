import mysql.connector
from env_config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

class Countries:
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

# יצירת טבלת מדינות
    @staticmethod
    def create_table():
        with Countries.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''CREATE TABLE IF NOT EXISTS countries (
                    country_id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL UNIQUE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'''
            cursor.execute(sql)
            cursor.close()

# הוספת מדינה חדשה
    @staticmethod
    def create(name):
        with Countries.get_db_connection() as connection:
            cursor=connection.cursor()
            cursor.execute('''
            INSERT INTO countries (name) VALUES(%s)
            ''',(name,))
            country_id=cursor.lastrowid
            connection.commit()
            cursor.close()
            return{
                'country_id':country_id,
                'name':name,
            }

# החזרת כל המדינות
    @staticmethod 
    def get_all():
        with Countries.get_db_connection() as connection:
            cursor=connection.cursor()
            cursor.execute('SELECT * FROM countries ORDER BY name')
            countries=cursor.fetchall()
            cursor.close()
            return[
                dict(country_id=country[0],
                name=country[1]
                )for country in countries
            ]

# החזרת מדינה לפי ID
    @staticmethod
    def get_by_id(country_id):
        with Countries.get_db_connection() as connection:
            cursor=connection.cursor()
            cursor.execute('SELECT * FROM countries WHERE country_id=%s',(country_id,))
            country=cursor.fetchone()
            cursor.close()
            if country:
                return[
                    dict(country_id=country[0],
                name=country[1])
                ]
            return None

# עדכון מדינה
    @staticmethod
    def update(country_id,name):
        with Countries.get_db_connection() as connection:
            cursor=connection.cursor()
            cursor.execute('SELECT * FROM countries WHERE country_id=%s',(country_id,))
            if not cursor.fetchone():
                cursor.close()
                return None
            sql="UPDATE countries SET name=%s WHERE country_id=%s"
            cursor.execute(sql,(name,country_id))
            connection.commit()
            cursor.close()
            return {'message':f"country {country_id} updated successfully"}

# מחיקת מדינה מהטבלה
    @staticmethod
    def delete(country_id):
        with Countries.get_db_connection() as connection:
            cursor=connection.cursor()
            cursor.execute('SELECT * FROM countries WHERE country_id=%s',(country_id,))
            if not cursor.fetchone():
                cursor.close()
                return None
            sql='DELETE FROM countries WHERE country_id=%s'
            cursor.execute(sql,(country_id,))
            connection.commit()
            cursor.close()
            return{'message':f"country {country_id} deleted successfully"}
