# 1. Imagen base con Node.js
FROM node:20-alpine

# 2. Directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copia el package.json para instalar dependencias
COPY package.json .

# 4. Instala las dependencias
RUN npm install

# 5. Copia el resto del código del proyecto
COPY . .

# 6. Expone el puerto de Vite
EXPOSE 5173

# 7. Comando para iniciar el servidor de desarrollo de Vite
# El "--host" es CRUCIAL para que sea accesible desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host"]