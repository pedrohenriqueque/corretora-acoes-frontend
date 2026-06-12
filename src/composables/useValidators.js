export function useValidators() {
  const verificaEmailValido = (email) => {
    if (!email) return false
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email.trim().toLowerCase())
  }

  const verificaSenhaValida = (senha) => {
    if (!senha) return false
    // Mínimo de 8 caracteres, pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-#])[A-Za-z\d@$!%*?&._\-#]{8,}$/
    return regex.test(senha)
  }

  return {
    verificaEmailValido,
    verificaSenhaValida
  }
}
