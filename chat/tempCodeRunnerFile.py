import pymysql

conexion = pymysql.connect(user ='root',password='zeus0401',
                                   host='localhost',database='chatbot',
                                   port=3308)

if conexion.open:
    print(" Conexión exitosa")
else:
    print("algo fallo :C")
cursor = conexion.cursor()
print ("menu"
       "1 horarios de atencion"
       "2documentos"
       "3ubicacion de x lugar"
       "4 contacto ") 
x = int (input ("ingresa un valor del 1 al 4 para seleccionar la pregunta: "))
if x==1:
    cursor.execute("SELECT respuesta FROM fac WHERE id = %s", (x,))
    fila = cursor.fetchone()
    if fila:
        print(fila[0])

elif x==2:
    cursor.execute("SELECT respuesta FROM fac WHERE id = %s", (x,))
    fila = cursor.fetchone()
    if fila:
        print(fila[0])
elif x==3:
    cursor.execute("SELECT respuesta FROM fac WHERE id = %s", (x,))
    fila = cursor.fetchone()
    if fila:
        print(fila[0])
elif x==4:
     cursor.execute("SELECT respuesta FROM fac WHERE id = %s", (x,))
     fila = cursor.fetchone()
     if fila:
        print(fila[0])
else:
    print("no hay un coincidencia numerica ")