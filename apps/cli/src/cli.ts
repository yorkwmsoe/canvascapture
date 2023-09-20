import { convertTwoArraysToObject, generateTitle } from "@lib/utils";
import { getCommand } from "@modules/command";
import promptSync from "prompt-sync";
import { ZodError } from "zod";

const prompt = promptSync({
  sigint: true,
});

function main() {
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
        command.run(args);
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
