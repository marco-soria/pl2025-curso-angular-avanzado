// Mock de @faker-js/faker para Jest
export const faker = {
  string: {
    uuid: () => '123e4567-e89b-12d3-a456-426614174000',
    alpha: () => 'abc',
    alphanumeric: () => 'abc123',
  },
  number: {
    int: (options?: { min?: number; max?: number }) => {
      const min = options?.min ?? 0;
      const max = options?.max ?? 100;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    float: (options?: {
      min?: number;
      max?: number;
      fractionDigits?: number;
    }) => {
      const min = options?.min ?? 0;
      const max = options?.max ?? 100;
      const value = Math.random() * (max - min) + min;
      const fractionDigits = options?.fractionDigits ?? 2;
      return parseFloat(value.toFixed(fractionDigits));
    },
  },
  lorem: {
    words: (count = 3) => Array(count).fill('lorem').join(' '),
    sentence: () => 'Lorem ipsum dolor sit amet.',
    paragraph: () => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    slug: (wordCount = 3) =>
      Array(wordCount)
        .fill(0)
        .map((_, i) => `word${i + 1}`)
        .join('-'),
  },
  image: {
    url: () => {
      const random = Math.floor(Math.random() * 10000);
      return `https://picsum.photos/640/480?random=${random}`;
    },
    urlPicsumPhotos: (options?: { width?: number; height?: number }) => {
      const width = options?.width ?? 640;
      const height = options?.height ?? 480;
      const random = Math.floor(Math.random() * 10000);
      return `https://picsum.photos/${width}/${height}?random=${random}`;
    },
  },
  commerce: {
    productName: () => 'Generic Product',
    productDescription: () => 'This is a generic product description.',
    price: (options?: { min?: number; max?: number; dec?: number }) => {
      const min = options?.min ?? 1;
      const max = options?.max ?? 1000;
      const dec = options?.dec ?? 2;
      const price = Math.random() * (max - min) + min;
      return price.toFixed(dec);
    },
    department: () => 'Electronics',
  },
  date: {
    recent: () => new Date(),
    past: () => new Date(Date.now() - 86400000),
  },
  datatype: {
    boolean: () => Math.random() > 0.5,
  },
};
