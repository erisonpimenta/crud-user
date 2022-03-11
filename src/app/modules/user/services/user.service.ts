import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';

@Injectable()
export default class UserService {
  constructor() {}

  private getLastId(): string {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const lastUser = users[users.length - 1];
    return lastUser ? lastUser.id : '0';
  }

  getAllUsers(): Observable<User[]> {
    return new Observable<User[]>((observer) => {
      const users = localStorage.getItem('users');
      observer.next(users ? JSON.parse(users) : []);
      observer.complete();
    });
  }

  getUserById(id: string): Observable<User> {
    return new Observable<User>((observer) => {
      this.getAllUsers().subscribe((users: User[]) => {
        const user = users.find((u: User) => u.id === id);
        observer.next(user);
        observer.complete();
      });
    });
  }

  updateUser(user: User): Observable<User> {
    return new Observable<User>((observer) => {
      this.getAllUsers().subscribe((users: User[]) => {
        const userIndex = users.findIndex((u: User) => u.id === user.id);
        if (userIndex >= 0) {
          users[userIndex] = user;
          localStorage.setItem('users', JSON.stringify(users));
        }
        observer.next(user);
        observer.complete();
      });
    });
  }

  createUser(user: User): Observable<User> {
    return new Observable<User>((observer) => {
      this.getAllUsers().subscribe((users: User[]) => {
        user.id = String(Number(this.getLastId()) + 1);
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        observer.next(user);
        observer.complete();
      });
    });
  }

  deleteUser(id: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.getAllUsers().subscribe((users: User[]) => {
        const userIndex = users.findIndex((u: User) => u.id === id);
        if (userIndex >= 0) {
          users.splice(userIndex, 1);
          localStorage.setItem('users', JSON.stringify(users));
        }
        observer.next();
        observer.complete();
      });
    });
  }
}
