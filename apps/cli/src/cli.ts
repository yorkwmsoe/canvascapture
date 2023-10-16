import { convertTwoArraysToObject, generateTitle, prompt } from "@lib/utils";
import { getCommand } from "@modules/command";
import { ZodError } from "zod";
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname+'/../.env' });

const main = async () => {
  console.log(generateTitle());

  while (true) {
    const result = prompt("Enter a command: ");
    const splitResult = result.split(" ");
    const commandName = splitResult[0].toLowerCase();
    const command = getCommand(commandName);
    const args = command?.inputs
      ? convertTwoArraysToObject(command.inputs, splitResult.slice(1))
      : undefined;
    if (command) {
      try {
        await command.run(args);
      } catch (error) {
        if (error instanceof ZodError) {
          error.issues.forEach((issue) => {
            console.log(`Error <${issue.path[0]}>: ${issue.message}`);
          });
        } else {
          console.log("Something went wrong.");
        }
      }
    } else {
      console.log("Command not found");
    }
  }
}

main();
