import inquirer from "inquirer";
import { connectDB, disconnectDB } from "../db/connectDB.js";
import Todos from "../schema/TodoSchema.js";
import ora from "ora";
import chalk from 'chalk';

async function input(){
    const answers = await inquirer.prompt([
        { name: 'name', message: 'Enter name of the task:', type:'input'},
        { name: 'detail', message: 'Enter detail of the task:', type:'input'}
    ]);
    return answers;
}

/* const output = await input();
console.log(output); */

const askQuestion = async() => {
    const todoArray = [];
    let loop = false;

    do {
        const userRes = await input();
        todoArray.push(userRes);
        const confirmQ = await inquirer.prompt([{name: 'confirm', message:'Do you want to add more task?', type: 'confirm'}]);
        if (confirmQ.confirm){
            loop=true;
        }else{
            loop=false;
        }
    } while (loop);
    return todoArray;
}

/* const output = await askQuestion();
console.log(output); */

export default async function addTask(){
    try {
        // Llama a askQuestion() para obtener el arreglo de tareas.
        const userResponse = await askQuestion();
        // conecta a la base de datos
        await connectDB();
        // Despliega un spinner con el siguiente mensaje usando ora.
        let spinner = ora('Creating the todos...').start();
        
        // loop sobre cada tarea del array userResponse y salva cada tarea en la base de datos.
        for (let i = 0 ;i < userResponse.length; ++i) {
            const response = userResponse[i];
            await Todos.create(response);
        }

        // Detenemos el spinner.
        spinner.stop();
        console.log(
            chalk.greenBright('Created the todos!')
        );
        // Disconecta la base de datos.
        await disconnectDB();
    } catch (error) {
        // Manejo del error
        console.log(chalk.red(`Error: ${error}`));
        process.exit(1);
    }
}
