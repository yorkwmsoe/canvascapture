import { Command } from '../types/command';

export const generateCommand = {
  name: "generate",
  description: "Generate PDF",
  run: generate,
  category: "general",
} satisfies Command;

async function generate() {
}