const handleRegister = (db, bcrypt) => (req, res) => {
    const {email, name, password } = req.body;

    if (!email || !name || !password) {
        res.status(400).json("Incorrect form submission");
        return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    db.transaction(trx => {
        return trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmailArr => {
            return trx('users').returning('*').insert({
                name: name,
                email: loginEmailArr[0],
                joined: new Date()
            }).then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(err => {
        console.log('Unable to register: ', err);
        res.status(400).json("Unable to register")}
    );
}

module.exports = {
    handleRegister: handleRegister
}