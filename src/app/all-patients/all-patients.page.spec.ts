import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllPatientsPage } from './all-patients.page';

describe('AllPatientsPage', () => {
  let component: AllPatientsPage;
  let fixture: ComponentFixture<AllPatientsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllPatientsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllPatientsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
