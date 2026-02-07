type User = {
    id: string,
    name: string
}

function getUserName(user: User): string {
    return user.name
}

const nome = getUserName({id: '123', name: 'Eduarda'})