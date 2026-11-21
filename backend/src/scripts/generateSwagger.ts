// @ts-ignore
import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';
import swaggerConfig from '../config/swaggerConfig';

const swaggerSpec = swaggerJsdoc(swaggerConfig);

// Write the Swagger JSON to a file
const outputPath = path.resolve(__dirname, '../../swagger.json');
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), 'utf-8');

console.log(`Swagger documentation has been generated at ${outputPath}`);