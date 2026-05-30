import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const specializationsList = [
  { name: 'General Medicine', description: 'Primary care and general health management' },
  { name: 'Cardiology', description: 'Heart and cardiovascular system health' },
  { name: 'Pediatrics', description: 'Medical care for infants, children, and adolescents' },
  { name: 'Dermatology', description: 'Skin, hair, and nail conditions' },
  { name: 'Psychiatry', description: 'Mental health and psychiatric care' },
  { name: 'Neurology', description: 'Brain, nervous system, and spinal cord disorders' },
  { name: 'Orthopedics', description: 'Musculoskeletal system care (bones, joints, muscles)' },
  { name: 'Internal Medicine', description: 'Prevention, diagnosis, and treatment of internal diseases' },
  { name: 'Obstetrics and Gynecology', description: 'Women\'s reproductive health and pregnancy care' },
  { name: 'Ophthalmology', description: 'Eye and vision care' },
];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Seeding specializations...');

  for (const spec of specializationsList) {
    const existing = await prisma.specialization.findUnique({
      where: { name: spec.name },
    });

    if (!existing) {
      await prisma.specialization.create({
        data: {
          name: spec.name,
          description: spec.description,
        },
      });
      console.log(`Created specialization: ${spec.name}`);
    } else {
      console.log(`Skipped specialization (already exists): ${spec.name}`);
    }
  }

  await prisma.$disconnect();
  await pool.end();
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  });
