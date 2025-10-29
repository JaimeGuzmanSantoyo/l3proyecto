import pymysql    # ibreria para la manipulación y conexion de mysql a python 
from flask import Flask, request 
from twilio.rest import Client## se hace esto ya que se usar twilio para albergar el chat 

from twilio.twiml.messaging_response import MessagingResponse

app = Flask(__name__)

# Conexión a MySQL
conexion = pymysql.connect(
    user='root',       ## se indican los campos de las caracteristicas de la base de datos ,donde estan almacenadas las respuestas 
    password='zeus0401',
    host='localhost',
    database='chatbot',
    port=3308
)

if conexion.open:
    print("Conexión exitosa")     ## lineas de codigo para probar si la base de datos cargo o no cargo correctamente 
else:
    print("Algo falló :C")

cursor = conexion.cursor()  ## esta linea se requiere para la manipulacion por medio dee los select para la bd 

@app.route("/whatsapp", methods=["POST"])
def whatsapp():
    # Crear respuesta Twilio
    resp = MessagingResponse()

    # Mostrar menú al usuario
    menu = (
        "Menu de Atención:\n"
        "1 - Horarios de atención\n"
        "2 - Documentos para la constancia\n"      ## en este caso es el menu que se desea mostrar al usuario 
        "3 - Ubicación de la oficina de Recursos Humanos\n"
        "4 - Contacto"
    )
    resp.message(menu)   ## resp.message es para mostrar el mensaje en el telefono ,originalmente se uso un print ,pero eso es a nivel pc

    # Leer mensaje del usuario
    msg = request.form.get("Body", "").strip()   ## aqui se almacena el numero que termine tecleando el usuario ,y se almacena en la variable msg
    try:
        x = int(msg)    ## msg se transforma a int y se almacena en la variable X
    except ValueError:
        resp.message("Por favor ingresa un número del 1 al 4")     ##se aplica un mensaje de error para llevar un control ,lo que se hace es tirar un excepcion
        return str(resp)
                                                                            ## partiendo de ello se tira un resp.message  se tira el mensaje de error ,que paraa este caso es  "Por favor ingresa un número del 1 al 4"
    # Consultar la base de datos
    cursor.execute("SELECT respuesta FROM fac WHERE id = %s", (x,))   ## se indica de donde es el from de la tabla de la bd ,con que queremos que se compara x 
    fila = cursor.fetchone()

    if fila:                                             ## la logica es que se compare el valor numerico ingresado por el usuario y se compare con el Id de la bd 
        resp.message(fila[0])  
    else: 
        resp.message("No hay coincidencia numérica")     ## SI NO coiciden el numero ingresado con el id de la bd ,se entrega esta respuesta

    return str(resp)

if __name__ == "__main__":
    app.run(port=5000, debug=True)          ## se indica el puerto para usarlo posteriormete por ngrok
