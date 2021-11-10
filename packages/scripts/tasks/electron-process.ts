import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import electron from 'electron';
import { debounce } from '../utils/debounce';
import { logger } from '@react-electron-admin/esbuild-devserver';

export default class ElectronProcess {
  public process: ChildProcessWithoutNullStreams | undefined;

  private restarting = false;
  private isRestart = false;

  start(): void {
    if (this.isRestart) {
      logger.error('Electron main process is restarting...');
      if (this.process && this.process.pid) {
        try {
          process.kill(this.process.pid);
          this.process = undefined;
        } catch (error: any) {
          logger.warn(error.toString());
        }
      } else {
        logger.warn('Failed to restart: Main process does not exist.');
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
      logger.success(
        `Electron main process has ${this.isRestart ? 'restarted' : 'started'}.`
      );

      this.process.stdout.on('data', (data) => {
        let message: string = data.toString();

        if (message.length < 10 && (!message || !message.replace(/\s/g, ''))) {
        } else {
          logger.debug(message);
        }
      });
      this.process.stderr.on('data', (data) => {
        logger.error(data);
      });
      this.process.on('close', () => {
        if (!this.restarting) {
          this.process = undefined;
          process.exit();
        }
      });
    } else {
      return logger.error('Electron start error!');
    }
  }
}
