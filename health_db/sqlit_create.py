import sqlite3

conn = sqlite3.connect('health_record.db')

cursor = conn.cursor()


cursor.execute("INSERT INTO health_records (ID, PASSWORD, AGE, WEIGHT, BLOOD_TYPE, ALLERGIES, SURGERIES, OTHER, STATUS)  VALUES (01, 'yoyoy', 51, 62.1, '0+', 'suing it up', 'not in mood', '1', 0)")

conn.commit()
conn.close()
