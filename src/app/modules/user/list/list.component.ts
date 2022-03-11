import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user';
import UserService from 'src/app/modules/user/services/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  columns: string[] = [
    'nome',
    'email',
    'cpf',
    'dataNascimento',
    'cep',
    'estado',
    'cidade',
    'option',
  ];
  users: User[] = [];

  constructor(
    private userService: UserService,
    readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users;
    });
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user.id).subscribe(() => {
      this.users = this.users.filter((u) => u.id !== user.id);
      this.snackBar.open('Usuário excluído com sucesso!', '', {
        duration: 5000,
      });
    });
  }
}
