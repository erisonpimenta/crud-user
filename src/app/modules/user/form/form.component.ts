import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { utilsBr } from 'js-brasil';
import { NgBrazilValidators } from 'ng-brazil';
import { FormBaseComponent } from 'src/app/components/base/form-base.component';
import { Address } from 'src/app/models/address';
import { User } from 'src/app/models/user';
import UserService from 'src/app/modules/user/services/user.service';
import { AddressService } from 'src/app/services/address.service';
import { StringUtils } from 'src/app/utils/string-utils';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent
  extends FormBaseComponent
  implements OnInit, AfterViewInit
{
  errors: string[] = [];

  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  userForm!: FormGroup;
  user!: User;

  MASKS = utilsBr.MASKS;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private addressService: AddressService,
    readonly snackBar: MatSnackBar,
  ) {
    super();

    this.validationMessages = {
      nome: {
        required: 'O nome é requerido.',
        minlength: 'O nome deve ter no mínimo 2 caracteres.',
        maxlength: 'O nome deve ter no máximo 150 caracteres.',
      },
      email: {
        required: 'O email é requerido.',
        email: 'O email deve ser válido.',
      },
      cpf: {
        required: 'O CPF é requerido.',
        cpf: 'O CPF deve ser válido.',
      },
      dataNascimento: {
        required: 'A data de nascimento é requerida.',
        date: 'A data de nascimento deve ser válida.',
      },
      cep: {
        required: 'O CEP é requerido.',
        cep: 'O CEP deve ser válido.',
      },
      estado: {
        required: 'O estado é requerido.',
        minlength: 'O estado deve ter no mínimo 2 caracteres.',
        maxlength: 'O estado deve ter no máximo 150 caracteres.',
      },
      cidade: {
        required: 'A cidade é requerida.',
        minlength: 'A cidade deve ter no mínimo 2 caracteres.',
        maxlength: 'A cidade deve ter no máximo 150 caracteres.',
      },
      bairro: {
        required: 'O bairro é requerido.',
        minlength: 'O bairro deve ter no mínimo 2 caracteres.',
        maxlength: 'O bairro deve ter no máximo 150 caracteres.',
      },
      logradouro: {
        required: 'O logradouro é requerido.',
        minlength: 'O logradouro deve ter no mínimo 2 caracteres.',
        maxlength: 'O logradouro deve ter no máximo 150 caracteres.',
      },
    };

    super.configureMessagesValidationBase(this.validationMessages);

    this.user = this.route.snapshot.data['user'];
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(150),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, NgBrazilValidators.cpf]],
      dataNascimento: ['', [Validators.required]],
      cep: ['', [Validators.required, NgBrazilValidators.cep]],
      estado: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(150),
        ],
      ],
      cidade: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(150),
        ],
      ],
      bairro: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(150),
        ],
      ],
      logradouro: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(150),
        ],
      ],
    });

    if (this.user) {
      this.fillUserForm(this.user);
    }
  }

  ngAfterViewInit(): void {
    super.configureFormValidationBase(this.formInputElements, this.userForm);
  }

  fillUserForm(user: User) {
    this.userForm.patchValue({
      nome: user.nome,
      email: user.email,
      cpf: user.cpf,
      dataNascimento: StringUtils.dateDatabaseToPtBr(user.dataNascimento),
      cep: user.cep,
      estado: user.estado,
      cidade: user.cidade,
      bairro: user.bairro,
      logradouro: user.logradouro,
    });
  }

  fillAddress(address: Address) {
    this.userForm.patchValue({
      estado: address.uf,
      cidade: address.localidade,
      bairro: address.bairro,
      logradouro: address.logradouro,
    });
  }

  searchAddress(cep: string) {
    cep = StringUtils.onlyNumber(cep);
    if (cep.length < 8) return;

    this.addressService.getAddress(cep).subscribe(
      (address) => {
        if (this.isAddress(address)) {
          this.fillAddress(address);
        } else {
          this.snackBar.open('CEP não encontrado', 'Ok', { duration: 3000 });
        }
      },
      () => {
        this.snackBar.open('CEP não encontrado.', 'OK', { duration: 5000 });
      },
    );
  }

  isAddress(obj: any): obj is Address {
    return obj && typeof obj === 'object' && 'cep' in obj;
  }

  submit(): void {
    if (this.userForm.valid) {
      const user: User = Object.assign(this.user || {}, this.userForm.value, {
        cpf: StringUtils.onlyNumber(this.userForm.value.cpf),
        dataNascimento: StringUtils.toDateDatabase(
          this.userForm.value.dataNascimento,
        ),
        cep: StringUtils.onlyNumber(this.userForm.value.cep),
      });

      if (user.id) {
        this.userService.updateUser(user).subscribe(
          () => {
            this.router.navigate(['/user/list']);
            this.snackBar.open('Usuário atualizado com sucesso!', '', {
              duration: 5000,
            });
          },
          (erro) => this.errors.push(erro),
        );
      } else {
        this.userService.createUser(user).subscribe(() => {
          this.router.navigate(['/user/list']);
          this.snackBar.open('Usuário criado com sucesso!', '', {
            duration: 5000,
          });
        });
      }
    }
  }

  cep(): AbstractControl | null {
    return this.userForm.get('cep');
  }
}
