import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { exConsole } from '../utils';
import electron from 'electron';
import chalk from 'chalk';
import { debounce } from '../utils/debounce';

export default class ElectronProcess {
  public process: ChildProcessWithoutNullStreams | undefined;

  private TM: number = Date.now();
  private restarting = false;
  private isRestart = false;

  start(): void {
    if (this.isRestart) {
      exConsole.info('Electron main process is restarting...');
      if (this.process && this.process.pid) {
        try {
          process.kill(this.process.pid);
          this.process = undefined;
        } catch (error: any) {
          exConsole.warn(error.toString());
        }
      } else {
        exConsole.warn('Failed to restart: Main process does not exist.');
      }
    }

    this.restarting = true;

    if (this.isRestart) {
      debounce(() => {
        this.startElectron();
      }, 1500);
    } else {
      this.isRestart = true;
      this.startElectron();
    }
  }

  private startElectron() {
    this.process = spawn(electron as any, ['.']);

    this.restarting = false;
    if (this.process) {
      exConsole.success(
        `Electron main process has ${this.isRestart ? 'restarted' : 'started'}.`
      );

      this.process.stdout.on('data', (data) => {
        let message: string = data.toString();

        if (message.length < 10 && (!message || !message.replace(/\s/g, '')))
          message = chalk.gray('null');
        exConsole.info(message);
      });
      this.process.stderr.on('data', (data) => {
        exConsole.error(data);
      });
      this.process.on('close', () => {
        if (!this.restarting) {
          this.process = undefined;
          process.exit();
        }
      });
    } else {
      return exConsole.error('Electron start error!');
    }
  }
}
