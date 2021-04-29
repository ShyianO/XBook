import { NgModule } from '@angular/core';

import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { MatRadioModule } from '@angular/material/radio';

const materialModules = [
  MatSliderModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatButtonModule,
  MatSelectModule,
  MatListModule,
  MatDividerModule,
  MatMenuModule,
  MatButtonToggleModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatSnackBarModule,
  MatFileUploadModule,
  MatRadioModule
];

@NgModule({
  imports: [materialModules],
  exports: [materialModules]
})
export class SharedModule {}
