import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  formularioRegistro = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    contrasenia:['', [Validators.required, Validators.minLength(8)]]
  });
  
  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router, private toastService: ToastService) { }

  ngOnInit() {
  }

  /**
   * @function registrar - Permite registrar al Usuario, a traves del email y contrasenia ingresados 
   * en los inputs.
   * @param {Event} event - Evento recibido del HTML.
   * @returns Promise<void>
   */
  async registrar(event: Event){
    event.preventDefault();

    if (this.formularioRegistro.valid) {
      try {
        let email: string = this.formularioRegistro.value.email as string;
        let contrasenia: string = this.formularioRegistro.value.contrasenia as string;
  
        const usuarioRegistrado: any = await this.authService.registrar(email, contrasenia);
  
        if (usuarioRegistrado) {
          const estaVerificado: boolean = await this.authService.emailVerificado();
          this.redireccionarUsuario(estaVerificado);

          if(estaVerificado){
            await this.toastService.mostrarToast('¡Bienvenido!', 'success', 'checkmark-circle-outline');
          } else {
            await this.toastService.mostrarToast('Lo siento, tiene que verificar su email.', 'danger', 'warning-outline');
          }
        }
      } catch (error) {
        console.log('Error al registrarse el usuario: ', error);
        await this.toastService.mostrarToast('Ups... Ocurrió un problema al registrarse.', 'danger', 'warning-outline');
      }
    } else {
      await this.toastService.mostrarToast('Por favor, ingrese correo electrónico y contraseña válidos.', 'danger', 'warning-outline');
    }
  }

  /**
   * @function redireccionarUsuario - Permite redireccionar al Usuario, segun el estado de verificacion 
   * del email, pasado por parametro. Si esta verificado, lo lleva a la pagina del clima, sino a la 
   * pagina para verificar email.
   * @param {boolean} estaVerificado Estado del email verificado. Si es true, esta verificado. Si es false,
   *  no esta verificado.
   * @returns void
   */
  private redireccionarUsuario(estaVerificado: boolean): void {
    if (estaVerificado) {
      this.router.navigate(['clima']);
    } else {
      this.router.navigate(['verificar-email']);      
    }
  }
}
