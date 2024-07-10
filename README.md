# TDPII
Detección de ladrones con RaspberryPi y webcam

## Instalación

``` sh
$ sudo chmod 755 ./install.sh
$ sudo ./install.sh
``` 
#### Crear y configurar base de datos:

``` sh
$ node_modules/.bin/sequelize db:create
```
##### Correr las migraciones

``` sh
$ node_modules/.bin/sequelize db:migrate
```
##### Correr las seeds para tener datos la primera vez que se ejecuta el programa


``` sh
$ node_modules/.bin/sequelize db:seed
```

#### Correr servidor con streaming

``` sh
$ node server.js
``` 
En otra terminal correr localtunnel
``` sh
$ lt --subdomain deteccion --port 8090
``` 
