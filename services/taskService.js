const pool = require('../db/pool');

const getTasks = async(userId) =>{
    const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
    return result.rows;
}

const createTask = async(userId, title) =>{
    const result = await pool.query('INSERT INTO tasks (user_id, title) VALUES ($1, $2) RETURNING id, title', [userId, title])
    return result.rows[0];
}

const deleteTask = async(taskId, userId) =>{
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id, title', [taskId, userId]);
    if (result.rows.length === 0){
        return null;
    }   
    return result.rows[0]; 
}

module.exports = {
    getTasks,
    createTask,
    deleteTask
}