import { defineConfig } from 'prisma/config';
import 'dotenv/config';

// =============================================================================
// Prisma v7 Configuration
// Datasource connection URLs must be declared here, not in schema.prisma.
// Reference: https://pris.ly/d/config-datasource
// =============================================================================

export default defineConfig({
  schema: './prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
