import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  service = inject(Auth);
  email = '';
  password = '';

  login() {
    this.service.login(this.email).subscribe({
      next: (data: any[]) => {
        console.log('DATA =', data);
        if (data.length > 0 && data[0].password === this.password) {
          console.log('Connexion réussie');
          console.log('Utilisateur ', data[0]);
        } else {
          console.log('Email ou mot de passe incorrect');
        }
      },
      error: (erreur: any) => {
        console.log('Erreur de connexion', erreur);
      }
    });
  }
}