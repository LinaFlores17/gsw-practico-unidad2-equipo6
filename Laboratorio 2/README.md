# Dulce Hogar — Infraestructura Web

Configuración de infraestructura web para **Dulce Hogar**, una pastelería artesanal salvadoreña. El proyecto comprende el dimensionamiento de la infraestructura, la configuración de Apache, la implementación de VirtualHosts, la integración de una API con Node.js y Express, y la habilitación de HTTPS mediante un certificado local.

También incorpora una página web con una estética nostálgica inspirada en la repostería tradicional salvadoreña, con secciones dedicadas a la historia, la galería y el menú de productos.

---

## 📌 Contexto y Propósito del Proyecto

**Dulce Hogar** busca representar una pastelería salvadoreña mediante una página web sencilla, accesible y con una identidad visual inspirada en las recetas tradicionales y los recuerdos familiares.

El laboratorio se centra en la implementación de una infraestructura web funcional que permita publicar la página, configurar el dominio local y comprobar el funcionamiento del backend.

Entre los componentes implementados se encuentran:

- **Servidor web Apache:** publicación de la página y atención de solicitudes HTTP.
- **VirtualHosts:** configuración del dominio local `dulcehogar.local`.
- **Proxy inverso:** redirección de solicitudes de la API desde Apache hacia el backend.
- **API REST:** servidor desarrollado con Node.js, Express y TypeScript que devuelve un saludo personalizado.
- **HTTPS local:** acceso mediante una conexión cifrada utilizando un certificado generado con mkcert.
- **Diseño web:** página de repostería artesanal salvadoreña elaborada con HTML y CSS.
- **Documentación y evidencias:** archivos de configuración, procedimientos y capturas de las pruebas realizadas.

---

## 🎯 Objetivos

- Dimensionar los recursos necesarios para el laboratorio.
- Instalar y configurar Apache en Ubuntu mediante WSL2.
- Configurar VirtualHosts y el proxy inverso para comunicar Apache con la API.
- Habilitar HTTPS y comprobar el funcionamiento del certificado local.
- Desarrollar y ejecutar una API para atender solicitudes HTTP.
- Diseñar una página web para Dulce Hogar.
- Documentar los procedimientos realizados y las pruebas de funcionamiento.

---

## 🚀 Tecnologías Principales

- **Sistema operativo:** Windows 11 con WSL2 y Ubuntu.
- **Servidor web:** Apache HTTP Server.
- **Backend:** Node.js y Express.
- **Lenguaje del backend:** TypeScript.
- **Ejecución de TypeScript:** tsx.
- **Frontend:** HTML5 y CSS3.
- **HTTPS local:** mkcert y OpenSSL.
- **Control de versiones:** Git y GitHub.

---

## 🛠️ Cómo Levantar el Proyecto

Las siguientes instrucciones describen el procedimiento para reproducir el laboratorio en una computadora nueva. Los comandos suponen que se conserva la estructura de carpetas presentada en este README.

### 1. Prerrequisitos

Antes de comenzar, se necesita:

- Windows 11 con WSL2 y una distribución Ubuntu.
- Git para clonar el repositorio.
- Apache HTTP Server.
- Node.js y npm.
- Las dependencias declaradas en `package.json`.
- mkcert para generar el certificado local.
- OpenSSL para las operaciones necesarias con certificados.

Los comandos de esta sección se ejecutan en Ubuntu (WSL), salvo cuando se indique expresamente que deben ejecutarse en PowerShell de Windows.

### 2. Clonar el repositorio

Si todavía no tienes una copia local, abre Ubuntu y ejecuta:

```bash
git clone URL_DEL_REPOSITORIO
cd NOMBRE_DE_LA_CARPETA
```

Sustituye `URL_DEL_REPOSITORIO` por la dirección real del repositorio de GitHub y `NOMBRE_DE_LA_CARPETA` por el nombre del directorio creado al clonarlo.

Si ya tienes el repositorio descargado, entra en su directorio con `cd`.

### 3. Instalar los componentes necesarios

Actualiza los paquetes de Ubuntu e instala Apache, Node.js, npm y OpenSSL:

```bash
sudo apt update
sudo apt install apache2 nodejs npm openssl
```

Comprueba las versiones:

```bash
node --version
npm --version
apache2 -v
```

También debe estar disponible mkcert. Su instalación puede variar según la versión de Ubuntu; consulta las instrucciones de la fase 4 si todavía no está instalado.

### 4. Instalar las dependencias de la API

Desde la raíz del repositorio, ejecuta:

```bash
npm install
```

Este comando instala las dependencias declaradas en `package.json`. El proyecto debe incluir los paquetes necesarios para Express, TypeScript y tsx, así como los tipos de desarrollo utilizados.

**Nota:** `package.json` y `package-lock.json` deben estar incluidos en el repositorio si se utilizan para administrar las dependencias. No se debe subir `node_modules/`.

### 5. Preparar la página web

La página se encuentra en la carpeta `web/` del repositorio y contiene los archivos `index.html` y `styles.css`.

Crea el directorio de publicación de Apache:

```bash
sudo mkdir -p /var/www/dulcehogar.local
```

Copia los archivos web:

```bash
sudo cp web/index.html web/styles.css /var/www/dulcehogar.local/
```

Comprueba que se hayan copiado:

```bash
ls -l /var/www/dulcehogar.local/
```

Deben aparecer los archivos `index.html` y `styles.css`.

### 6. Configurar Apache, los puertos y los VirtualHosts

Antes de reemplazar archivos de configuración, guarda una copia de los archivos actuales:

```bash
sudo cp /etc/apache2/ports.conf /etc/apache2/ports.conf.bak
```

Copia la configuración de puertos incluida en el repositorio:

```bash
sudo cp config/ports.conf /etc/apache2/ports.conf
```

Copia las configuraciones de los VirtualHosts:

```bash
sudo cp config/dulcehogar.local.conf /etc/apache2/sites-available/
sudo cp config/dulcehogar.local-ssl.conf /etc/apache2/sites-available/
```

Habilita los módulos necesarios para el proxy inverso, los encabezados y HTTPS:

```bash
sudo a2enmod proxy proxy_http headers ssl
```

Habilita los sitios:

```bash
sudo a2ensite dulcehogar.local.conf
sudo a2ensite dulcehogar.local-ssl.conf
```

Comprueba la sintaxis:

```bash
sudo apache2ctl configtest
```

Si aparece `Syntax OK`, inicia o recarga Apache:

```bash
sudo systemctl start apache2
sudo systemctl reload apache2
```

El archivo `ports.conf` debe incluir los puertos necesarios para HTTP y HTTPS. En esta implementación se utilizan el puerto 80 para HTTP y el puerto 8900 para HTTPS.

El puerto 9000 corresponde a la API. Apache debe disponer de las reglas `ProxyPass` y `ProxyPassReverse` necesarias para reenviar las solicitudes dirigidas a `/api` hacia el backend.

**Importante:** la configuración HTTPS necesita que el certificado y la clave privada existan en las rutas indicadas por el VirtualHost. Si ya hay una configuración activa con ambos VirtualHosts en un mismo archivo, deben separarse cuidadosamente antes de habilitar los archivos independientes para evitar duplicados.

### 7. Generar el certificado HTTPS local

Cada integrante debe generar un certificado local para su entorno de desarrollo.

Instala la autoridad certificadora local de mkcert:

```bash
mkcert -install
```

Genera el certificado para el dominio:

```bash
mkcert -cert-file dulcehogar.local.pem \
       -key-file dulcehogar.local-key.pem \
       dulcehogar.local
```

Crea el directorio que utilizará Apache:

```bash
sudo mkdir -p /etc/apache2/ssl/dulcehogar.local
```

Copia el certificado y su clave privada:

```bash
sudo cp dulcehogar.local.pem dulcehogar.local-key.pem \
/etc/apache2/ssl/dulcehogar.local/
```

Configura los permisos:

```bash
sudo chown root:root /etc/apache2/ssl/dulcehogar.local/dulcehogar.local.pem
sudo chown root:root /etc/apache2/ssl/dulcehogar.local/dulcehogar.local-key.pem

sudo chmod 644 /etc/apache2/ssl/dulcehogar.local/dulcehogar.local.pem
sudo chmod 600 /etc/apache2/ssl/dulcehogar.local/dulcehogar.local-key.pem
```

Comprueba la configuración y recarga Apache:

```bash
sudo apache2ctl configtest
sudo systemctl reload apache2
```

Para eliminar las advertencias de privacidad, también debe instalarse la autoridad certificadora raíz pública de mkcert en el almacén de confianza de Windows utilizado por el navegador.

En el caso de Windows, se puede exportar el certificado raíz público de mkcert con OpenSSL y posteriormente importarlo utilizando las herramientas de certificados del sistema. El procedimiento completo debe seguirse según la fase 4.

**Por seguridad, no se deben subir al repositorio las claves privadas de los certificados ni el archivo `rootCA-key.pem`.**

### 8. Configurar el dominio local

En Ubuntu, comprueba la resolución del dominio:

```bash
getent hosts dulcehogar.local
```

Si no devuelve una dirección, agrega la entrada local:

```bash
echo "127.0.0.1 dulcehogar.local" | sudo tee -a /etc/hosts
```

En Windows también debe configurarse el archivo `hosts` para que resuelva el dominio local. Si se utiliza el modo de red reflejado de WSL, la entrada empleada en esta implementación es:

```text
127.0.0.1 dulcehogar.local
```

Después de modificar el archivo `hosts` de Windows, abre PowerShell y ejecuta:

```powershell
ipconfig /flushdns
```

La resolución del dominio y la instalación del certificado son configuraciones locales; no se aplican automáticamente al clonar el repositorio.

### 9. Iniciar la API

Desde la raíz del repositorio, abre una terminal de Ubuntu y ejecuta:

```bash
npx tsx src/api/servidor.ts
```

La terminal debe mostrar un mensaje indicando que el backend está escuchando en el puerto 9000.

Mantén esta terminal abierta mientras realizas las pruebas. Si detienes el proceso, las solicitudes dirigidas al backend dejarán de responder, aunque Apache continúe funcionando.

Si aparece un error de dependencias incompatibles con Linux, comprueba que las dependencias se hayan instalado desde Ubuntu y no se estén reutilizando archivos `node_modules` creados en Windows.

### 10. Iniciar y comprobar Apache

Si el servicio todavía no está funcionando, ejecuta:

```bash
sudo systemctl start apache2
```

Comprueba su estado:

```bash
sudo systemctl status apache2 --no-pager
```

Comprueba los puertos:

```bash
sudo ss -ltnp | grep -E ':(80|9000|8900)\b'
```

Apache debe escuchar en los puertos 80 y 8900, mientras que el backend debe estar ejecutándose en el puerto 9000.

---

## 📡 Direcciones de Acceso y Pruebas

### Página web

**HTTP — Puerto 80**

```text
http://dulcehogar.local
```

**HTTPS — Puerto 8900**

```text
https://dulcehogar.local:8900
```

La página incluye una navegación principal, una sección de historia, una galería y un menú de productos de repostería tradicional salvadoreña.

### API directamente desde Ubuntu

```bash
curl "http://127.0.0.1:9000/api/saludo?nombre=Equipo"
```

Respuesta esperada:

```text
¡Hola, Equipo! Saludos desde la API de Dulce Hogar.
```

### API a través del proxy inverso mediante HTTP

```bash
curl "http://dulcehogar.local/api/saludo?nombre=Evelin"
```

### API a través del proxy inverso mediante HTTPS

```bash
curl "https://dulcehogar.local:8900/api/saludo?nombre=Evelin"
```

Si el certificado está correctamente instalado y es de confianza para el entorno donde se ejecuta `curl`, esta solicitud debe funcionar sin omitir la validación.

### Probar la API sin proporcionar un nombre

```bash
curl "https://dulcehogar.local:8900/api/saludo"
```

La API utiliza `Equipo` como nombre predeterminado.

### Resultados esperados

| Prueba                   | Resultado esperado                                                       |
| ------------------------ | ------------------------------------------------------------------------ |
| Apache en el puerto 80   | Página web disponible mediante HTTP.                                     |
| Apache en el puerto 8900 | Página web disponible mediante HTTPS.                                    |
| API en el puerto 9000    | Respuesta directa del backend.                                           |
| API mediante HTTP        | Respuesta a través del proxy inverso.                                    |
| API mediante HTTPS       | Respuesta a través del proxy inverso con certificado válido y confiable. |

Si se recibe un error `503 Service Unavailable`, comprueba que la API esté ejecutándose y que Apache pueda comunicarse con el puerto 9000.

Si el navegador muestra una advertencia de privacidad, revisa el certificado, el dominio y la instalación de la autoridad certificadora de mkcert.

---

## 📁 Estructura del Proyecto

El repositorio conserva los archivos de documentación y configuración del laboratorio, y añade los archivos fuente de la API y la página web.

```text
Laboratorio 2/
├── README.md
├── informe-final.pdf
├── fase1-dimensionamiento.txt
├── fase2-apache.txt
├── fase3-virtualhost.txt
├── fase4-https.txt
├── config/
│   ├── dulcehogar.local.conf
│   ├── dulcehogar.local-ssl.conf
│   └── ports.conf
├── capturas/
│   ├── fase2-apache-activo.png
│   ├── fase3-curl-exitoso.png
│   └── fase4-https-sin-advertencia.png
├── src/
│   └── api/
│       └── servidor.ts
├── web/
│   ├── index.html
│   └── styles.css
├── package.json
├── package-lock.json
├── tsconfig.json
└── .gitignore
```

La estructura representa la organización prevista del proyecto. Los archivos de documentación, las capturas, `package.json`, `package-lock.json`, `tsconfig.json` y `.gitignore` deben coincidir con los que realmente se encuentren en el repositorio.

### Descripción de los directorios

- **`config/`**: contiene las configuraciones de Apache y de los puertos.
- **`capturas/`**: almacena las evidencias de las pruebas realizadas.
- **`src/api/`**: contiene el código fuente del backend.
- **`web/`**: contiene la estructura HTML y los estilos CSS de la página.
- **`package.json` y `package-lock.json`**: registran las dependencias del proyecto Node.js.
- **`tsconfig.json`**: contiene la configuración de TypeScript.
- **`.gitignore`**: evita que se incorporen archivos generados o sensibles al repositorio.

---

## 🎨 Diseño de Dulce Hogar

La página utiliza una identidad visual inspirada en las pastelerías tradicionales salvadoreñas.

### Características del diseño

- Paleta de colores crema, barro, café oscuro y ocre.
- Tipografía clásica basada en Georgia y Times New Roman.
- Navegación a las secciones principales.
- Sección de historia con un enfoque nostálgico.
- Galería de fotografías de productos y preparaciones.
- Menú de repostería tradicional.
- Adaptación a pantallas pequeñas mediante CSS.

### Archivos principales

| Archivo          | Función                                                |
| ---------------- | ------------------------------------------------------ |
| `web/index.html` | Estructura y contenido de la página.                   |
| `web/styles.css` | Apariencia, colores, distribución y adaptación visual. |

Los archivos web se copian al directorio `/var/www/dulcehogar.local/`, desde donde Apache publica la página.

**Nota:** la página web no depende de la API para mostrarse. La API es un servicio independiente que puede probarse directamente o a través de las rutas configuradas en Apache.

---

## 🔌 Funcionamiento de la API

La API se encuentra en `src/api/servidor.ts` y está desarrollada con Node.js, Express y TypeScript.

Actualmente implementa una ruta GET:

```text
/api/saludo
```

Esta ruta obtiene el parámetro `nombre` enviado en la URL y genera una respuesta personalizada.

Ejemplo:

```text
/api/saludo?nombre=Ana
```

Respuesta:

```text
¡Hola, Ana! Saludos desde la API de Dulce Hogar.
```

Si no se proporciona el parámetro, se utiliza `Equipo` como valor predeterminado.

La API escucha en el puerto 9000. Apache puede reenviar solicitudes destinadas a `/api` mediante el proxy inverso configurado en los VirtualHosts.

---

## 🔐 Configuración Local y Seguridad

Las configuraciones incluidas en `config/` permiten documentar y reproducir el entorno del laboratorio.

Cada integrante debe preparar su propia configuración local de WSL, el archivo `hosts`, los certificados y los servicios. Estos elementos no se transfieren automáticamente al clonar el repositorio.

Por seguridad:

- No subir claves privadas ni archivos secretos.
- No subir `node_modules/`.
- No compartir `rootCA-key.pem`.
- Mantener las configuraciones y los procedimientos documentados para que otros puedan reproducir el entorno.
- Comprobar los archivos con `sudo apache2ctl configtest` antes de recargar Apache.

---

## 👥 Distribución del Trabajo

**Evelin — Coordinación general, fases 1 y 3, API y diseño web**

Responsable de coordinar el equipo y desarrollar la fase 1, correspondiente al dimensionamiento, y la fase 3, relacionada con la configuración de VirtualHosts y el proxy inverso. También desarrolló la API de Dulce Hogar y preparó el diseño web, además de integrar estos componentes en la infraestructura configurada.

**Karla — Fase 2: Configuración de Apache**

Responsable de la fase 2, relacionada con la instalación y configuración inicial del servidor Apache.

**Marlon — Fase 4: HTTPS e informe final**

Responsable de la fase 4, correspondiente a la configuración HTTPS y el certificado local, así como de la elaboración del informe final del laboratorio.

---

## 📸 Evidencias del Laboratorio

Las capturas de pantalla correspondientes a las pruebas se almacenan en `capturas/`.

Entre las evidencias previstas se incluyen:

- Estado activo del servicio Apache.
- Respuesta exitosa de la API a través de las rutas configuradas.
- Acceso a HTTPS sin advertencias de seguridad.

El archivo `informe-final.pdf` reúne la documentación final del laboratorio. Los archivos de texto de las fases documentan los procedimientos correspondientes.

Los nombres y rutas de las evidencias deben coincidir con los archivos que se incluyan realmente en el repositorio.

---
