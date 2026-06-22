import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapMarker } from '../../shared/components/map-container/map-container.component';
import { OrderStatus } from '../../shared/constants/enums';
import { TripOrder } from '../../shared/models/trip-order.model';
import { ApiService } from '../../shared/services/api.service';

@Component({ standalone: false,
  template: `<section class="page" *ngIf="order"><h1>{{ order.order_no }}</h1><div class="split"><app-map-container [markers]="markers" [path]="path"></app-map-container><aside class="panel"><p>{{ order.start_location }} → {{ order.end_location }}</p><p>{{ order.distance }} km · {{ order.duration }} 分钟 · ¥{{ order.fare }}</p><p *ngIf="order.status === 'CANCELLED'" class="cancel-fee">取消费用：¥{{ order.cancel_fee }}</p><app-status-tag [value]="order.status"></app-status-tag><div class="actions" *ngIf="canCancel"><button mat-raised-button color="warn" (click)="cancel()">取消订单</button></div></aside></div></section>`,
  styles: [`.cancel-fee{color:#b33b2e;font-weight:700}.actions{margin-top:16px}`]
})
export class OrderDetailComponent implements OnInit {
  order?: TripOrder;
  markers: MapMarker[] = [];
  path: Array<[number, number]> = [];
  constructor(private route: ActivatedRoute, private api: ApiService) {}
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.load(id);
  }
  load(id: number): void {
    this.api.listOrders().subscribe(items => {
      this.order = items.find(o => o.id === id);
      if (this.order) {
        this.markers = [
          { lng: Number(this.order.start_lng), lat: Number(this.order.start_lat), label: '起点' },
          { lng: Number(this.order.end_lng), lat: Number(this.order.end_lat), label: '终点' }
        ];
        this.path = this.markers.map(m => [m.lng, m.lat]);
      }
    });
  }
  get canCancel(): boolean {
    if (!this.order) return false;
    return this.order.status === OrderStatus.PENDING || this.order.status === OrderStatus.ACCEPTED;
  }
  cancel(): void {
    if (!this.order) return;
    if (!confirm('确定要取消该订单吗？')) return;
    this.api.cancelOrder(this.order.id).subscribe(o => {
      this.order = o;
    });
  }
}
