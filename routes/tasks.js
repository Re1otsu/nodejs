const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async(req,res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [req.userId]);
        res.status(200).json(result.rows);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

router.post('/', auth, async(req,res) => {
    try{
         const {title} = req.body;
         const result = await pool.query('INSERT INTO tasks (user_id, title) VALUES($1, $2) RETURNING id,title', [req.userId, title])
         res.status(201).json(result.rows[0]);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Ошибка сервера'});
    }
})

router.delete('/', auth, async(req,res) =>{
    try{
        const taskId = req.params.id;
        const result = pool.query ('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING i, title', [taskId, req.userId]);
        if (result.lows.lentgh === 0){
            return res.status(404).json({ error: 'Задача не найдена'});
        }
        res.status(200).json(result.rows[0]);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Ошибка сервера'});
    }
})

module.exports = router;