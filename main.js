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

// Função para excluir um usuário
function deleteUser(index) {
    const users = getUsers();

    // Confirmação antes de excluir
    if (confirm(`Deseja realmente excluir o usuário ${users[index].name}?`)) {
        users.splice(index, 1);
        saveUsers(users);
        loadUserList();
        alert('Usuário excluído com sucesso!');
    }
}

// Carregar lista de usuários
function loadUserList() {
    const users = getUsers();
    const userListDiv = document.getElementById('users');
    userListDiv.innerHTML = ''; // Limpar a lista antes de adicionar

    if (users.length === 0) {
        // Mostrar mensagem quando não há usuários
        userListDiv.innerHTML = `
            <div class="no-users">Nenhum usuário cadastrado</div>
        `;
        return;
    }

    users.forEach((user, index) => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-item';

        // Nome do usuário
        const userName = document.createElement('span');
        userName.textContent = user.name;
        userName.className = 'user-name';
        userDiv.appendChild(userName);

        // Container para os botões
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'user-buttons';

        // Botão de excluir
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.833 5.00033L4.16634 5.00033" stroke="#FF6B6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.33301 8.33367V12.5003" stroke="#FF6B6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.667 8.33367V12.5003" stroke="#FF6B6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14.1663 5.00033L13.3913 15.9587C13.3603 16.3005 13.197 16.6187 12.9346 16.8499C12.6721 17.0811 12.3311 17.2088 11.9788 17.2087H8.02129C7.66905 17.2088 7.32795 17.0811 7.06554 16.8499C6.80314 16.6187 6.63978 16.3005 6.60879 15.9587L5.83379 5.00033" stroke="#FF6B6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.5 5.00033L7.85834 3.559C7.93718 3.2342 8.12691 2.94697 8.39896 2.74644C8.67101 2.5459 9.00465 2.4456 9.34167 2.467H10.6583C10.9954 2.4456 11.329 2.5459 11.6011 2.74644C11.8731 2.94697 12.0628 3.2342 12.1417 3.559L12.5 5.00033" stroke="#FF6B6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        deleteBtn.onclick = function () {
            deleteUser(index);
        };

        // Botão de editar
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.16699 3.33301H3.33366C2.89163 3.33301 2.46771 3.50838 2.15515 3.82094C1.84259 4.1335 1.66699 4.55742 1.66699 4.99967V16.6663C1.66699 17.1086 1.84259 17.5325 2.15515 17.845C2.46771 18.1576 2.89163 18.333 3.33366 18.333H15.0003C15.4424 18.333 15.8663 18.1576 16.1788 17.845C16.4914 17.5325 16.667 17.1086 16.667 16.6663V10.833" stroke="#5D78FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15.417 2.08369C15.7485 1.75214 16.1936 1.56714 16.6587 1.56714C17.1237 1.56714 17.5688 1.75214 17.9003 2.08369C18.2319 2.41524 18.4169 2.86038 18.4169 3.32544C18.4169 3.7905 18.2319 4.23564 17.9003 4.56719L10.0003 12.4672L6.66699 13.3337L7.5003 10.0003L15.417 2.08369Z" stroke="#5D78FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        // Adicionar botões ao container
        buttonsContainer.appendChild(deleteBtn);
        buttonsContainer.appendChild(editBtn);

        // Adicionar o container de botões ao item de usuário
        userDiv.appendChild(buttonsContainer);

        // Adicionar o item de usuário à lista
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

// Função para mostrar o modal de edição de senha
function showEditPasswordModal(index) {
    const users = getUsers();
    const user = users[index];

    // Atualizar o título do modal com o nome do usuário
    document.querySelector('#editPasswordModal h3').textContent = `Editar senha de ${user.name}`;

    // Limpar campos do formulário
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';

    // Armazenar o índice do usuário sendo editado
    document.getElementById('editingUserIndex').value = index;

    // Mostrar o modal
    document.getElementById('editPasswordModal').style.display = 'flex';
}

// Função para esconder o modal de edição de senha
function hideEditPasswordModal() {
    document.getElementById('editPasswordModal').style.display = 'none';
}

// Função para salvar a nova senha
function saveNewPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const index = parseInt(document.getElementById('editingUserIndex').value);

    // Validações
    if (!newPassword || !confirmPassword) {
        alert('Preencha todos os campos!');
        return;
    }

    if (newPassword.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres!');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
    }

    // Obter usuários do localStorage
    const users = getUsers();
    const user = users[index];

    // Atualizar a senha
    users[index].password = newPassword;
    saveUsers(users);

    // Verificar se o usuário editado é o usuário logado atualmente
    const loggedUser = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    if (loggedUser.email === user.email) {
        // Atualizar os dados do usuário logado
        loggedUser.password = newPassword;
        localStorage.setItem('usuarioLogado', JSON.stringify(loggedUser));
    }

    alert('Senha atualizada com sucesso!');
    hideEditPasswordModal();
}

// Modificação na função loadUserList para conectar o botão de editar
function loadUserList() {
    const users = getUsers();
    const userListDiv = document.getElementById('users');
    userListDiv.innerHTML = ''; // Limpar a lista antes de adicionar

    if (users.length === 0) {
        // Mostrar mensagem quando não há usuários
        userListDiv.innerHTML = `
            <div class="no-users">Nenhum usuário cadastrado</div>
        `;
        return;
    }

    users.forEach((user, index) => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-item';

        // Nome do usuário
        const userName = document.createElement('span');
        userName.textContent = user.name;
        userName.className = 'user-name';
        userDiv.appendChild(userName);

        // Container para os botões
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'user-buttons';

        // Botão de excluir
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.833 5.00033L4.16634 5.00033" stroke="#FF6B6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.33301 8.33367V12.5003" stroke="#FF6B6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.667 8.33367V12.5003" stroke="#FF6B6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14.1663 5.00033L13.3913 15.9587C13.3603 16.3005 13.197 16.6187 12.9346 16.8499C12.6721 17.0811 12.3311 17.2088 11.9788 17.2087H8.02129C7.66905 17.2088 7.32795 17.0811 7.06554 16.8499C6.80314 16.6187 6.63978 16.3005 6.60879 15.9587L5.83379 5.00033" stroke="#FF6B6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.5 5.00033L7.85834 3.559C7.93718 3.2342 8.12691 2.94697 8.39896 2.74644C8.67101 2.5459 9.00465 2.4456 9.34167 2.467H10.6583C10.9954 2.4456 11.329 2.5459 11.6011 2.74644C11.8731 2.94697 12.0628 3.2342 12.1417 3.559L12.5 5.00033" stroke="#FF6B6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        deleteBtn.onclick = function () {
            deleteUser(index);
        };

        // Botão de editar
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.16699 3.33301H3.33366C2.89163 3.33301 2.46771 3.50838 2.15515 3.82094C1.84259 4.1335 1.66699 4.55742 1.66699 4.99967V16.6663C1.66699 17.1086 1.84259 17.5325 2.15515 17.845C2.46771 18.1576 2.89163 18.333 3.33366 18.333H15.0003C15.4424 18.333 15.8663 18.1576 16.1788 17.845C16.4914 17.5325 16.667 17.1086 16.667 16.6663V10.833" stroke="#5D78FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15.417 2.08369C15.7485 1.75214 16.1936 1.56714 16.6587 1.56714C17.1237 1.56714 17.5688 1.75214 17.9003 2.08369C18.2319 2.41524 18.4169 2.86038 18.4169 3.32544C18.4169 3.7905 18.2319 4.23564 17.9003 4.56719L10.0003 12.4672L6.66699 13.3337L7.5003 10.0003L15.417 2.08369Z" stroke="#5D78FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        editBtn.onclick = function () {
            showEditPasswordModal(index);
        };

        // Adicionar botões ao container
        buttonsContainer.appendChild(deleteBtn);
        buttonsContainer.appendChild(editBtn);

        // Adicionar o container de botões ao item de usuário
        userDiv.appendChild(buttonsContainer);

        // Adicionar o item de usuário à lista
        userListDiv.appendChild(userDiv);
    });
}

// Adicionar event listeners para os botões do modal
document.addEventListener('DOMContentLoaded', function () {
    // Event listener para o botão cancelar
    document.getElementById('cancelEditBtn').addEventListener('click', function () {
        hideEditPasswordModal();
    });

    // Event listener para o botão salvar
    document.getElementById('savePasswordBtn').addEventListener('click', function () {
        saveNewPassword();
    });

    // Clicar fora do modal também deve fechá-lo
    document.getElementById('editPasswordModal').addEventListener('click', function (event) {
        if (event.target === this) {
            hideEditPasswordModal();
        }
    });
});

// Função para mostrar ou ocultar a senha e atualizar os ícones de visibilidade
function togglePasswordVisibility(button) {
    // Encontra o input anterior ao botão (irmão na DOM)
    const input = button.parentElement.querySelector('input');

    // Alterna o tipo de input
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    // Alterna os ícones dentro do botão
    const eyeIcon = button.querySelector('.eye-icon');
    const eyeSlashIcon = button.querySelector('.eye-slash-icon');

    if (isPassword) {
        eyeIcon.style.display = 'none';
        eyeSlashIcon.style.display = 'block';
    } else {
        eyeIcon.style.display = 'block';
        eyeSlashIcon.style.display = 'none';
    }
}