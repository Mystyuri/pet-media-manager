import 'reflect-metadata';
import { User, UserModel } from '../../entities/user.js';
import { UserResolver } from '../user-resolver.js';
import { generateJwt } from '../../../middleware/auth.js';

// Мокаем внешние зависимости
jest.mock('../../entities/user.js', () => {
  const mockUser = {
    id: '123456',
    email: 'test@example.com',
    password: 'hashedPassword',
    comparePassword: jest.fn(),
    save: jest.fn(),
  };

  const UserModelMock = jest.fn().mockImplementation((data) => {
    const user = {
      ...mockUser,
      ...data,
      save: jest.fn().mockResolvedValue({ ...mockUser, ...data }),
    };
    return user;
  }) as jest.Mock & {
    findById: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
  };

  UserModelMock.findById = jest.fn();
  UserModelMock.findOne = jest.fn();
  UserModelMock.create = jest.fn().mockImplementation((data) => {
    const user = new UserModelMock(data);
    return user;
  });

  return {
    UserModel: UserModelMock,
    User: jest.fn().mockImplementation(() => mockUser),
  };
});

jest.mock('../../../middleware/auth.js', () => ({
  generateJwt: jest.fn(),
}));

describe('UserResolver', () => {
  const mockUser = {
    id: '123456',
    email: 'test@example.com',
    password: 'hashedPassword',
    comparePassword: jest.fn(),
    save: jest.fn(),
  } as unknown as User;

  const mockToken = 'mock.jwt.token';

  beforeEach(() => {
    jest.clearAllMocks();
    (generateJwt as jest.Mock).mockReturnValue(mockToken);
  });

  describe('me', () => {
    it('Возращение пользователя и токен', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

      const resolver = new UserResolver();
      const result = await resolver.me(mockUser);

      expect(UserModel.findById).toHaveBeenCalledWith(mockUser.id);

      expect(result.token).toBe(mockToken);
      expect(result.user.id).toBe(mockUser.id);
      expect(result.user.email).toBe(mockUser.email);
      expect(result.user.password).toBe(mockUser.password);
    });

    it('Ошибка если пользователь не найден', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);

      const resolver = new UserResolver();

      await expect(resolver.me(mockUser)).rejects.toThrow('User not found');
    });
  });

  describe('signUp', () => {
    const userInput = {
      email: 'new@example.com',
      password: 'password123',
    };

    it('Создание нового пользователя и токен', async () => {
      const resolver = new UserResolver();
      const result = await resolver.signUp(userInput);

      expect(UserModel).toHaveBeenCalledWith(userInput);

      expect(result.token).toBe(mockToken);
      expect(result.user.id).toBe(mockUser.id);
      expect(result.user.email).toBe(userInput.email);
      expect(result.user.password).toBe(userInput.password);
    });

    it('Ошибка при неудачном сохранении', async () => {
      const mockNewUser = {
        ...mockUser,
        save: jest.fn().mockRejectedValue(new Error('Save failed')),
      };
      (UserModel as unknown as jest.Mock).mockImplementation(() => mockNewUser);

      const resolver = new UserResolver();

      await expect(resolver.signUp(userInput)).rejects.toThrow('Save failed');
    });
  });

  describe('signIn', () => {
    const userInput = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('Авторизация пользователя', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
      (mockUser.comparePassword as jest.Mock).mockResolvedValue(true);

      const resolver = new UserResolver();
      const result = await resolver.signIn(userInput);

      expect(UserModel.findOne).toHaveBeenCalledWith({ email: userInput.email });
      expect(mockUser.comparePassword).toHaveBeenCalledWith(userInput.password);

      expect(result.token).toBe(mockToken);
      expect(result.user.id).toBe(mockUser.id);
      expect(result.user.email).toBe(mockUser.email);
      expect(result.user.password).toBe(mockUser.password);
    });

    it('Ошибка при неверном email', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      const resolver = new UserResolver();

      await expect(resolver.signIn(userInput)).rejects.toThrow('Invalid email or password');
    });

    it('Ошибка при неверном пароле', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
      (mockUser.comparePassword as jest.Mock).mockResolvedValue(false);

      const resolver = new UserResolver();

      await expect(resolver.signIn(userInput)).rejects.toThrow('Invalid email or password');
    });
  });
});
