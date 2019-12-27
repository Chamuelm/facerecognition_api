const handleSignin = (db ,bcrypt) => (req, res) => {
    const {email, password } = req.body;
    console.log("Received signin request: ", JSON.stringify(req.body));

    if (!email || !password) {
        res.status(400).json("Incorrect form submission");
        return;
    }

    db.select('email', 'hash').from('login').where('email', '=', email)
        .then(user => {
            if (!(user && user.length)) {
                console.log('Wrong credentials - no such email: ', email);
                res.status(400).json('Wrong credentials');
                return;
            }

            const isValid = bcrypt.compareSync(password, user[0].hash);
            if (!isValid) {
                console.log('Wrong credentials');
                res.status(400).json('Wrong credentials');
                return;
            }

            console.log('Singin request ', JSON.stringify(req.body), ". Response: Success");
            db.select('*').from('users').where('email', '=', email)
                .then(user => res.json(user[0]))
                .catch(err => {
                    console.log('Error getting user from DB: ', err);
                    res.status(400).json('Error getting user');
                });
        })
        .catch(err => {
            console.log("Error retrieving data from DB. Wrong credentials? Details: ", err);
            res.status(400).json('Wrong credentials');
        });
}

module.exports = {
    handleSignin: handleSignin
}