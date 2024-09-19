import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtOauthGuard } from 'src/auth/guards/jwt.oauth.guard';
import { PaginationDto } from 'src/common/dto';

enum ReservationStatus {
  CONFIRMADO = 'CONFIRMADO',
  CANCELADO = 'CANCELADO',
  PENDIENTE = 'PENDIENTE',
}

@UseGuards(JwtOauthGuard)
@Controller('reservations')
export class ReservationsController {
  
  constructor(
    private readonly reservationsService: ReservationsService
  ) {}

  /**
   * Create a new reservation
   * POST /reservations
   */
  @Post()
  async createReservation(
    @Body() createReservationDto: CreateReservationDto
  ) {
    return await this.reservationsService.createReservation(createReservationDto);
  }

  /**
   * Get all reservations with pagination
   * GET /reservations/find
   * @param paginationDto Contains pagination options (e.g., page, limit)
   */
  @Get('find')
  async findAllReservations(
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: ReservationStatus,
  ) {
    return await this.reservationsService.findAllReservations(paginationDto, status);
  }

  /**
   * Get a reservation by its ID
   * GET /reservations/find/:id
   * @param id The UUID of the reservation
   */
  @Get('find/:id')
  async getReservationById(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.reservationsService.findReservationById(id);
  }

  /**
   * Update a reservation by its ID
   * PATCH /reservations/:id
   * @param id The UUID of the reservation to update
   * @param updateReservationDto Data Transfer Object for updating a reservation
   */
  @Patch(':id')
  async updateReservation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return await this.reservationsService.updateReservation(id, updateReservationDto);
  }

  /**
   * Delete a reservation by its ID
   * DELETE /reservations/:id
   * @param id The UUID of the reservation to delete
   */
  @Delete(':id')
  async deleteReservation(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.reservationsService.deleteReservation(id);
  }

  /**
   * Get all reservations for a specific user by their ID
   * GET /reservations/user/:userId
   * @param userId The UUID of the user to fetch reservations for
   */
  @Get('/user/:userId')
  async getReservationsByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: ReservationStatus,
  ) {
    return await this.reservationsService.getReservationsByUser(userId, paginationDto, status);
  }

  /**
   * Get all reservations for a specific room by its ID
   * GET /reservations/room/:roomId
   * @param roomId The UUID of the room to fetch reservations for
   */
  @Get('/room/:roomId')
  async getReservationsByRoom(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: ReservationStatus,
  ) {
    return await this.reservationsService.getReservationsByRoom(roomId, paginationDto, status);
  }
}
