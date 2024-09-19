# Guía de Instalación y Ejecución para la Aplicación NestJS

## Descripción

Esta es una aplicación construida con NestJS que utiliza Prisma para la gestión de la base de datos y Docker para la configuración del entorno. Sigue estos pasos para configurar y ejecutar la aplicación en tu máquina local.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas en tu sistema:

- [Node.js](https://nodejs.org/) (v14 o superior)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)
- [Prisma CLI](https://www.prisma.io/docs/concepts/components/prisma-cli) (instalado globalmente)

## Pasos para la Instalación

1. **Configura las Variables de Entorno**

   Copia el archivo de ejemplo de configuración y renómbralo como `.env`:

   ```bash
   cp .env.template .env

2. **Instala las Dependencias del Proyecto**

    Instala las dependencias necesarias para la aplicación utilizando npm:

    ```bash
    npm install

3. **Configura y Ejecuta los Servicios con Docker**

    Utiliza Docker Compose para iniciar los servicios necesarios en segundo plano:

    ```bash
    docker-compose up -d

4. **Configura la Base de Datos**

    Sincroniza el esquema de la base de datos con el modelo definido en Prisma:

    ```bash
    npx prisma db push

5. **Ejecuta la Aplicación**

    Para iniciar el servidor de desarrollo de la aplicación, utiliza el siguiente comando:

    ```bash
    npm run start:dev