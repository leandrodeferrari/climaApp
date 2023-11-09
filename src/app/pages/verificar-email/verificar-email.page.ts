import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-verificar-email',
  templateUrl: './verificar-email.page.html',
  styleUrls: ['./verificar-email.page.scss'],
})
export class VerificarEmailPage implements OnInit {
  emailVerificado!: boolean;

  constructor(private authService: AuthService, private toastService: ToastService) { }

  ngOnInit() {
    this.obtenerValorDeEmailVerficado();
  }

  /**
   * @function obtenerValorDeEmailVerficado - Permite saber si el email del Usuario logeado esta 
   * verificado o no, y lo guarda en el atributo emailVerificado.
   * @returns void
   */
  obtenerValorDeEmailVerficado(): void{
    this.authService.emailVerificado().then((respuesta) => {this.emailVerificado = respuesta});
  }

  /**
   * @function reenviarEmail - Permite reenviar el email de verificacion de cuenta, al Usuario logeado.
   * @returns Promise<void>
   */
  async reenviarEmail(): Promise<void> {
    try {
      await this.authService.enviarEmailDeVerificacion();

      await this.toastService.mostrarToast('Se le ha reenviado el email correctamente.', 'success', 'checkmark-circle-outline');
    } catch (error) {
      console.log('Error al reenviar email de verificación: ', error);
      await this.toastService.mostrarToast('Ups... Ocurrió un problema al reenviar el email.', 'danger', 'warning-outline');
    }
  }
}
