#! /usr/bin/env node
import meow from 'meow';
import { commands } from './commands';
import { Command } from './commands/base';
import { exConsole } from './utils/console';

const _cli = meow(`Usage: TODO`);
const _command = _cli.input[0] ?? null;
const _availableCommands = ['dev', 'build'];

if (_availableCommands.includes(_command)) {
  const command = new (commands as any)[_command]() as Command;
  command.execute().then(() => {
    // process.exit(0)
  });
} else {
  exConsole.warn(`${_command} is incorrect command`);
}
