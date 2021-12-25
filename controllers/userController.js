const userModel = require('../models/userModel');
const axios = require('axios');

exports.post = async function (req, res, next) {
    var user = new userModel();
    user.email = req.body.email;
    user.password = req.body.password;
    user.displayName = req.body.displayName;
    user.userRole = req.body.userRole;

    user.save(function (err) {
        if (err){
            next(err);
        }
        else{
            res.json({
                message: 'User created',
                data: user
            });
        }
    });   
};

exports.getAll = async function (req, res, next) {
    userModel.find(function (err, users) {
        if (err)
            next(err);
        res.json({
            message: 'Finding users..',
            data: users
        });
    });
};

exports.get = async function (req, res, next) {
    userModel.findOne({email: req.params.email}, function (err, user) {
        if (err){
            next(err);
        }
        res.json({
            message: 'Finding user..',
            data: user
        });
    });
};

exports.put = async function (req, res, next) {
    userModel.findOne({email: req.params.email}, function (err, user) {
        if (err){
            next(err);
        }
        
        user.email = req.body.email;
        user.password = req.body.password;
        user.displayName = req.body.displayName;
        user.userRole = req.body.userRole;

        user.save(function (err) {
            if (err) {
                next(err);
            }
            res.json({
                message: 'User info updated',
                data: user
            });
        });
    });
};

exports.patch = async function (req, res, next) {
    userModel.findOne({email: req.params.email}, function (err, user) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;
        user.displayName = req.body.displayName || user.displayName;
        user.userRole = req.body.userRole || user.userRole;

        user.save(function (err) {
            if (err) {
                next(err);
            }
            res.json({
                message: 'User info updated',
                data: user
            });
        });
    });
};

exports.delete = async function (req, res, next) {

    var headers = {
         'Content-Type': 'application/json',
          Role: 'admin',
          UserId: 'system'
    };

    await axios.delete("http://quotas-app/quota/deleteUser/" + req.params.id, {headers});

    await axios.delete("http://minizinc-app/api/minizinc/" + req.params.id, {headers});

    await axios.delete("http://scheduler-app/api/scheduler/computations/" + req.params.id, {headers});

    await axios.delete("http://monitor-app/api/monitor/processes/" + req.params.id, {headers});



    userModel.deleteOne({_id: req.params.id}, function (err, user) {
        if (err){
            next(err);
        }

        // Send successful response
        res.json({
            message: 'User deleted',
            data: {_id: req.params.id},
        });
    });
};