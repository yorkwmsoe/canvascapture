import { z } from 'zod'
import { Command } from '../types/command'

export const greetCommand = {
    name: 'greet',
    description: 'Greet the user',
    inputs: ['name'],
    run: greet,
    category: 'test',
} satisfies Command

const argSchema = z.object({
    name: z.string().min(1, 'name is required'),
})

type Args = z.infer<typeof argSchema>

export function greet(args: Args) {
    const validatedArgs = argSchema.parse(args)
    console.log(`Hello ${validatedArgs.name}`)
}
