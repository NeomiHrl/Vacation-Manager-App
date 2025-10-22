from werkzeug.security import generate_password_hash

password_admin = '1234'
password_user = '2025'

hashed_admin = generate_password_hash(password_admin)
hashed_user = generate_password_hash(password_user)

print("hashed_admin:", hashed_admin)
print("hashed_user:", hashed_user)