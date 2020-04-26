import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableArmiesComponent } from './available-armies.component';

describe('AvailableArmiesComponent', () => {
  let component: AvailableArmiesComponent;
  let fixture: ComponentFixture<AvailableArmiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableArmiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableArmiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
