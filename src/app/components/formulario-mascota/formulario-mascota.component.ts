import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Pet } from '../../interfaces/pet';
import { MascotaService } from '../../services/mascota.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-formulario-mascota',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './formulario-mascota.component.html',
  styleUrl: './formulario-mascota.component.css'
})
export class FormularioMascotaComponent {
  //iconos
  guardar = faFloppyDisk
  cancelar = faArrowLeft
  textRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/
  numberRegex = /^\d+(\.\d{1,2})?$/
  cedRegex = /^[0-9]\d{7,9}$/
  //formulario
  form =  new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.pattern(this.textRegex)]),
    edad: new FormControl('', [Validators.required, Validators.pattern(this.numberRegex)]),
    especie: new FormControl('', [Validators.required, Validators.pattern(this.textRegex)]),
    raza: new FormControl('', [Validators.required, Validators.pattern(this.textRegex)]),
    color: new FormControl('', [Validators.required, Validators.pattern(this.textRegex)]),
    tamaño: new FormControl('', [Validators.required, Validators.pattern(this.numberRegex)]),
    peso: new FormControl('', [Validators.required, Validators.pattern(this.numberRegex)]),
    cedulaDueño: new FormControl('', [Validators.required, Validators.pattern(this.numberRegex)])
  })
  
  id: string
  operacion: string = 'Agregar '
  private router: Router = inject(Router)

  constructor(private _mascotaService: MascotaService, private aRouter: ActivatedRoute, private toastr : ToastrService){
    this.id = aRouter.snapshot.paramMap.get('id')!
    // console.log(this.id)
  }

  ngOnInit(): void {
    if (this.id != '0'){
      this.operacion = 'Editar '
      this.getMascota(this.id)
    }
  }

  CUMascota(){
    // console.log(this.form)

    const mascota: Pet = {
      Nombre: this.form.value.nombre!,
      Edad: Number(this.form.value.edad!),
      Especie: this.form.value.especie!,
      Raza: this.form.value.raza!,
      Color: this.form.value.color!,
      Tamanio: Number(this.form.value.tamaño!),
      Peso: Number(this.form.value.peso!),
      IdDuenio: Number(this.form.value.cedulaDueño!)
    }

    if(this.id != '0'){ //editar
      mascota.IDMascota = this.id
      this._mascotaService.updateMascota(this.id, mascota).subscribe({
        next: () => {
        console.log('Mascota agregada')
        this.volver()
        this.toastr.info(`Mascota ${mascota.Nombre} Actualizada Con Exito!`, 'Mascota Actualizada')
      }, error: (e: HttpErrorResponse) => {
        this.toastr.error(`No se pudo Actualizar la mascota: Asegurese de ingresar los datos Adecuadamente`, 'Error Actualizando Mascota')
      }
    })
    } else {  //crear
      this._mascotaService.agregar(mascota).subscribe( {
        next: () => {
        console.log('Mascota agregada')
        this.volver()
        this.toastr.success(`Mascota ${mascota.Nombre} Creada Con Exito!`, 'Mascota Creada')
      }, error: (e: HttpErrorResponse) => {
        this.toastr.error(`No se pudo Crear la mascota: Asegurese de ingresar los datos Adecuadamente`, 'Error Cerando Mascota')
      }
    })
    }
  }

  getMascota(id: string){
    this._mascotaService.getById(id).subscribe((res: Pet[]) => {
      const data = res[0]
      console.log(data)
      this.form.setValue({
        nombre: data.Nombre,
        edad: String(data.Edad),
        especie: data.Especie,
        raza: data.Raza,
        color: data.Color,
        tamaño: String(data.Tamanio),
        peso: String(data.Peso),
        cedulaDueño: String(data.IdDuenio)
      })
    })
  }

  volver(){
    this.router.navigate(['mascota'])
  }
    
}
