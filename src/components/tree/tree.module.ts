import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeComponent } from './tree.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { EditNodeModule } from '../edit-node/edit-node.module';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    TreeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    EditNodeModule,
    MatButtonModule,
    HttpClientModule,
    
  ],
  exports: [
    TreeComponent
  ],
})
export class TreeModule { }
