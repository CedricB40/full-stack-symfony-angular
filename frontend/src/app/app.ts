import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User, UserService } from './services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  users = signal<User[]>([]);
  loading = signal(true);
  editingUser = signal<User | null>(null);
  userService = inject(UserService);

  userForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur getUsers :', err);
        this.loading.set(false);
      },
    });
  }

  startEdit(user: User) {
    this.editingUser.set(user);
    this.userForm.setValue({ name: user.name, email: user.email });
  }

  cancelEdit() {
    this.editingUser.set(null);
    this.userForm.reset();
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const { name, email } = this.userForm.getRawValue();
    const editing = this.editingUser();

    if (editing) {
      this.userService.updateUser(editing.id!, name, email).subscribe({
        next: () => {
          this.loadUsers();
          this.cancelEdit();
        },
        error: (err) => console.error('Erreur updateUser :', err),
      });
    } else {
      this.userService.addUser(name, email).subscribe({
        next: (user) => {
          this.users.update((list) => [...list, user]);
          this.userForm.reset();
        },
        error: (err) => console.error('Erreur addUser :', err),
      });
    }
  }

  deleteUser(id: number) {
    if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u.id !== id));
      },
      error: (err) => console.error('Erreur deleteUser :', err),
    });
  }
}
