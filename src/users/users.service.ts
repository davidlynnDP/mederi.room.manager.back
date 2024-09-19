import { ConflictException, Injectable, Logger, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { CommonService } from 'src/common/common.service';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { salt } from 'src/config';
import { PaginationDto } from 'src/common/dto';

interface FindOneUserParams {
  id?: string;
  email?: string;
  includePassword?: boolean; 
}

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('UsersService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  constructor(
    private readonly commonService: CommonService
  ) {
    super();
  }

  async createUser(createUserDto: CreateUserDto) {

    const { identificationNumber, email, names, lastNames, password, role } = createUserDto;
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {

      const existingUser = await this.user.findUnique({
        where: {
          email: email,
        },
      });

      if (existingUser) {
        throw new ConflictException(`User with this email already exists`);
      }

      const newUser = await this.user.create({
        data: {
          identificationNumber: identificationNumber,
          email: email,
          names: names,
          lastNames: lastNames,
          password: hashedPassword,
          role: role,
        },
      });

      const { password: _, ...result } = newUser;

      return {
        ...result,
      };

    } catch (error) {
      this.commonService.globalErrorHandler(error);
    }

  }

  async loginUser(loginUserDto: LoginUserDto) { 

    const { email, password } = loginUserDto;

    try {
      const user = await this.user.findUnique({
        where: { 
          email: email, 
          isActive: true 
        }
      });

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Incorrect password');
      }

      const { password: _, ...result } = user;

      return {
        ...result,
      };

    } catch (error) {
      this.commonService.globalErrorHandler(error);
    }
  }

  async findAllUsers(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.user.count({ where: { isActive: true } }); 
    const lastPage = Math.ceil(totalPages / limit);

    const users = await this.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { isActive: true },
    });
  
    const sanitizedUsers = users.map(user => {
      const { password, ...result } = user;
      return result;
    });

    return {
      data: sanitizedUsers,
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findOneUser({ id, email, includePassword = false }: FindOneUserParams) {

    if (!id && !email) {
      throw new Error('At least one search parameter (id or email) must be provided');
    }
  
    const user = await this.user.findFirst({
      where: {
        ...(id && { id }),
        ...(email && { email }),
        isActive: true,
      },
    });
  
    if (!user) {
      const searchBy = id ? `ID ${ id }` : `email ${ email }`;
      throw new NotFoundException(`User with ${ searchBy } not found`);
    }
  
    return this.removePassword(user, includePassword);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {

    const user = await this.findOneUser({ id, includePassword: true }) as User;;
    const { password } = updateUserDto;

    const hashedPassword = password 
            ? bcrypt.hashSync(password, salt) 
            : user.password;

    const userUpdated = await this.user.update({
      where: { id: id },
      data: {
        ...updateUserDto,
        password: hashedPassword,
      },
    });

    const { password: _, ...result } = userUpdated;

    return {
      ...result,
    };
  }

  async removeUser(id: string) {

    await this.findOneUser({ id });

    //soft delete
    const user = await this.user.update({
      where: { id: id },
      data: {
        isActive: false,
      },
    });

    const { password: _, ...result } = user;

    return {
      ...result,
    };
  }

  private removePassword(user: User, includePassword: boolean): User | Omit<User, 'password'> {

    if (includePassword) {
      return user;
    } else {
      const { password, ...result } = user;
      return result;
    }
  }

}
