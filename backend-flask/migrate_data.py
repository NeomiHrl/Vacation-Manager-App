import sqlite3
import mysql.connector
from env_config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
import os
from datetime import datetime

class DataMigration:
    def __init__(self):
        # חיבור ל-SQLite (מסד הנתונים הישן)
        self.sqlite_conn = None
        self.mysql_conn = None
        
    def connect_sqlite(self):
        """התחברות למסד הנתונים SQLite"""
        try:
            if os.path.exists("mydb.db"):
                self.sqlite_conn = sqlite3.connect("mydb.db")
                print("✅ Connected to SQLite database")
                return True
            else:
                print("❌ SQLite database file 'mydb.db' not found")
                return False
        except Exception as e:
            print(f"❌ Error connecting to SQLite: {e}")
            return False
    
    def connect_mysql(self):
        """התחברות למסד הנתונים MySQL"""
        try:
            self.mysql_conn = mysql.connector.connect(
                host=DB_HOST,
                port=DB_PORT,
                database=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD,
                charset='utf8mb4'
            )
            print("✅ Connected to MySQL database")
            return True
        except Exception as e:
            print(f"❌ Error connecting to MySQL: {e}")
            return False
    
    def check_sqlite_tables(self):
        """בדיקה אילו טבלאות קיימות ב-SQLite"""
        try:
            cursor = self.sqlite_conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = cursor.fetchall()
            
            available_tables = [table[0] for table in tables]
            print(f"📋 Tables found in SQLite: {available_tables}")
            return available_tables
        except Exception as e:
            print(f"❌ Error checking SQLite tables: {e}")
            return []
    
    def migrate_roles(self):
        """העברת נתוני טבלת roles"""
        try:
            print("\n📤 Migrating roles...")
            
            # קריאת נתונים מ-SQLite
            sqlite_cursor = self.sqlite_conn.cursor()
            sqlite_cursor.execute("SELECT * FROM roles")
            roles_data = sqlite_cursor.fetchall()
            
            if not roles_data:
                print("ℹ️ No roles data to migrate")
                return True
            
            # הכנסת נתונים ל-MySQL
            mysql_cursor = self.mysql_conn.cursor()
            
            for role in roles_data:
                try:
                    mysql_cursor.execute(
                        "INSERT INTO roles (role_id, name) VALUES (%s, %s) "
                        "ON DUPLICATE KEY UPDATE name = VALUES(name)",
                        (role[0], role[1])
                    )
                except mysql.connector.IntegrityError:
                    # אם הרשומה כבר קיימת
                    pass
            
            self.mysql_conn.commit()
            print(f"✅ Migrated {len(roles_data)} roles")
            return True
            
        except Exception as e:
            print(f"❌ Error migrating roles: {e}")
            return False
    
    def migrate_countries(self):
        """העברת נתוני טבלת countries"""
        try:
            print("\n📤 Migrating countries...")
            
            sqlite_cursor = self.sqlite_conn.cursor()
            sqlite_cursor.execute("SELECT * FROM countries")
            countries_data = sqlite_cursor.fetchall()
            
            if not countries_data:
                print("ℹ️ No countries data to migrate")
                return True
            
            mysql_cursor = self.mysql_conn.cursor()
            
            for country in countries_data:
                try:
                    mysql_cursor.execute(
                        "INSERT INTO countries (country_id, name) VALUES (%s, %s) "
                        "ON DUPLICATE KEY UPDATE name = VALUES(name)",
                        (country[0], country[1])
                    )
                except mysql.connector.IntegrityError:
                    pass
            
            self.mysql_conn.commit()
            print(f"✅ Migrated {len(countries_data)} countries")
            return True
            
        except Exception as e:
            print(f"❌ Error migrating countries: {e}")
            return False
    
    def migrate_users(self):
        """העברת נתוני טבלת users"""
        try:
            print("\n📤 Migrating users...")
            
            sqlite_cursor = self.sqlite_conn.cursor()
            sqlite_cursor.execute("SELECT * FROM users")
            users_data = sqlite_cursor.fetchall()
            
            if not users_data:
                print("ℹ️ No users data to migrate")
                return True
            
            mysql_cursor = self.mysql_conn.cursor()
            
            for user in users_data:
                try:
                    mysql_cursor.execute(
                        "INSERT INTO users (user_id, first_name, last_name, email, password, role_id) "
                        "VALUES (%s, %s, %s, %s, %s, %s) "
                        "ON DUPLICATE KEY UPDATE "
                        "first_name = VALUES(first_name), "
                        "last_name = VALUES(last_name), "
                        "email = VALUES(email), "
                        "password = VALUES(password), "
                        "role_id = VALUES(role_id)",
                        (user[0], user[1], user[2], user[3], user[4], user[5])
                    )
                except mysql.connector.IntegrityError:
                    pass
            
            self.mysql_conn.commit()
            print(f"✅ Migrated {len(users_data)} users")
            return True
            
        except Exception as e:
            print(f"❌ Error migrating users: {e}")
            return False
    
    def migrate_vacations(self):
        """העברת נתוני טבלת vacations"""
        try:
            print("\n📤 Migrating vacations...")
            
            sqlite_cursor = self.sqlite_conn.cursor()
            sqlite_cursor.execute("SELECT * FROM vacations")
            vacations_data = sqlite_cursor.fetchall()
            
            if not vacations_data:
                print("ℹ️ No vacations data to migrate")
                return True
            
            mysql_cursor = self.mysql_conn.cursor()
            
            for vacation in vacations_data:
                try:
                    mysql_cursor.execute(
                        "INSERT INTO vacations (vacation_id, country_id, description, start_date, finish_day, price, image_filename) "
                        "VALUES (%s, %s, %s, %s, %s, %s, %s) "
                        "ON DUPLICATE KEY UPDATE "
                        "country_id = VALUES(country_id), "
                        "description = VALUES(description), "
                        "start_date = VALUES(start_date), "
                        "finish_day = VALUES(finish_day), "
                        "price = VALUES(price), "
                        "image_filename = VALUES(image_filename)",
                        (vacation[0], vacation[1], vacation[2], vacation[3], vacation[4], vacation[5], vacation[6])
                    )
                except mysql.connector.IntegrityError:
                    pass
            
            self.mysql_conn.commit()
            print(f"✅ Migrated {len(vacations_data)} vacations")
            return True
            
        except Exception as e:
            print(f"❌ Error migrating vacations: {e}")
            return False
    
    def migrate_likes(self):
        """העברת נתוני טבלת likes"""
        try:
            print("\n📤 Migrating likes...")
            
            sqlite_cursor = self.sqlite_conn.cursor()
            sqlite_cursor.execute("SELECT * FROM likes")
            likes_data = sqlite_cursor.fetchall()
            
            if not likes_data:
                print("ℹ️ No likes data to migrate")
                return True
            
            mysql_cursor = self.mysql_conn.cursor()
            
            for like in likes_data:
                try:
                    mysql_cursor.execute(
                        "INSERT INTO likes (user_id, vacation_id) VALUES (%s, %s) "
                        "ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)",
                        (like[0], like[1])
                    )
                except mysql.connector.IntegrityError:
                    pass
            
            self.mysql_conn.commit()
            print(f"✅ Migrated {len(likes_data)} likes")
            return True
            
        except Exception as e:
            print(f"❌ Error migrating likes: {e}")
            return False
    
    def verify_migration(self):
        """וידוא שההעברה הצליחה"""
        print("\n🔍 Verifying migration...")
        
        try:
            mysql_cursor = self.mysql_conn.cursor()
            
            # ספירת רשומות בכל טבלה
            tables = ['roles', 'countries', 'users', 'vacations', 'likes']
            
            for table in tables:
                mysql_cursor.execute(f"SELECT COUNT(*) FROM {table}")
                mysql_count = mysql_cursor.fetchone()[0]
                
                sqlite_cursor = self.sqlite_conn.cursor()
                try:
                    sqlite_cursor.execute(f"SELECT COUNT(*) FROM {table}")
                    sqlite_count = sqlite_cursor.fetchone()[0]
                except:
                    sqlite_count = 0
                
                print(f"📊 {table}: SQLite={sqlite_count}, MySQL={mysql_count}")
            
            print("\n✅ Migration verification completed!")
            
        except Exception as e:
            print(f"❌ Error during verification: {e}")
    
    def run_migration(self):
        """הרצת כל תהליך ההעברה"""
        print("🚀 Starting data migration from SQLite to MySQL")
        print("=" * 50)
        
        # התחברות למסדי הנתונים
        if not self.connect_sqlite():
            return False
        
        if not self.connect_mysql():
            return False
        
        # בדיקת טבלאות קיימות
        available_tables = self.check_sqlite_tables()
        
        # העברת נתונים לפי סדר (בגלל Foreign Keys)
        success = True
        
        if 'roles' in available_tables:
            success &= self.migrate_roles()
        
        if 'countries' in available_tables:
            success &= self.migrate_countries()
        
        if 'users' in available_tables:
            success &= self.migrate_users()
        
        if 'vacations' in available_tables:
            success &= self.migrate_vacations()
        
        if 'likes' in available_tables:
            success &= self.migrate_likes()
        
        # וידוא הצלחה
        if success:
            self.verify_migration()
            print("\n🎉 Data migration completed successfully!")
        else:
            print("\n❌ Migration completed with errors")
        
        # סגירת חיבורים
        if self.sqlite_conn:
            self.sqlite_conn.close()
        if self.mysql_conn:
            self.mysql_conn.close()
        
        return success

def main():
    """פונקציה ראשית"""
    migration = DataMigration()
    migration.run_migration()

if __name__ == "__main__":
    main()