// Função para alternar entre formulários
function showForm(formId) {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('user-info').style.display = 'none';
    document.getElementById(formId).style.display = 'block';
}

// Event Listeners para links de alternância
document.getElementById('loginLink').addEventListener('click', function (e) {
    e.preventDefault();
    showForm('login-form');
});

document.getElementById('registerLink').addEventListener('click', function (e) {
    e.preventDefault();
    showForm('register-form');
});

// Funções do LocalStorage
function getUsers() {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// Cadastro de usuário
document.getElementById('registerBtn').addEventListener('click', function () {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (!name || !email || !password) {
        alert('Preencha todos os campos!');
        return;
    }

    // Validação do e-mail
    if (!email.includes('@') || !email.includes('.')) {
        alert('E-mail inválido!');
        return;
    }

    // Validação da senha
    if (password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres!');
        return;
    }

    let users = getUsers();

    if (users.some(user => user.email === email)) {
        alert('E-mail já cadastrado!');
        return;
    }

    users.push({ name, email, password });
    saveUsers(users);

    alert('Cadastro realizado com sucesso!');
    document.getElementById('registerName').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';

    loadUserList();
});

// Login de usuário
document.getElementById('loginBtn').addEventListener('click', function () {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Preencha todos os campos!');
        return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Salvar o usuário logado no localStorage
        localStorage.setItem('usuarioLogado', JSON.stringify(user));

        // Exibir o nome do usuário na tela
        document.getElementById('user-name').innerText = user.name;

        // Mostrar o formulário de usuário logado
        showForm('user-info');

        alert(`Bem-vindo, ${user.name}`);
    } else {
        alert('Email ou senha inválidos');
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', function () {
    localStorage.removeItem('usuarioLogado');
    showForm('register-form');
});

// Exportar usuários
document.getElementById('exportUsersBtn').addEventListener('click', function () {
    const users = getUsers();
    const blob = new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.json';
    a.click();

    URL.revokeObjectURL(url);
});

// Carregar lista de usuários
function loadUserList() {
    const users = getUsers();
    const userListDiv = document.getElementById('users');
    userListDiv.innerHTML = ''; // Limpar a lista antes de adicionar

    if (users.length === 0) {
        // Mostrar exemplos quando não há usuários
        userListDiv.innerHTML = `
                    ...
                `;
        return;
    }

    users.forEach((user, index) => {
        const userDiv = document.createElement('div');
        userDiv.textContent = user.name;
        userListDiv.appendChild(userDiv);
    });
}

// Verificar se há um usuário logado ao carregar a página
window.addEventListener('load', function () {
    const loggedUser = localStorage.getItem('usuarioLogado');

    if (loggedUser) {
        const user = JSON.parse(loggedUser);
        document.getElementById('user-name').innerText = user.name;
        showForm('user-info');
    }

    loadUserList();
});