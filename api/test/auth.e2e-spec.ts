import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/database/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
    prisma = app.get(PrismaService);

    // Clean DB before starting
    await cleanDb();
  });

  afterAll(async () => {
    // Clean DB after tests
    await cleanDb();
    await app.close();
  });

  async function cleanDb() {
    // Wrap deletes in try/catch to avoid errors if tables don't exist yet or are empty
    try {
      await prisma.doctorSpecialization.deleteMany({});
      await prisma.doctor.deleteMany({});
      await prisma.patient.deleteMany({});
      await prisma.profileDetails.deleteMany({});
      await prisma.address.deleteMany({});
      await prisma.user.deleteMany({});
    } catch (e) {
      console.warn('DB cleanup warning:', e);
    }
  }

  describe('/auth/register/patient (POST)', () => {
    const validPatientPayload = {
      email: 'patient@test.com',
      password: 'password123',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01',
        gender: 'Male',
        phoneNumber: '09171234567',
      },
      address: {
        streetLine1: '123 Rizal St',
        city: 'Manila',
        country: 'Philippines',
      },
      weight: 70.5,
      height: 175.2,
    };

    it('should successfully register a patient', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register/patient')
        .send(validPatientPayload)
        .expect(201);

      expect(response.body).toHaveProperty('userId');
      expect(response.body.email).toBe(validPatientPayload.email);
      expect(response.body.role).toBe('PATIENT');
      expect(response.body).toHaveProperty('patientId');
      expect(response.body.firstName).toBe(validPatientPayload.profile.firstName);
      expect(response.body.lastName).toBe(validPatientPayload.profile.lastName);
    });

    it('should fail if email already exists', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register/patient')
        .send(validPatientPayload)
        .expect(409);
    });

    it('should fail validation with invalid email', async () => {
      const invalidPayload = {
        ...validPatientPayload,
        email: 'invalid-email',
      };
      await request(app.getHttpServer())
        .post('/api/auth/register/patient')
        .send(invalidPayload)
        .expect(400);
    });
  });

  describe('/auth/register/doctor (POST)', () => {
    const validDoctorPayload = {
      email: 'doctor@test.com',
      password: 'password123',
      profile: {
        firstName: 'Jane',
        lastName: 'Smith',
        birthDate: '1985-05-15',
        gender: 'Female',
        phoneNumber: '09187654321',
      },
      address: {
        streetLine1: '456 Quezon Ave',
        city: 'Quezon City',
        country: 'Philippines',
      },
      licenseNumber: 'PRC-123456',
      bio: 'Experienced General Practitioner',
      yearsOfExperience: 10,
      consultationFee: 500,
    };

    it('should successfully register a doctor', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register/doctor')
        .send(validDoctorPayload)
        .expect(201);

      expect(response.body).toHaveProperty('userId');
      expect(response.body.email).toBe(validDoctorPayload.email);
      expect(response.body.role).toBe('DOCTOR');
      expect(response.body).toHaveProperty('doctorId');
      expect(response.body.firstName).toBe(validDoctorPayload.profile.firstName);
      expect(response.body.lastName).toBe(validDoctorPayload.profile.lastName);
      expect(response.body.licenseNumber).toBe(validDoctorPayload.licenseNumber);
    });

    it('should fail if license number already exists', async () => {
      const duplicateLicensePayload = {
        ...validDoctorPayload,
        email: 'anotherdoctor@test.com', // different email, same license
      };
      await request(app.getHttpServer())
        .post('/api/auth/register/doctor')
        .send(duplicateLicensePayload)
        .expect(409);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should successfully log in with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'patient@test.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('patient@test.com');
      expect(response.body.user.role).toBe('PATIENT');
    });

    it('should fail with invalid password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'patient@test.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should fail with non-existent email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123',
        })
        .expect(401);
    });

    it('should fail validation with invalid email format', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'not-an-email',
          password: 'password123',
        })
        .expect(400);
    });
  });
});
