const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para permitir que el servidor entienda formato JSON
app.use(express.json());

// Array de estudiantes (Datos quemados / en memoria)
let students = [
    {
        id: 1,
        firstName: "Juan",
        lastName: "Pérez",
        age: 20,
        email: "juan.perez@email.com",
        phone: "+503 7000 0000",
        address: {
            country: "El Salvador",
            city: "San Salvador"
        },
        isActive: true,
        courses: ["Matemáticas", "Programación", "Base de Datos"]
    }
];

// 1. GET - Obtener todos los estudiantes
app.get('/api/students', (req, res) => {
    res.status(200).json(students);
});

// 2. GET - Obtener un estudiante por ID
app.get('/api/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const student = students.find(s => s.id === studentId);

    if (!student) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    res.status(200).json(student);
});

// 3. POST - Agregar un nuevo estudiante
app.post('/api/students', (req, res) => {
    const { firstName, lastName, age, email, phone, address, isActive, courses } = req.body;

    // Validación básica de campos requeridos
    if (!firstName || !lastName || !email) {
        return res.status(400).json({ message: "Nombre, apellido y email son obligatorios" });
    }

    // Generar un ID único autoincremental
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;

    const newStudent = {
        id: newId,
        firstName,
        lastName,
        age: age || 0,
        email,
        phone: phone || "",
        address: address || { country: "", city: "" },
        isActive: isActive !== undefined ? isActive : true,
        courses: courses || []
    };

    students.push(newStudent);
    res.status(201).json({ message: "Estudiante creado con éxito", student: newStudent });
});

// 4. PUT - Actualizar un estudiante existente por ID
app.put('/api/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const studentIndex = students.findIndex(s => s.id === studentId);

    if (studentIndex === -1) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    // Reemplazamos o actualizamos los datos manteniendo el mismo ID
    students[studentIndex] = {
        ...students[studentIndex],
        ...req.body,
        id: studentId // Aseguramos que el ID no cambie
    };

    res.status(200).json({ message: "Estudiante actualizado con éxito", student: students[studentIndex] });
});

// 5. DELETE - Eliminar un estudiante por ID
app.delete('/api/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const studentIndex = students.findIndex(s => s.id === studentId);

    if (studentIndex === -1) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    // Eliminamos el estudiante del array
    const deletedStudent = students.splice(studentIndex, 1);

    res.status(200).json({ message: "Estudiante eliminado con éxito", student: deletedStudent[0] });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
