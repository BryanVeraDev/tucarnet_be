import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'prisma/prisma.service';
import { AdminStatus } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.adminUser.findUnique({
      where: { admin_id: payload.sub },
      select: {
        admin_id: true,
        name: true,
        last_name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user || user.status === AdminStatus.INACTIVO) {
      throw new UnauthorizedException('Usuario inactivo o no válido');
    }

    return user;
  }
}