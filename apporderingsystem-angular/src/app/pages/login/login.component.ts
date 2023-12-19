import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StoreService } from 'src/app/service/store.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  show: boolean = false;
  title = 'fileUpload';
  formLogin: FormGroup;
  formUser: FormGroup;
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    public form: FormBuilder,
    private storeService: StoreService,
    private router: Router
  ) {
    // Inicializar el formulario
    this.formLogin = this.form.group({
      email: [''],
      password: ['']
    });
    this.formUser = this.form.group({
      Name: [''],
      LastName: [''],
      Phone: [''],
      Email: [''],
      Username: [''],
      Password: ['']
    });
  }
  // Método para mostrar el mensaje de carga
  isLoading() {
    Swal.fire({
      allowOutsideClick: false,
      width: '200px',
      text: 'Cargando...',
    });
    Swal.showLoading();
  }

  // Método para ocultar el mensaje de carga
  stopLoading() {
    Swal.close();
  }
  ngOnInit(): void {

    // Redireccionar al inicio si ya hay un token de acceso en las cookies
    if (this.cookieService.check('token_access')==false) {
      this.router.navigateByUrl('login');
    }

    
    /* Comentar este bloque temporalmente
    if (this.storeService.estaAutenticado()) {
      this.router.navigateByUrl("inicio");
      var r = this.storeService.obtenerUserLogeado();
      if (r.administrador) {
        this.router.navigate(['/mantenimiento/empresa']);
      } else if (r.supervisor) {
        this.router.navigate(['/inventario/apertura']);
      } else {
        this.router.navigate(['/inventario/toma']);
      }
    }
    */
  }
  
  redirectFromHash() {
    if (window.location.hash && window.location.hash === '#/') {
      window.location.replace(window.location.href.replace('#/', ''));
    }
  }
  submit() {
    // Crear un nuevo usuario con los datos del formulario
    const user = new User();
    user.Email = this.formLogin.value.email;
    user.Password = this.formLogin.value.password;

    // Mostrar un mensaje de carga mientras se realiza la autenticación
    

    // Llamar al servicio de autenticación
    this.storeService.login(user).subscribe((r: any) => {
      if (r == null) {
        // Si la autenticación falla, redireccionar a la página de inicio de sesión y cerrar el mensaje de carga
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Error de autenticación',
          text: 'Correo o contraseña incorrectos',
        });
        
      } else {
        // Si la autenticación tiene éxito, almacenar el token de acceso y realizar verificaciones adicionales
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Login',
          text: 'Ingresando...',
        });
        Swal.showLoading();
        localStorage.setItem("token", r);
        this.storeService.verifyToken(localStorage.getItem("token")).subscribe(() => {
          this.cookieService.set('token_access', r);
          this.storeService.getUserByEmail(this.formLogin.value.email).subscribe((res: any) => {
            localStorage.setItem('username', res.Username);
            localStorage.setItem('userId', res.UserId);
          });
          this.router.navigateByUrl('inicio');
        });

        Swal.close();
      }
    });
  }
  // Método para guardar o actualizar un usuario
  submitForm() {
    var user = new User();
    user.Name = this.formUser.value.Name;
    user.LastName = this.formUser.value.LastName;
    user.Phone = this.formUser.value.Phone;
    user.Email = this.formUser.value.Email;
    user.Username = this.formUser.value.Username;
    user.Password = this.formUser.value.Password;
    Swal.fire({
      title: 'Confirmación',
      text: 'Seguro de guardar el registro?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Guardar`,
      denyButtonText: `Cancelar`,
      allowOutsideClick: false,
      icon: 'info'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Guardando registro',
          text: 'Cargando...',
        });
        Swal.showLoading();
        
        this.storeService.insertUser(user).subscribe(() => {
          
          
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Éxito',
            text: 'Se ha guardado correctamente!',
          }).then((result) => {
            window.location.reload();
          });
        }, err => {
          console.log(err);
          if (err.Name == "HttpErrorResponse") {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'error',
              title: 'Error al conectar',
              text: 'Error de comunicación con el servidor',
            });
            return;
          }
          Swal.fire({
            allowOutsideClick: false,
            icon: 'error',
            title: err.Name,
            text: err.message,
          });
        });
      } else if (result.isDenied) {

      }

    });
  }

  // Método para cerrar el modal
  closeModal() {
    this.formUser = this.form.group({
      Name: [''],
      LastName: [''],
      Phone: [''],
      Email: [''],
      Username: [''],
      Password: ['']
    });
  }
}
