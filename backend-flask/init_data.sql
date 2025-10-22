CREATE TABLE IF NOT EXISTS roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE IF NOT EXISTS countries (
  country_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS vacations (
  vacation_id INT AUTO_INCREMENT PRIMARY KEY,
  country_id INT NOT NULL,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  finish_day DATE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_filename VARCHAR(255) NOT NULL,
  FOREIGN KEY (country_id) REFERENCES countries(country_id)
);

CREATE TABLE IF NOT EXISTS likes (
  user_id INT NOT NULL,
  vacation_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (vacation_id) REFERENCES vacations(vacation_id)
);

-- עכשיו אפשר להכניס נתונים
INSERT INTO roles (role_id, name) VALUES
  (1, 'admin'),
  (2, 'user')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO users (user_id, first_name, last_name, email, password, role_id) VALUES
  (1, 'Admin', 'User', 'admin@email.com', 'scrypt:32768:8:1$mPaIVOL0QIhNF7cr$4b84d04326b987078e48ad97dcc03ea46270018699b63c8997c061ca5c3f315a9a617900499d7052c509566035913b323b25cb57df81fc6d9c7f186913adebd5', 1),
  (2, 'John', 'Doe', 'john@email.com', 'scrypt:32768:8:1$FlBMq747LBbLIipI$78ded10303fe787af94b7ed9729d312df7e439e307d51a74c75cfc2717dc7035654bfa8ea79f7dba6faa697817ba5a206256ee7846699d377305a58b1ee4db38', 2)
ON DUPLICATE KEY UPDATE first_name=VALUES(first_name), last_name=VALUES(last_name), email=VALUES(email), password=VALUES(password), role_id=VALUES(role_id);

INSERT INTO countries (country_id, name) VALUES
  (1, 'Israel'),
  (2, 'France'),
  (3, 'United States'),  
  (4, 'Germany'),
  (5, 'Japan'),
  (6, 'Brazil'),
  (7, 'Canada'),
  (8, 'Australia'),
  (9, 'Thailand'),
  (10, 'India')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO vacations (vacation_id, country_id, description, start_date, finish_day, price, image_filename) VALUES
  (1, 2, 'Visit the Eiffel Tower', '2026-07-01', '2026-07-10', 1200, 'paris_art_fashion.jpg'),
  (2, 1, 'Relax on the beaches', '2025-08-15', '2025-08-20', 800, 'dead_sea.jpg'),
  (3, 3, 'Explore Times Square', '2026-09-05', '2026-09-15', 1500, 'United_states_adventure.jpg'),
  (4, 4, 'Discover Berlin''s History', '2026-10-01', '2026-10-10', 1100, 'germany_culture.jpg'),
  (5, 5, 'Experience Tokyo''s Culture', '2026-11-01', '2026-11-10', 1300, 'tokyo_streets.jpg'),
  (6, 6, 'Enjoy Rio Carnival', '2026-02-20', '2026-02-28', 1400, 'brazil_carnival.jpg'),
  (7, 7, 'Explore Canadian Rockies', '2026-06-01', '2026-06-10', 1250, 'canada_nature.jpg'),
  (8, 8, 'Discover Sydney Opera House', '2026-12-01', '2026-12-10', 1350, 'australia_safari.jpg'),
  (9, 9, 'Relax in Phuket', '2026-03-15', '2026-03-25', 900, 'thailand_exotic.jpg'),
  (10, 10, 'Experience Indian Culture', '2026-04-10', '2026-04-20', 1150, 'india_colors.jpg'),
  (2, 2, 'Wine Tasting in Paris', '2026-05-01', '2026-05-10', 1250, 'romantic_paris.jpg'),
  (1, 1, 'Historical Sites of Jerusalem', '2026-06-15', '2026-06-25', 950, 'israel_journey.jpg')
ON DUPLICATE KEY UPDATE
  country_id=VALUES(country_id),
  description=VALUES(description),
  start_date=VALUES(start_date),
  finish_day=VALUES(finish_day),
  price=VALUES(price),
  image_filename=VALUES(image_filename);

INSERT INTO likes (user_id, vacation_id) VALUES
  (1, 1),
  (2, 3),
  (2, 5),
  (1, 3)
ON DUPLICATE KEY UPDATE user_id=VALUES(user_id), vacation_id=VALUES(vacation_id);

