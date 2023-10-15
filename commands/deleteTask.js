import inquirer from "inquirer";
import Todos from "../schema/TodoSchema.js";
import { connectDB, disconnectDB } from "../db/connectDB.js";
import ora from "ora";
import chalk from "chalk";

export async function getTaskCode(){
    try {
        // Prepara al usaurio para obtener el código de la tarea.
        const answers = await inquirer.prompt([
            { name:'code', message:'Enter the code of the todo: ', type: 'input' }
        ]);
        // elimina los espacios en blanco del código recibido.
        answers.code = answers.code.trim();
        return(answers);
    } catch (error) {
        console.log('Something went wrong...\n', error)
    }
}

export default async function deleteTask(){
    try {
        // Obtiene la tarea con el codigo que envia el usaurio.
        const userCode = await getTaskCode();
        // Conecta a la base de datos.
        await connectDB();
        // Inicia al spinner.
        const spinner = ora('Finding and Deleting tehe todo...').start();

        // Deleting the task.
        const response = await Todos.deleteOne({code: userCode.code});
        //stop spinner
        spinner.stop();
        //Valida la operacion de borrado.
        if(response.deletedCount === 0){
            console.log(chalk.redBright('No puedo encontrar una tarea que coincida con este código. Borrado fallido!.'));
        } else {
            console.log(chalk.greenBright('Deleted Task Successfully'));
        }
        // Disconnecting from the database
        await disconnectDB();
    } catch (error) {
        // Error Handling
        console.log('Something went wrong, Error: ', error);
        process.exit(1);
    }
}

/* deleteTask(); */