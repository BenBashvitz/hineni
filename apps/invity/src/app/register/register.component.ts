import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

function IDValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const id = String(control.value).trim();

    if (id.length !== 9 || isNaN(+id))
      return {
        invalid: true,
      };

    if (
      Array.from(id, Number).reduce((counter, digit, i) => {
        const step = digit * ((i % 2) + 1);
        return counter + (step > 9 ? step - 9 : step);
      }) %
        10 ===
      0
    ) {
      return null;
    }

    return {
      invalid: true,
    };
  };
}

function GuestFormGroup() {
  return new FormGroup({
    name: new FormControl('', [Validators.required]),
    id: new FormControl(null, [Validators.required, IDValidator()]),
  });
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.less',
})
export class RegisterComponent {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  guestsFormArray = new FormArray([GuestFormGroup()]);

  inviteForm = new FormGroup({
    email: this.emailFormControl,
    guests: this.guestsFormArray,
  });

  matcher = new MyErrorStateMatcher();

  constructor(private http: HttpClient) {}

  async onSubmit() {
    await lastValueFrom(
      this.http.post('http://localhost:3000/api/guests/save', {
        ...this.inviteForm.value,
      })
    );
  }

  onAddGuest() {
    this.guestsFormArray.push(GuestFormGroup());
  }

  onRemoveGuest(index: number) {
    this.guestsFormArray.removeAt(index);
  }
}
