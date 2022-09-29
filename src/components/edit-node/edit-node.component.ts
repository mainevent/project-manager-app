import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-node',
  templateUrl: './edit-node.component.html',
  styleUrls: ['./edit-node.component.scss']
})
export class EditNodeComponent {
  name!: string;
  description!: string;
  status!: 'in-progress' | 'completed' | 'active';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditNodeComponent>,
    ) {
      if (data) {
        this.name = data.name;
        this.description = data.description;
        this.status = data.status;
      }
    }
  
  save() {
    this.dialogRef.close({
      name: this.name,
      description: this.description,
      status: this.status,
    });
  }

  dismiss() {
    this.dialogRef.close()
  }
}
