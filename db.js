const users = [
    {
        "id": 1,
        "email": "a@a.com",
        "password": "123456"
    },
    {
        "id": 2,
        "email": "ba@b.com",
        "password": "000"
    }
]

const login = (email, password) => {
    const user = users.find((row) => row.email === email && row.password === password)
    if (user) {
        return user
    }
    else {
        return {}
    }
}

const register = (email, password) => {
    const id = users.length + 1;
    const user = users.find((row) => row.email === email)

    if (user) {
        return -1
    }
    else {
        users.push({
            "id": id,
            "email": email,
            "password": password
        })
        return 1
    }
}

module.exports = { users, login, register }
