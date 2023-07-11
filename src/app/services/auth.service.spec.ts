import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { Auth } from '../models/auth.model';
import { environment } from './../../environments/environment';

describe('AuthService', () => {
  let authService: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        AuthService,
        TokenService,
      ]
    });
    authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be create', () => {
    expect(authService).toBeTruthy();
  });

  describe('tests for login()', () => {

    it('Deberia return a token', (doneFn) => {
      //Arrange
      const mockData: Auth = {
        access_token: '121212'
      };
      const email = 'nico@gmail.com';
      const password = '1212';
      //Act
      authService.login(email, password)
      .subscribe((data)=> {
        //Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('Deberia call to saveToken()', (doneFn) => {
      //Arrange
      const mockData: Auth = {
        access_token: '121212'
      };
      const email = 'nico@gmail.com';
      const password = '1212';
      //!!!!!!!!!!
      spyOn(tokenService, 'saveToken').and.callThrough(); // espia y no ejecuta el metodo,
      //Act
      authService.login(email, password)
      .subscribe((data)=> {
        //Assert
        expect(data).toEqual(mockData);
        expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
        expect(tokenService.saveToken).toHaveBeenCalledOnceWith('121212'); //para ver debio ser llamado con cual argumento "121212" que enviamos
        //saveToken('121212')
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    })
  })

});
