import { Injectable, ApplicationRef, createComponent, EnvironmentInjector } from '@angular/core';
import { DialogComponent, DialogConfig } from '../components/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogComponentRef: any;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  private ensureDialogComponent() {
    if (!this.dialogComponentRef) {
      this.dialogComponentRef = createComponent(DialogComponent, {
        environmentInjector: this.injector
      });

      this.appRef.attachView(this.dialogComponentRef.hostView);
      const domElem = (this.dialogComponentRef.hostView as any).rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);
    }
  }

  confirm(config: DialogConfig): Promise<boolean> {
    this.ensureDialogComponent();
    return this.dialogComponentRef.instance.open(config);
  }

  alert(title: string, message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info'): Promise<boolean> {
    return this.confirm({
      title,
      message,
      type,
      confirmText: 'OK'
    });
  }
}
