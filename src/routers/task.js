const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middlewares/auth');
const validatorUpdateKeys = require('../helpers/validatorUpdatesKeys');

router.post('/tasks', auth, async (req, res) => {
    const task = new Task( {
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(e)
    }
});

router.get('/tasks', auth, async (req, res) => {
    try {
        await req.user.populate('tasks')
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id , owner: req.user._id })
        task ?
            res.send(task) : res.status(404).send()
    } catch (error) {
        res.status(500).send();
    }
});

router.patch('/tasks/:id', auth,  async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = validatorUpdateKeys( allowedUpdates, req.body )
    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try {
        const task = await Task.findOne( { _id, owner: req.user._id } )
        if( !task ){
            return res.status(404).send()
        }
        updates.forEach( update => task[update] = req.body[update] )
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const taks = await Task.findOneAndDelete( {_id: req.params.id, owner: req.user._id} )
        if(!taks){
            return res.status(404).send()
        }
        res.send(taks)
    } catch (error) {
        res.status(500).send()
    }
});

module.exports = router;

