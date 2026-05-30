import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { IEncryptionService } from './interfaces/encryption.service.interface';
import { UserRepository } from '../users/repositories/user.repository';
import { PatientRepository } from '../patients/repositories/patient.repository';
import { DoctorRepository } from '../doctors/repositories/doctor.repository';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryptionService: IEncryptionService,
    private readonly userRepository: UserRepository,
    private readonly patientRepository: PatientRepository,
    private readonly doctorRepository: DoctorRepository,
    private readonly jwtService: JwtService,
  ) {}

  async registerPatient(dto: RegisterPatientDto) {
    // 1. Check if email already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // 2. Hash password
    const passwordHash = await this.encryptionService.hash(dto.password);

    // 3. Database transaction for atomic creation
    return this.prisma.$transaction(async (tx) => {
      // Create user
      const user = await this.userRepository.create(
        {
          email: dto.email,
          passwordHash,
          role: UserRole.PATIENT,
          isVerified: false,
        },
        tx,
      );

      // Create address
      const address = await tx.address.create({
        data: {
          streetLine1: dto.address.streetLine1,
          streetLine2: dto.address.streetLine2,
          barangay: dto.address.barangay,
          city: dto.address.city,
          province: dto.address.province,
          region: dto.address.region,
          zipCode: dto.address.zipCode,
          country: dto.address.country || 'Philippines',
        },
      });

      // Create profile details
      const profileDetails = await tx.profileDetails.create({
        data: {
          firstName: dto.profile.firstName,
          middleName: dto.profile.middleName,
          lastName: dto.profile.lastName,
          suffix: dto.profile.suffix,
          birthDate: new Date(dto.profile.birthDate),
          gender: dto.profile.gender,
          phoneNumber: dto.profile.phoneNumber,
          profilePicture: dto.profile.profilePicture,
          addressId: address.id,
        },
      });

      // Create patient record
      const patient = await this.patientRepository.create(
        {
          user: { connect: { id: user.id } },
          profileDetails: { connect: { id: profileDetails.id } },
          weight: dto.weight,
          height: dto.height,
          bloodType: dto.bloodType,
          emergencyContactName: dto.emergencyContactName,
          emergencyContactNumber: dto.emergencyContactNumber,
        },
        tx,
      );

      return {
        userId: user.id,
        email: user.email,
        role: user.role,
        patientId: patient.id,
        firstName: profileDetails.firstName,
        lastName: profileDetails.lastName,
      };
    });
  }

  async registerDoctor(dto: RegisterDoctorDto) {
    // 1. Check if email already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // 2. Check if license number already exists
    const existingDoctor = await this.doctorRepository.findByLicenseNumber(dto.licenseNumber);
    if (existingDoctor) {
      throw new ConflictException('License number already in use');
    }

    // 3. Hash password
    const passwordHash = await this.encryptionService.hash(dto.password);

    // 4. Database transaction for atomic creation
    return this.prisma.$transaction(async (tx) => {
      // Create user
      const user = await this.userRepository.create(
        {
          email: dto.email,
          passwordHash,
          role: UserRole.DOCTOR,
          isVerified: false,
        },
        tx,
      );

      // Create address
      const address = await tx.address.create({
        data: {
          streetLine1: dto.address.streetLine1,
          streetLine2: dto.address.streetLine2,
          barangay: dto.address.barangay,
          city: dto.address.city,
          province: dto.address.province,
          region: dto.address.region,
          zipCode: dto.address.zipCode,
          country: dto.address.country || 'Philippines',
        },
      });

      // Create profile details
      const profileDetails = await tx.profileDetails.create({
        data: {
          firstName: dto.profile.firstName,
          middleName: dto.profile.middleName,
          lastName: dto.profile.lastName,
          suffix: dto.profile.suffix,
          birthDate: new Date(dto.profile.birthDate),
          gender: dto.profile.gender,
          phoneNumber: dto.profile.phoneNumber,
          profilePicture: dto.profile.profilePicture,
          addressId: address.id,
        },
      });

      // Create doctor record
      const doctor = await this.doctorRepository.create(
        {
          user: { connect: { id: user.id } },
          profileDetails: { connect: { id: profileDetails.id } },
          bio: dto.bio,
          licenseNumber: dto.licenseNumber,
          yearsOfExperience: dto.yearsOfExperience,
          consultationFee: dto.consultationFee,
        },
        tx,
      );

      // Create specializations mappings if any
      const specIdsToLink: string[] = [];

      if (dto.specializationIds && dto.specializationIds.length > 0) {
        specIdsToLink.push(...dto.specializationIds);
      }

      if (dto.specializationNames && dto.specializationNames.length > 0) {
        const resolvedSpecs = await Promise.all(
          dto.specializationNames.map(async (name) => {
            let spec = await tx.specialization.findUnique({
              where: { name },
            });
            if (!spec) {
              spec = await tx.specialization.create({
                data: { name },
              });
            }
            return spec;
          }),
        );
        specIdsToLink.push(...resolvedSpecs.map((s) => s.id));
      }

      if (specIdsToLink.length > 0) {
        const uniqueSpecIds = Array.from(new Set(specIdsToLink));
        await Promise.all(
          uniqueSpecIds.map((specId) =>
            tx.doctorSpecialization.create({
              data: {
                doctorId: doctor.id,
                specializationId: specId,
              },
            }),
          ),
        );
      }

      return {
        userId: user.id,
        email: user.email,
        role: user.role,
        doctorId: doctor.id,
        firstName: profileDetails.firstName,
        lastName: profileDetails.lastName,
        licenseNumber: doctor.licenseNumber,
      };
    });
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.encryptionService.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
