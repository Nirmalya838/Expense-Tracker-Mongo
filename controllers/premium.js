const User = require('../models/user');
const Expense = require('../models/expense'); 

exports.getLeaderBoard = async (req, res, next) => {
    try {
        const users = await User.find();
        let userLeaderBoard = users.map(user => ({
            name: user.name,
            total_cost: user.total || 0
        }));

        userLeaderBoard.sort((a, b) => b.total_cost - a.total_cost);
        res.status(201).json(userLeaderBoard);
    } catch (err) {
        console.log(err);
    }
};
