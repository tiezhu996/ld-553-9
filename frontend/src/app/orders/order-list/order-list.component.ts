import { Component, OnInit } from '@angular/core';
import { OrderStatus } from '../../shared/constants/enums';
import { TripOrder } from '../../shared/models/trip-order.model';
import { ApiService } from '../../shared/services/api.service';

@Component({ standalone: false,
  template: `<section class="page"><h1>出行订单</h1><div class="toolbar"><mat-form-field><mat-label>状态</mat-label><mat-select [(ngModel)]="status" (selectionChange)="load()"><mat-option value="">全部</mat-option><mat-option *ngFor="let s of statuses" [value]="s">{{ s | statusTranslate }}</mat-option></mat-select></mat-form-field></div><div class="table-wrap"><table><thead><tr><th>订单号</th><th>路线</th><th>车辆</th><th>距离</th><th>费用</th><th>取消费</th><th>订单状态</th><th>支付</th><th>操作</th></tr></thead><tbody><tr *ngFor="let o of orders"><td><a [routerLink]="['/orders', o.id]">{{ o.order_no }}</a></td><td>{{ o.start_location }} → {{ o.end_location }}</td><td>{{ o.vehicle_detail?.plate_number || '-' }}</td><td>{{ o.distance }} km</td><td>¥{{ o.fare }}</td><td><span *ngIf="o.status === 'CANCELLED'" class="cancel-fee">¥{{ o.cancel_fee }}</span><span *ngIf="o.status !== 'CANCELLED'">-</span></td><td><app-status-tag [value]="o.status"></app-status-tag></td><td><app-status-tag [value]="o.payment_status"></app-status-tag></td><td><button *ngIf="canCancel(o)" mat-button color="warn" (click)="cancel(o)">取消订单</button><span *ngIf="!canCancel(o) && o.status === 'CANCELLED'">已取消</span><span *ngIf="!canCancel(o) && o.status !== 'CANCELLED'">-</span></td></tr></tbody></table></div></section>`,
  styles: [`.cancel-fee{color:#b33b2e;font-weight:700}`]
})
export class OrderListComponent implements OnInit {
  orders: TripOrder[] = [];
  status = '';
  statuses = Object.values(OrderStatus);
  constructor(private api: ApiService) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.api.listOrders({ status: this.status }).subscribe(orders => this.orders = orders); }
  canCancel(o: TripOrder): boolean {
    return o.status === OrderStatus.PENDING || o.status === OrderStatus.ACCEPTED;
  }
  cancel(o: TripOrder): void {
    if (!confirm('确定要取消该订单吗？')) return;
    this.api.cancelOrder(o.id).subscribe(() => this.load());
  }
}
