import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnActionsComponent } from './turn-actions.component';

describe('TurnActionsComponent', () => {
  let component: TurnActionsComponent;
  let fixture: ComponentFixture<TurnActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
