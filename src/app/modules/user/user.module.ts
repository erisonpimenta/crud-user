import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';
import { NgBrazil } from 'ng-brazil';
import { MaterialModule } from 'src/app/material/material.module';
import { AddressService } from 'src/app/services/address.service';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';
import { UserResolve } from './services/user.resolve';
import UserService from './services/user.service';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
  declarations: [UserComponent, FormComponent, ListComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    NgBrazil,
  ],
  providers: [UserService, UserResolve, AddressService],
})
export class UserModule {}
