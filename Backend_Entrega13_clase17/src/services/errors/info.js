const generarInfoError = (usuario) => {
    return `Email invalido.
    El siguiente email no se encuentra registrado como usuario: 
    - Email: ${usuario.email}
    `
}

module.exports = {
    generarInfoError
}

// - Nombre: String, pero recibimos ${user.first_name}
// - Apellido: String, pero recibimos ${user.last_name}