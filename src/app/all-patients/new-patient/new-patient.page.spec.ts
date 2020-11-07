import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewPatientPage } from './new-patient.page';

describe('NewPatientPage', () => {
  let component: NewPatientPage;
  let fixture: ComponentFixture<NewPatientPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPatientPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewPatientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
