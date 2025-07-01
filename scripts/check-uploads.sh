#!/bin/bash
echo "Verificando estructura de directorios de uploads..."
ls -la public/
echo ""
echo "Contenido de uploads:"
ls -la public/uploads/ 2>/dev/null || echo "Directorio uploads no existe"
echo ""
echo "Contenido de uploads/dish:"
ls -la public/uploads/dish/ 2>/dev/null || echo "Directorio uploads/dish no existe"
