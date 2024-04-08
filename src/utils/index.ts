// test
const users = [
    {
        id: 1,
        email: 'usuario@example.com',
        senha: 'senha123'
    }
];

//verificar as credenciais do usuário
export function authenticateUser(email, senha) {
    const user = users.find(u => u.email === email && u.senha === senha);
    return user;
}
