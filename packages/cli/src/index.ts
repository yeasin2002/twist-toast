#!/usr/bin/env node

import { Command } from 'commander'
import prompts from 'prompts'

type InitOptions = {
  yes?: boolean
}

type AddOptions = {
  all?: boolean
}

const presetComponents = [
  'toast-provider',
  'toast-root',
  'toast-title',
  'toast-description',
  'toast-action',
  'toast-close',
  'toast-viewport',
] as const

async function runInitCommand(options: InitOptions): Promise<void> {
  let projectType = 'react'

  if (!options.yes) {
    const result = await prompts(
      {
        type: 'select',
        name: 'projectType',
        message: 'What project type are you using?',
        choices: [{ title: 'React', value: 'react' }],
        initial: 0,
      },
      {
        onCancel: () => false,
      },
    )

    if (!result.projectType) {
      console.log('Init canceled.')
      return
    }

    projectType = result.projectType as string
  }

  console.log(
    `Init command is ready. Next step: generate config for "${projectType}" project.`,
  )
}

async function runAddCommand(
  rawComponents: string[],
  options: AddOptions,
): Promise<void> {
  let components = rawComponents

  if (options.all) {
    components = [...presetComponents]
  } else if (components.length === 0) {
    const result = await prompts(
      {
        type: 'multiselect',
        name: 'components',
        message: 'Select components to add',
        choices: presetComponents.map((component) => ({
          title: component,
          value: component,
        })),
        min: 1,
        instructions: false,
      },
      {
        onCancel: () => false,
      },
    )

    if (!Array.isArray(result.components) || result.components.length === 0) {
      console.log('Add canceled.')
      return
    }

    components = result.components as string[]
  }

  console.log(
    `Add command is ready. Next step: install or scaffold ${components.join(', ')}.`,
  )
}

const program = new Command()

program
  .name('twist-toast')
  .description('CLI for initializing twist-toast config and adding components')
  .version('0.0.1')

program
  .command('init')
  .description('Initialize twist-toast project config')
  .option('-y, --yes', 'Skip prompts and use default values')
  .action(async (options: InitOptions) => {
    await runInitCommand(options)
  })

program
  .command('add [components...]')
  .description('Add one or more twist-toast components')
  .option('-a, --all', 'Add all available components')
  .action(async (components: string[], options: AddOptions) => {
    await runAddCommand(components ?? [], options)
  })

program.parseAsync(process.argv).catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message)
  } else {
    console.error('Unknown CLI error.')
  }

  process.exitCode = 1
})
