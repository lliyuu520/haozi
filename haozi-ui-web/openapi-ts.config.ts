import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:8080/v3/api-docs',
  output: {
    path: './src/client/generated',
    format: 'prettier',
  },
  plugins: ['@hey-api/client-axios', '@tanstack/react-query', '@hey-api/typescript'],
});
