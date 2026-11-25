import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-qr-code-list-item',
  templateUrl: './qr-code-list-item.component.html',
  styleUrls: ['./qr-code-list-item.component.scss']
})
export class QrCodeListItemComponent {
  @Input() title: string = '';
  @Input() id: number = 0;
  @Input() desc: string = '';
  @Output() delete: EventEmitter<number> = new EventEmitter<number>()
  onDeleteClick() {
    this.delete.emit(this.id);
  }
}
