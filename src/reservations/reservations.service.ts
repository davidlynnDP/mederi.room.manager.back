import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateReservationDto, UpdateReservationDto } from './dto';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dto';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersService } from 'src/users/users.service';
import { fieldsForReservations } from './constants';

interface FiltersReservationsParams {
  userId?: string;
  roomId?: string;
  paginationDto?: PaginationDto;
}

@Injectable()
export class ReservationsService extends PrismaClient implements OnModuleInit {
  
  private readonly logger = new Logger('ReservationsService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  constructor(
    private readonly commonService: CommonService,

    private readonly usersService: UsersService,

    private readonly roomsService: RoomsService
  ) {
    super();
  }

  private validateDates(startTime?: string, endTime?: string): void {
    if (startTime && endTime) {
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
  
      if (startDate >= endDate) {
        throw new BadRequestException('startTime must be before endTime');
      }
    }
  }
  
  async createReservation(createReservationDto: CreateReservationDto) {

    const { userId, roomId, ...reservationData } = createReservationDto;
    try {
      await this.usersService.findOneUser({ id: userId });
      await this.roomsService.findRoomById(roomId);

      return await this.reservation.create({
        data: {
          ...reservationData,
          userId,
          roomId,
        },
        include: fieldsForReservations
      });

    } catch (error) {
      this.commonService.globalErrorHandler(error);
    }
  }

  async findAllReservations(paginationDto: PaginationDto) {

    const { page, limit, status } = paginationDto;

    const totalPages = await this.reservation.count({ where: { status } }); 
    const lastPage = Math.ceil(totalPages / limit);
    
    return {
      data: await this.reservation.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { 
          status
        },
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findReservationById(id: string) {

    const reservation = await this.reservation.findFirst({
      where: {
        id: id
      },
      include: fieldsForReservations
    });
  
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${ id } not found`);
    }
    
    return reservation;
  }

  async updateReservation(id: string, updateReservationDto: UpdateReservationDto) {

    await this.findReservationById(id);

    try {
      this.validateDates(updateReservationDto.startTime, updateReservationDto.endTime);

      return this.reservation.update({
        where: { id },
        data: updateReservationDto,
        include: fieldsForReservations
      });
      
    } catch (error) {
      this.commonService.globalErrorHandler(error);
    }
  }

  async deleteReservation(id: string) {

    await this.findReservationById(id);

    try {
      return this.reservation.delete({
        where: { id },
      });
    } catch (error) {
      this.commonService.globalErrorHandler(error);
    }
  }

  async getReservationsByUser(userId: string, paginationDto: PaginationDto) {

    try {
      await this.usersService.findOneUser({ id: userId });

      return await this.getReservations({
        userId,
        paginationDto
      });

    } catch (error) {
      this.commonService.globalErrorHandler(error);
    }
  }

  async getReservationsByRoom(roomId: string, paginationDto: PaginationDto) {

    try {
      await this.roomsService.findRoomById(roomId);

      return await this.getReservations({
        roomId,
        paginationDto
      });

    } catch (error) {
      this.commonService.globalErrorHandler(error);
    }
  }

  private async getReservations({ userId, roomId, paginationDto }: FiltersReservationsParams) {
  
    const { page, limit, status } = paginationDto;

    const totalPages = await this.reservation.count({ where: { status } }); 
    const lastPage = Math.ceil(totalPages / limit);
  
    try {

      return {
        data: await this.reservation.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: {
            ...(userId && { userId }),
            ...(roomId && { roomId }),
            ...(status && { status }),
          },
        }),
        meta: {
          total: totalPages,
          page: page,
          lastPage: lastPage,
        },
      };

    } catch (error) {
      this.commonService.globalErrorHandler(error);
    }
  }
  
}
