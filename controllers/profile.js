const handleProfile = (req, res, db) => {
    const { id } = req.params
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         return res.json(user);
    //     }
    // })
    // if (!found) {
    //     res.status(404).json("not found")
    // }
    db('users').where('id', id)
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json("User not found")
            }
        })
        .catch(err => res.status(400).json("Error found"))
}

module.exports = {
    handleProfile: handleProfile
}