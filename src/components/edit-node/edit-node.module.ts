import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditNodeComponent } from './edit-node.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    EditNodeComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
  ],
  exports: [
    EditNodeComponent,
  ]
})
export class EditNodeModule { }
