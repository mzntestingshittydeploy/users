const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const userModel = require('../models/userModel');
const auth = require('../tools/auth');
require('dotenv').config();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: `Welcome to Microservices ${process.env.SERVICE_NAME} service crafted with love!`,
    });
});

router.route('/users')
    .post(authenticate, userController.post)
    .get(authenticate, userController.getAll);
 router.route('/users/:id')
    .get(authenticate, userController.get)
    .put(authenticate, userController.put)
    .patch(authenticate, userController.patch)
    .delete(authenticate, userController.delete);  

router.route('/register')
    .post(authController.register);

router.route('/login')
    .post(authController.login);

/*
router.route('/projects/:projectid/sprints/:sprintid/stories/:storyid/tasks/:taskid/taskUsers')
    .post(taskUserController.new)
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkId, taskUserController.viewAll)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkId, taskUserController.deleteMany);
router.route('/projects/:projectid/sprints/:sprintid/stories/:storyid/tasks/:taskid/taskUsers/:taskuserid')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkId, taskUserController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkId, taskUserController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkId, taskUserController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkId, taskUserController.delete);
*/
module.exports = router;

function authenticate(req, res, next){
    console.log(req.headers);
    if(req.headers['role'] == 'admin' || req.headers['Role'] == 'admin'){
        return next();
    };

    res.json({
        message:'Unauthorized',
        data:""
    });
    return;
}