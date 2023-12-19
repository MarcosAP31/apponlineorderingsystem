import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Order } from 'src/app/models/order';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StoreService } from 'src/app/service/store.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  // Propiedades
  show: boolean = false;
  totalprice:any = 0;
  formOrder: FormGroup;
  orders: any;
  users:any;
  orderxitems:any;
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  creating = true;
  noValido = true;
  id = 0;

  constructor(
    public form: FormBuilder,
    private storeService: StoreService
  ) {
    // Inicializar formulario
    this.formOrder = this.form.group({
      Status: [''],
      PaymentStatus: [''],
      TotalAmount: [''],
      UserId: ['']
    });
  }

  // Método para mostrar un cuadro de carga
  isLoading() {
    Swal.fire({
      allowOutsideClick: false,
      width: '200px',
      text: 'Cargando...',
    });
    Swal.showLoading();
  }

  // Método para detener el cuadro de carga
  stopLoading() {
    Swal.close();
  }

  // Método para obtener los orderos y proveedores
  get() {
    this.storeService.getOrders().subscribe(response => {
      this.orders = response;
      this.dtTrigger.next(0);
    });
    this.storeService.getUsers().subscribe(response => {
      this.users = response;
    });
  }

  ngOnInit(): void {
    // Configuraciones de DataTables
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true
    };
    this.get();
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy  h:mm:ss a');
  }
  

  // Método para editar un ordero
  edit(id: any) {
    this.creating = false;
    
    this.storeService.getItemsByOrder(id).subscribe(r=>{
      this.orderxitems=r;
      console.log(this.orderxitems)
    })
    this.storeService.getTotalPriceByOrder(id).subscribe(r=>{
      this.totalprice=r;
      console.log(this.totalprice)
    })
    //this.formOrder.get('Amount')?.disable();
    this.storeService.getOrder(id).subscribe((response: any) => {
      this.id = response.OrderId;
      this.formOrder.setValue({
        Status: response.Status,
        PaymentStatus: response.PaymentStatus,
        TotalAmount: response.TotalAmount,
        UserId: response.UserId
      });
    });
    this.formOrder = this.form.group({
      Status: [''],
      PaymentStatus: [''],
      TotalAmount: [''],
      UserId: ['']
    });
  }

  // Método para eliminar un ordero
  delete(id: any) {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Seguro de eliminar el registro?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
      allowOutsideClick: false,
      icon: 'info'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Eliminando registro',
          text: 'Cargando...',
        });
        Swal.showLoading();
        this.storeService.deleteOrder(id).subscribe(() => {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Éxito',
            text: '¡Se ha eliminado correctamente!',
          }).then((result) => {
            window.location.reload();
          });
        }, (err: any) => {
          console.log(err);

          if (err.Description == "HttpErrorResponse") {
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
            title: err.Description,
            text: err.message,
          });
        });
      }
    });
  }

  // Método para guardar un order
  submit() {
    var order = new Order();
    order.Status = this.formOrder.value.Status;
    order.PaymentStatus = this.formOrder.value.PaymentStatus;
    order.TotalAmount = this.formOrder.value.TotalAmount;
    order.UserId = this.formOrder.value.UserId;
    var solicitud = this.creating ? this.storeService.insertOrder(order) : this.storeService.updateOrder(this.id, order);
    Swal.fire({
      title: 'Confirmación',
      text: '¿Seguro de guardar el registro?',
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
        console.log("holaaaa")
        solicitud.subscribe((r: any) => {
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

          if (err.name == "HttpErrorResponse") {
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
            title: err.name,
            text: err.message,
          });
        });
      };
    });

  }

  // Método para cerrar el modal
  closeModal() {
    this.formOrder = this.form.group({
      Status: [''],
      PaymentStatus: [''],
      TotalAmount: [''],
      UserId: ['']
    });
    this.show = false;
  }
}
