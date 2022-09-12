const user = require('../model/user')
const fs = require('fs')

module.exports = {
    getAllUser: async (req, res) => {
        try {
            const result = await user.get(req,res)
            return res.status(200).send(result)
        } catch (error) {
            return res.status(500).send(error)
        }
    }, addNewUser: async (req, res) => {
        console.log(req.file, 'filename dari upload')
        try {
            console.log({...req.body, image: 'cekcek'})
            const reqModifer = {
                ...req,
                body: { ...req.body, image: req.file.filename }
            }
            const results = await user.add(reqModifer, res)
            return res.status(201).send(results)
        } catch (error) {
            return res.status(400).send(error)
        }
    }, updateUser: async (req, res) => {
        try { 
            const result = await user.update(req, res)
            return res.status(201).send(result)
        } catch (error) {
            return res.status(400).send(error)
        }
    }, deleteUser: async (req, res) => {
        try {
            const result = await user.remove(req,res)
            return res.status(201).send(result)
        } catch (error) {
            return res.status(400).send(error)
        }
    },
}