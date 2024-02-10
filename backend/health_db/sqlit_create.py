import sqlite3

conn = sqlite3.connect('health_record.db')

cursor = conn.cursor()

cursor.execute("CREATE TABLE health_records (ID VARCHAR(32), NAME VARCHAR(128), PASSWORD VARCHAR(60), AGE INT, WEIGHT FLOAT, HEIGHT FLOAT, BLOOD_TYPE VARCHAR(8), ALLERGIES VARCHAR(1024), SURGERIES VARCHAR(1024), OTHER VARCHAR(512), STATUS INT8);")
# cursor.execute("INSERT INTO health_records (ID, PASSWORD, AGE, WEIGHT, HEIGHT, BLOOD_TYPE, ALLERGIES, SURGERIES, OTHER, STATUS)  VALUES (01, 'yoyoy', 51, 62.1, 164, '0+', 'suing it up', 'not in mood', '1', 0);")

conn.commit()
conn.close()
