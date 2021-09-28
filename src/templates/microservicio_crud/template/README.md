![enter image description here](https://www.bmv.com.mx/docs-pub/GESTOR/IMAGENES_EMISORAS/32873.jpg)

<%= micro_nombre %>
==========


<strong>Autor:</strong> <%=usuario_nombre%><br>
<strong>Email:</strong> [<%=usuario_email%>](<%=usuario_email%>)<br>
<strong>Fecha:</strong> <%=fecha%><br>


## Descripción
<%= micro_descripcion %>


## Como empezar

En el archivo "configuraciones/conexion.json" Sustituye la configuración de las conexiones a la base de datos con los parametros encriptados
```json
{
    "desarrollo": {
        "config_id": "desarrollo",
        "database_config_pg": {
            "host": "HOST_DEV",
            "database": "BD_DEV",
            "user": "USR_DEV",
            "password": "PASS_DEV",
            "port": 5432
        }
    },
}
```

Instalar las dependencias
```shell
npm i
```

Iniciar el servidor
```shell
npm start
```

Ejecutar las pruebas de integración
```shell
npm test
```

## Notas
Configura el modelo en el archivo
```json
model/Entity.js
```

Configura la validacion del request en el archivo
```json
configuraciones/esquemas/generales.js
```

Configura los datos a guardar en el controlador
```json
controladores/controller.js
```

En caso de tener problemas con la conexion a postgres, actualiza a las siguientes dependencias
```json
"pg": "^8.2.1",
"pg-protocol": "^1.2.4",
```

## Documentacion
### Como definir los tipos de datos
https://sequelize.org/v5/manual/data-types.html

### Como definir las consultas
https://sequelize.org/master/manual/model-querying-basics.html


En caso de haber mas especificaciones...

## Tecnologías Utilizadas

| Plugin | README |
| ------ | ------ |
| plugin1 | [https://plugin1.net] |
| plugin2 - Editor | [https://plugin2.net/]|
| plugin3 | [http://plugin3.com/]|

## Versionamiento

Lista de Versiones del Aplicativo



## Licencia

Este proyecto fue realizado para uso exclusivo de Fundación Rafael Dondé y se rige bajo sus estatutos y condiciones de uso. 
Para mas información referirse a [Contacto FDR](http://frd.org.mx/contacto.aspx)