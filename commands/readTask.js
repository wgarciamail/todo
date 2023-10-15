import { connectDB, disconnectDB } from "../db/connectDB.js";
import Todos from "../schema/TodoSchema.js";
import chalk from "chalk";
import ora from "ora";

export default async function readTask(){
    try {
        // Conecta a la bd.
        await connectDB();
        const spinner = ora('Loading all tasks...').start();
        // Obtiene todos los datos de la colección 'todos'.
        let todos = await Todos.find({});
        spinner.stop();
        // Imprime en consola el resultado obtenido.
        console.log(chalk.greenBright("All your tasks:"));
        if (todos.length === 0){
            console.log(chalk.blackBright('Aún no tienes tareas!'))
        } else {
            todos.forEach( todo => {
                console.log(chalk.cyanBright('Todo code: ') + todo.code + '\n');
                console.log(chalk.blueBright('Name: ') + todo.name + '\n');
                console.log(chalk.yellowBright('Description: ') + todo.detail + '\n');
            });
        }
        // Desconecta la base de datos.
        await disconnectDB();
    } catch (error) {
        console.log('Error leyendo tareas', error);
        process.exit(1);
    }
}

//readTask();