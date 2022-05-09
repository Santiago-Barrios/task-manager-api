const express = require('express')
const router = new express.Router()
const Task = require('../models/task');
const validatorUpdateKeys = require('../helpers/validatorUpdatesKeys');

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(e)
    }
});

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findById({ _id })
        task ?
            res.send(task) : res.status(404).send()
    } catch (error) {
        res.status(500).send();
    }
});

router.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = validatorUpdateKeys( allowedUpdates, req.body )
    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try {
        const task = await Task.findById( _id )
        updates.forEach( update => task[update] = req.body[update] )
        await task.save()
        if( !task ){
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
});

router.delete('/tasks/:id', async (req, res) => {
    try {
        const taks = await Task.findByIdAndDelete( req.params.id )
        if(!taks){
            return res.status(404).send()
        }
        res.send(taks)
    } catch (error) {
        res.status(500).send()
    }
});

module.exports = router;

