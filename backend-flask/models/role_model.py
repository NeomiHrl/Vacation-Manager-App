import mysql.connector
from env_config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
import os

class Roles:

    @staticmethod
    def get_db_connection():
        return mysql.connector.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )

    @staticmethod
    def create_table():
        with Roles.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = '''CREATE TABLE IF NOT EXISTS roles (
                    role_id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'''
            cursor.execute(sql)
            cursor.close()

    @staticmethod
    def create(name):
        with Roles.get_db_connection() as connection:
            cursor = connection.cursor()
            cursor.execute('SELECT * FROM roles WHERE name=%s', (name,))
            is_exist = cursor.fetchone()
            if is_exist:
                return None
            cursor.execute("INSERT INTO roles(name) VALUES(%s)", (name,))
            role_id = cursor.lastrowid
            connection.commit()
            cursor.close()
            return {
                'role_id': role_id,
                'name': name
            }

    @staticmethod
    def get_all():
        with Roles.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = 'SELECT * FROM roles'
            cursor.execute(sql)
            roles = cursor.fetchall()
            cursor.close()
            return [dict(role_id=role[0], name=role[1]) for role in roles]

    @staticmethod
    def get_by_id(id):
        with Roles.get_db_connection() as connection:
            cursor = connection.cursor()
            sql = 'SELECT * FROM roles WHERE role_id=%s'
            cursor.execute(sql, (id,))
            role = cursor.fetchone()
            if role:
                cursor.close()
                return [dict(role_id=role[0], name=role[1])]
            return None