import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }

  /**
   * @function mostrarToast - En base a los parametros pasados, muestra un toast (alert) al Usuario. Con
   * una duracion de 5 segundos (duration = 5000 milisegundos) y en la posicion de arriba de 
   * la pantalla (position = top).
   * @param {string} mensaje Mensaje que desea mostrar en el toast.
   * @param {string} color Color del toast (danger = rojo, success = verde).
   * @param {string} icono Icono que desea mostrar en el toast (warning-outline = signo de peligro, 
   * checkmark-circle-outline = signo de correcto).
   * @returns Promise<void>
   */
  async mostrarToast(mensaje: string, color: string, icono: string): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 5000,
      position: 'top',
      color: color,
      icon: icono,
    });
    toast.present();
  }
}
