import mysql.connector
from env_config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
from datetime import datetime

class AdminStats:

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

    @staticmethod
    def get_vacation_stats():
        """
        החזרת סטטיסטיקות חופשות: עבר, הווה, עתיד
        Returns: {"past_vacations": 12, "on_going_vacations": 7, "future_vacations": 15}
        """
        try:
            with AdminStats.get_db_connection() as connection:
                cursor = connection.cursor()
                
                current_date = datetime.now().date()

                # חופשות שהסתיימו (finish_day < today)
                cursor.execute("SELECT COUNT(*) FROM vacations WHERE finish_day < %s", (current_date,))
                past_vacations = cursor.fetchone()[0]

                # חופשות פעילות (start_date <= today <= finish_day)
                cursor.execute("SELECT COUNT(*) FROM vacations WHERE start_date <= %s AND finish_day >= %s",
                             (current_date, current_date))
                on_going_vacations = cursor.fetchone()[0]
                
                # חופשות עתידיות (start_date > today)
                cursor.execute("SELECT COUNT(*) FROM vacations WHERE start_date > %s", (current_date,))
                future_vacations = cursor.fetchone()[0]
                
                cursor.close()
                
                return {
                    "past_vacations": past_vacations,
                    "on_going_vacations": on_going_vacations,
                    "future_vacations": future_vacations
                }
                
        except Exception as e:
            print(f"Error getting vacation stats: {e}")
            return None

    @staticmethod
    def get_users_stats():
        """
        החזרת מספר המשתמשים במערכת
        Returns: {"total_users": 37, "admin_users": X, "regular_users": Y}
        """
        try:
            with AdminStats.get_db_connection() as connection:
                cursor = connection.cursor(dictionary=True)

                cursor.execute("SELECT COUNT(*) AS total_users FROM users")
                total = cursor.fetchone()["total_users"]

                cursor.execute("SELECT COUNT(*) AS admin_users FROM users WHERE role_id=1")
                admins = cursor.fetchone()["admin_users"]

                cursor.execute("SELECT COUNT(*) AS regular_users FROM users WHERE role_id=2")
                regulars = cursor.fetchone()["regular_users"]

                cursor.close()

                return {
                    "total_users": total, 
                    "admin_users": admins,
                    "regular_users": regulars
                }

        except Exception as e:
            print(f"Error getting users stats: {e}")
            return None

    @staticmethod
    def get_likes_stats():
        """
        החזרת מספר הלייקים במערכת
        Returns: {"total_likes": 84}
        """
        try:
            with AdminStats.get_db_connection() as connection:
                cursor = connection.cursor()
                cursor.execute("SELECT COUNT(*) FROM likes")
                total_likes = cursor.fetchone()[0]
                cursor.close()
                
                return {"total_likes": total_likes}
                
        except Exception as e:
            print(f"Error getting likes stats: {e}")
            return None

    @staticmethod
    def get_likes_distribution():
        """
        החזרת התפלגות לייקים לפי שמות מדינות
        Returns: [{"destination": "Italy", "likes": 3}, {"destination": "France", "likes": 8}]
        """
        try:
            with AdminStats.get_db_connection() as connection:
                cursor = connection.cursor()
                
                sql = '''
                SELECT c.name, COUNT(l.vacation_id) as likes_count
                FROM vacations v
                LEFT JOIN likes l ON v.vacation_id = l.vacation_id
                LEFT JOIN countries c ON v.country_id = c.country_id
                GROUP BY c.country_id, c.name
                ORDER BY likes_count DESC
                '''
            
                cursor.execute(sql)
                results = cursor.fetchall()
                cursor.close()
                
                likes_distribution = []
                for row in results:
                    likes_distribution.append({
                        "destination": row[0],  # שם המדינה מטבלת countries
                        "likes": row[1]         # מספר הלייקים
                    })
            
            return likes_distribution
            
        except Exception as e:
            print(f"Error getting likes distribution: {e}")
            return None