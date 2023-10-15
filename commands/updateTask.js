// Importing packages and functions
import {connectDB, disconnectDB} from '../db/connectDB.js'
import { getTaskCode } from './deleteTask.js'
import inquirer from 'inquirer'
import Todos from '../schema/TodoSchema.js'
import ora from 'ora'
import chalk from 'chalk'

async function askUpdateQ(todo){
    try {
        // Prompting the user to update the todo data
        const update = await inquirer.prompt([
            {name: 'name', message: 'Update the name?', type: 'input', default: todo.name},
            {name: 'detail', message: 'Update the Description?', type: 'input', default: todo.detail},
            {name: 'status', message: 'Update the status', type: 'list', choices: ['pending', 'completed'], default: todo.status}
        ])

        return update
    } catch (error) {
        console.log('Something went wrong... \n', error)
    }
}

export default async function updateTask(){
    try {
        // Obtaining the task code entered by user by calling getTaskCode() method
        const userCode = await getTaskCode()

        // Connecting to the database
        await connectDB()

        // Starting the spinner
        const spinner = ora('Finding the todo...').start()

        // Finding the todo which the user wants to update
        const todo = await Todos.findOne({code: userCode.code})

        // Stopping the spinner
        spinner.stop()

        // Checking if the todo exists or not
        if(!todo){
            console.log(chalk.redBright('No puedo encontrar la tarea con el codigo que igreaste.'))
        } else{
            console.log(chalk.blueBright('Escriba las propiedades actualizadas. Presiona Enter si tu no quieres actualizar el dato.'))

            // Get the user's response of the updated data by calling askUpdateQ() method
            const update = await askUpdateQ(todo)

            // If user marked status as completed, we delete the todo else we update the data
            if(update.status === 'completed'){
                // Changing spinner text and starting it again
                spinner.text = 'Borrando tarea...'
                spinner.start()

                // Deleting the todo
                await Todos.deleteOne({_id : todo._id})

                // Stopping the spinner and display the success message
                spinner.stop()
                console.log(chalk.greenBright('Tarea borrada.'))
            } else {
                // Update the todo
                spinner.text = 'Actualizando tarea.'
                spinner.start()
                await Todos.updateOne({_id: todo._id}, update, {runValidators: true})
                spinner.stop()
                console.log(chalk.greenBright('Tarea actualizada.'))
            }
        }
        // Disconnecting from the database
        await disconnectDB()
    } catch (error) {
        // Error Handling
        console.log('Something went wrong, Error: ', error)
        process.exit(1)
    }
}