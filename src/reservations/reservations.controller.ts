import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtOauthGuard } from 'src/auth/guards/jwt.oauth.guard';
import { PaginationDto } from 'src/common/dto';


@UseGuards(JwtOauthGuard)
@Controller('reservations')
export class ReservationsController {
  
  constructor(
    private readonly reservationsService: ReservationsService
  ) {}

  @Post()
  async createReservation(
    @Body() createReservationDto: CreateReservationDto
  ) {
    return await this.reservationsService.createReservation(createReservationDto);
  }

  @Get('find')
  async findAllReservations(
    @Query() paginationDto: PaginationDto
  ) {
    return await this.reservationsService.findAllReservations(paginationDto);
  }

  @Get('find/:id')
  async getReservationById(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.reservationsService.findReservationById(id);
  }

  @Patch(':id')
  async updateReservation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return await this.reservationsService.updateReservation(id, updateReservationDto);
  }

  @Delete(':id')
  async deleteReservation(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.reservationsService.deleteReservation(id);
  }

  @Get('/user/:userId')
  async getReservationsByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() paginationDto: PaginationDto
  ) {
    return await this.reservationsService.getReservationsByUser(userId, paginationDto);
  }

  @Get('/room/:roomId')
  async getReservationsByRoom(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Query() paginationDto: PaginationDto
  ) {
    return await this.reservationsService.getReservationsByRoom(roomId, paginationDto);
  }
}
