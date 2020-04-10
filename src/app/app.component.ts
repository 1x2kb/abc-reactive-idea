import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject, interval, combineLatest } from 'rxjs';
import { map, takeUntil, publishReplay, refCount } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnDestroy  {
  a$: Observable<number>;
  aSquared$: Observable<number>;
  sqrtA$: Observable<number>;

  b$: Observable<number>;
  c$: Observable<number>;

  hideAValues: boolean = true;

  bInterval: number = 3000;
  cInterval: number = 7000;

  numberOffset = 100;
  shouldRound = true;

  private complete$ = new Subject<boolean>();

  constructor() {
    this.updateObservables();
  }

  ngOnDestroy() {
    this.complete$.next(true);
  }

  public updateObservables() {
    this.complete$.next(true);

    this.b$ = interval(this.bInterval).pipe(
      takeUntil(this.complete$),
      map(_ => Math.random() * this.numberOffset),
      map(value => this.doRound(value, this.shouldRound)),
      publishReplay(1),
      refCount()
    );

    this.c$ = interval(this.cInterval).pipe(
      takeUntil(this.complete$),
      map(_ => Math.random() * this.numberOffset),
      map(value => this.doRound(value, this.shouldRound)),
      publishReplay(1),
      refCount()
    );

    this.a$ = combineLatest(this.b$, this.c$)
    .pipe(
      takeUntil(this.complete$),
      map(([b, c]) => b + c),
      publishReplay(1),
      refCount()
    );

    this.aSquared$ = this.a$.pipe(
      takeUntil(this.complete$),
      map(a => a * a),
      map(aSquared => this.doRound(aSquared, this.shouldRound))
    );

    this.sqrtA$ = this.a$.pipe(
      takeUntil(this.complete$),
      map(a => Math.sqrt(a)),
      map(sqrtA => this.doRound(sqrtA, this.shouldRound))
    )
  }

  private doRound(value: number, shouldRound = true) {
    return shouldRound ? Math.round(value) : value;
  }
}
