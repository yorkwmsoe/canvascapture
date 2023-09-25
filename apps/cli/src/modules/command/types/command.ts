import { CommandCategory } from "./category";

export type Command = {
  name: string; // name of the command
  description: string; // description of the command
  inputs?: string[]; // inputs are optional but must be in order if provided
  run: Function; // function to run when command is called
  category: CommandCategory; // category of the command
};
