const taskService = require('../services/taskService')

const getTasks = async(req,res) =>{
    const userId = req.userId;
    const tasks = await taskService.getTasks(userId);
    res.status(200).json(tasks);
};

const createTask = async(req, res) =>{
    const userId = req.userId;
    const {title} = req.body;
    const task = await taskService.createTask(userId, title);
    res.status(201).json(task);
};

const deleteTask = async(req, res) =>{
    const userId = req.userId;
    const taskId = req.params.id;
    const task = await taskService.deleteTask(taskId, userId);

    if (!task) {
        return res.status(404).json({
            error: 'Задача не найдена'
        });
    }

    res.status(200).json(task);
};

module.exports = {
    getTasks, 
    createTask, 
    deleteTask
};
