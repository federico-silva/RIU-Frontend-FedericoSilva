import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    });

    service = TestBed.inject(NotificationService);
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success', () => {
    it('should call snackBar.open with success configuration', () => {
      const message = 'Operation successful';
      
      service.success(message);

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        message,
        'Close',
        jasmine.objectContaining({
          duration: 4000,
          panelClass: 'snackbar-success',
        })
      );
    });

    it('should use custom action and duration', () => {
      const message = 'Custom success message';
      const action = 'OK';
      const duration = 5000;

      service.success(message, action, duration);

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        message,
        action,
        jasmine.objectContaining({
          duration: duration,
          panelClass: 'snackbar-success',
        })
      );
    });
  });
});