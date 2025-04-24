import { keyToPath } from '../keyToPath.js';

const TEST_ENV = {
  AWS_URL: 'https://test-bucket.s3.amazonaws.com',
  AWS_BUCKET_PREFIX: 'uploads',
};

// Функция для генерации случайного ObjectId
const generateMockObjectId = () => {
  const randomId = Math.random().toString(16).substring(2, 24).padEnd(24, '0');
  return {
    toString: () => randomId,
  };
};

// Создаем мок ObjectId с рандомным значением
const mockObjectId = jest.fn().mockImplementation(generateMockObjectId);

// Подменяем mongoose.Types.ObjectId
jest.mock('mongoose', () => ({
  Types: {
    ObjectId: mockObjectId,
  },
}));

describe('keyToPath', () => {
  beforeAll(() => {
    process.env = TEST_ENV;
  });

  afterAll(() => {
    process.env = {};
  });

  it('Формирование URL по ключу', () => {
    const params = {
      userId: mockObjectId(),
      key: '1234567890',
      filename: 'test file.jpg',
    };

    const expectedUrl = `${TEST_ENV.AWS_URL}/${TEST_ENV.AWS_BUCKET_PREFIX}/${params.userId}/${params.key}-test+file.jpg`;
    expect(keyToPath(params)).toBe(expectedUrl);
  });

  it('Ошибка пустой key', () => {
    const invalidParams = {
      userId: mockObjectId(),
      key: '', // пустой ключ
      filename: 'test.jpg',
    };
    expect(() => keyToPath(invalidParams)).toThrow();
  });

  it('Ошибка env AWS_URL', () => {
    delete process.env.AWS_URL;
    const params = {
      userId: mockObjectId(),
      key: '1234567890',
      filename: 'test file.jpg',
    };
    expect(() => keyToPath(params)).toThrow();
  });
});
