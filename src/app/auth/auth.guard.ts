import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import {getAuth} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  async canActivate(): Promise<boolean | UrlTree> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      return true; // User is authenticated, allow access
    } else {
      return false; // User is not authenticated, deny access
    }
  }
}

