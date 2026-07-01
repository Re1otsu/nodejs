const pool = require('../db/pool');

const getTasks = async(userId,isDone, limit, offset) =>{
    if(isDone === undefined){
        const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3', [userId, limit, offset]);
        return result.rows
    }
    const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1 AND is_done = $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4', [userId, isDone, limit, offset]);
    return result.rows;
}

const createTask = async(userId, title) =>{
    const searchPattern = `%${search}%`;
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

const updateTask = async (taskId,userId, title, is_done) =>{
    const result = await pool.query('UPDATE tasks SET title = COALESCE($1, title), is_done = COALESCE($2, is_done) WHERE id = $3 AND user_id = $4 RETURNING id, title, is_done', [title ?? null, is_done ?? null, taskId, userId]);
    if(result.rows.length === 0){
        return null;
    }
    return result.rows[0];
}

module.exports = {
    getTasks,
    createTask,
    deleteTask,
    updateTask
}