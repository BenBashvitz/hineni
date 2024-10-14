import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  LOAD_WASM,
  NgxScannerQrcodeModule,
  NgxScannerQrcodeComponent,
  ScannerQRCodeResult,
} from 'ngx-scanner-qrcode';
import { lastValueFrom } from 'rxjs';

LOAD_WASM().subscribe();

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [NgxScannerQrcodeModule],
  templateUrl: './scanner.component.html',
  styleUrl: './scanner.component.less',
})
export class ScannerComponent {
  constructor(private http: HttpClient) {}

  async onData(
    event: ScannerQRCodeResult[],
    scanner: NgxScannerQrcodeComponent
  ) {
    scanner.stop();

    const papa = await lastValueFrom(
      this.http.post('http://localhost:3000/api/verify', {
        token: event[0].value,
      })
    );

    console.log(papa);

    alert(papa ? 'האורח נרשם בהצלחה' : 'האורח כבר נרשם או שהברקוד לא תקין');
  }

  onError(event: unknown) {
    console.log(event);
  }
}
