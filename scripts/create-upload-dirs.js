const fs = require("fs")
const path = require("path")

// Crear directorios para uploads
const uploadDirs = ["public/uploads", "public/uploads/dish", "public/uploads/establishment", "public/uploads/review"]

uploadDirs.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
    console.log(`Created directory: ${dir}`)
  }
})

console.log("Upload directories created successfully!")
