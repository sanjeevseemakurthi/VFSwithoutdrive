import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatenewuserComponent } from './createnewuser.component';

describe('CreatenewuserComponent', () => {
  let component: CreatenewuserComponent;
  let fixture: ComponentFixture<CreatenewuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatenewuserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatenewuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
