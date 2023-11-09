import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

import { Geolocation } from '@capacitor/geolocation';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  formularioLogin = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    contrasenia: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router, private toastService: ToastService) { }

  /**
   * @function iniciarSesionConEmail - Permite iniciar sesion con email, a traves del email y 
   * contrasenia ingresados en los inputs.
   * @param {Event} event Evento recibido del HTML.
   * @returns Promise<void>
   */
  async iniciarSesionConEmail(event: Event): Promise<void> {
    event.preventDefault();

    if (this.formularioLogin.valid) {
      try {
        let email = this.formularioLogin.value.email as string;
        let contrasenia = this.formularioLogin.value.contrasenia as string;
  
        const usuarioLogeado = await this.authService.iniciarSesionConEmail(email, contrasenia);
  
        if (usuarioLogeado) {
          const estaVerificado: boolean = await this.authService.emailVerificado();
          this.redireccionarUsuario(estaVerificado);

          await this.toastService.mostrarToast('¡Bienvenido!', 'success', 'checkmark-circle-outline');
        }
      } catch (error) {
        console.log('Error al iniciar sesión con email: ', error);
        await this.toastService.mostrarToast('Ups... Ocurrió un problema al iniciar sesión con Email.', 'danger', 'warning-outline');
      }
    } else {
      await this.toastService.mostrarToast('Por favor, ingrese correo electrónico y contraseña válidos.', 'danger', 'warning-outline');
    }
  }

  /**
   * @function iniciarSesionConGoogle - Permite iniciar sesion con Google (Gmail), abriendo una 
   * pestania nueva y eligiendo la cuenta de Gmail.
   * @returns Promise<void>
   */
  async iniciarSesionConGoogle(): Promise<void> {
    try {
      const usuarioLogeado: any = await this.authService.iniciarSesionConGoogle();

      if (usuarioLogeado) {
        const estaVerificado = await this.authService.emailVerificado();
        this.redireccionarUsuario(estaVerificado);

        await this.toastService.mostrarToast('¡Bienvenido!', 'success', 'checkmark-circle-outline');
      } else {
        await this.toastService.mostrarToast('Ups... Ocurrió un problema al iniciar sesión con Google.', 'danger', 'warning-outline');
      }
    } catch (error) {
      console.log('Error al iniciar sesión con Google: ', error);
      await this.toastService.mostrarToast('Ups... Ocurrió un problema al iniciar sesión con Google.', 'danger', 'warning-outline');
    }
  }

  /**
   * @function redireccionarUsuario - Permite redireccionar al Usuario, segun el estado de verificacion 
   * del email, pasado por parametro. Si esta verificado, lo lleva a la pagina del clima, sino a la 
   * pagina para verificar email.
   * Ademas, si lo redirecciona a la pagina del clima, obtiene la latitud y longitud del Usuario (utilizando
   * Geolocalitation) y esos valores los pasa por URL a la pagina del clima.
   * @param {boolean} estaVerificado Estado del email verificado. Si es true, esta verificado. Si es false,
   *  no esta verificado.
   * @returns void
   */
  private async redireccionarUsuario(estaVerificado: boolean): Promise<void> {
	  if (estaVerificado) {
  	  let latitud: number;
  	  let longitud: number;

  	  const coordinates = await Geolocation.getCurrentPosition();

    	latitud = coordinates.coords.latitude;
    	longitud = coordinates.coords.longitude;

    	const navigationExtras: NavigationExtras = {
      	queryParams: {
        	lat: latitud,
        	long: longitud
      	}
    	};
    	this.router.navigate(['clima'], navigationExtras);
	  } else {
  	this.router.navigate(['verificar-email']);
	  }
  }
}
