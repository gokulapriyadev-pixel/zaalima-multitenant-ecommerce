const Store = require('../models/store');

exports.createStore = async (req , res) => {
    // console.log("REQUEST BODY:", req.body);
    // console.log("REQUEST USER:", req.user);
    const {name} = req.body;

    const store = await Store.create({
        name,
        ownerId : req.user.id
    });
    res.json(store);
}