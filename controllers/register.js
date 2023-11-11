const handleRegister = (req, res, bcrypt, db) => {
    const { name, email, password } = req.body;
    // database.users.push({
    //     id: "125",
    //     name,
    //     email,
    //     entries: 0,
    //     joined: new Date()
    // })
    // res.json(database.users[database.users.length - 1])

    if (!email || !name || !password) {
        return res.status(400).json('Incorrect form submission');
    }

    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                trx('users')
                    .returning('*')
                    .insert({
                        name,
                        email: loginEmail[0].email,
                        joined: new Date()
                    })
                    .then(user =>
                        res.json(user[0]))
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json("Unable to register"))
}

module.exports = {
    handleRegister: handleRegister
}